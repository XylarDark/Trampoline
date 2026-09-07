/**
 * A Postgres for demos, with no Docker.
 *
 * Serves PGlite over a TCP socket on the same port and credentials the Docker
 * Compose service uses, so `DATABASE_URL`, the migrations, the seed, and the
 * app all work unchanged against it.
 *
 * This exists because the demo has to survive a laptop that does not have
 * Docker installed — which is most laptops in a room where the product is
 * being shown to a provider, and is the exact moment an infrastructure
 * prerequisite is most expensive.
 *
 * Data persists in `.pglite/` so a reseed is not needed on every restart. That
 * directory is disposable: delete it to start clean.
 *
 * Run with: npm run db:demo
 */
import type { Server as NetServer, Socket } from "node:net";

import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";

const PORT = Number(process.env.DEMO_DB_PORT ?? 5432);
const DATA_DIR = process.env.DEMO_DB_DIR ?? "./.pglite";

/**
 * The socket server defaults to a single connection, which is one fewer than a
 * demo needs: `next dev` holds a pool open while a migrate or seed script
 * connects alongside it, and a browser refresh can overlap the previous
 * render. Concurrency is safe to allow because the server queues at the query
 * level — `QueryQueueManager` still runs one statement at a time against
 * PGlite, and keeps a transaction pinned to the connection that opened it.
 */
const MAX_CONNECTIONS = Number(process.env.DEMO_DB_MAX_CONNECTIONS ?? 10);

/** How often to reap connection slots the server has leaked. See `reapDetachedHandlers`. */
const REAP_INTERVAL_MS = 2_000;

type HandlerSet = Set<{ readonly isAttached: boolean }>;

/**
 * Free connection slots the server has lost track of.
 *
 * The server drops a handler from its connection count when the socket emits
 * `close`, but its own error path detaches the handler first, and detaching
 * removes that very listener. So a client that vanishes without a clean
 * `Terminate` — a seed script calling `process.exit`, a dev server reloading,
 * a laptop sleeping — leaves a handler holding a slot forever. Once every slot
 * is held, the server accepts each new connection and immediately destroys it,
 * which arrives at the client as a bare `ECONNRESET` with no protocol error to
 * explain it, and the only cure is restarting this process.
 *
 * `handlers` is private in the published types, so this reads it through a
 * cast and treats an unexpected shape as "nothing to reap" rather than
 * crashing the demo database: the reaper is a safeguard, and a safeguard that
 * can take down what it guards is worse than none.
 */
function reapDetachedHandlers(server: PGLiteSocketServer): number {
  const handlers = (server as unknown as { handlers?: HandlerSet }).handlers;
  if (!(handlers instanceof Set)) return 0;

  let reaped = 0;
  for (const handler of handlers) {
    if (handler?.isAttached === false) {
      handlers.delete(handler);
      reaped += 1;
    }
  }
  return reaped;
}

/** Socket failures that mean "the client went away", not "this server is broken". */
const CLIENT_GONE_CODES = new Set(["ECONNRESET", "EPIPE", "ECONNABORTED"]);

function isClientGone(error: unknown): boolean {
  const code = (error as NodeJS.ErrnoException | null)?.code;
  return typeof code === "string" && CLIENT_GONE_CODES.has(code);
}

/**
 * Attach an error listener to every incoming socket.
 *
 * A socket with no `error` listener turns any read failure into an unhandled
 * `error` event, which in Node is fatal to the process. Clients disconnect
 * abruptly all the time — a seed script calling `process.exit`, `next dev`
 * reloading, a laptop sleeping — so without this the demo database dies the
 * first time anything goes away without a clean `Terminate`. That is exactly
 * what it did: `ECONNRESET` on an unhandled `error` event, taking the whole
 * server down mid-session.
 *
 * `server` is private in the published types, so this reads it through a cast
 * and degrades to the process-level backstop below if the shape changes.
 */
function guardSockets(socketServer: PGLiteSocketServer): boolean {
  const netServer = (socketServer as unknown as { server?: NetServer }).server;
  if (!netServer || typeof netServer.on !== "function") return false;

  netServer.on("connection", (socket: Socket) => {
    socket.on("error", (error) => {
      if (isClientGone(error)) return;
      console.error("Socket error:", error);
    });
  });

  return true;
}

async function main() {
  const db = await PGlite.create({ dataDir: DATA_DIR });
  const server = new PGLiteSocketServer({
    db,
    port: PORT,
    host: "127.0.0.1",
    maxConnections: MAX_CONNECTIONS,
  });

  await server.start();

  if (!guardSockets(server)) {
    console.warn(
      "Could not attach socket error guards; relying on the uncaughtException backstop below.",
    );
  }

  /*
   * Backstop. `guardSockets` reaches into a private field, and a disconnect
   * can also surface from a socket this process never saw. A demo database is
   * the one place where staying up matters more than failing fast: a crash
   * here is a white screen in front of a client. Anything that is not a client
   * disconnect still crashes, loudly.
   */
  process.on("uncaughtException", (error) => {
    if (isClientGone(error)) {
      console.log(`Client disconnected abruptly (${(error as NodeJS.ErrnoException).code}).`);
      return;
    }
    console.error(error);
    process.exit(1);
  });

  const reaper = setInterval(() => {
    const reaped = reapDetachedHandlers(server);
    if (reaped > 0) {
      console.log(`Reclaimed ${reaped} connection slot(s) from disconnected clients.`);
    }
  }, REAP_INTERVAL_MS);
  reaper.unref();

  console.log(
    `PGlite listening on 127.0.0.1:${PORT}, data in ${DATA_DIR}, up to ${MAX_CONNECTIONS} connections`,
  );
  console.log("Next: npm run db:migrate && npm run db:seed, in another terminal.");

  const shutdown = async () => {
    clearInterval(reaper);
    await server.stop();
    await db.close();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
