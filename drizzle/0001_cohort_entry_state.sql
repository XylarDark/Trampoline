ALTER TABLE "placements" ADD COLUMN "entered_employed_full_hours" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "placements" ADD COLUMN "same_employer_as_entry" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "tracks" ADD COLUMN "attendance_days" smallint DEFAULT 0 NOT NULL;