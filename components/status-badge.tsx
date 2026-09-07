/**
 * Milestone status as a badge.
 *
 * Every badge carries a glyph and a word, never a colour alone. WCAG 2.0 AA
 * requires colour not be the only means of conveying information (SC 1.4.1),
 * and the README records a clean axe-core pass we intend to keep. It also
 * matters offline: the evidence pack prints, and a red badge on a monochrome
 * office printer is just a grey badge.
 */
import { Badge } from "@/components/ui/badge";
import type { MilestoneStatus } from "@/src/engine/outcomes";
import { describeStatus } from "@/src/engine/outcomes";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

/**
 * Glyph, variant, and screen-reader prefix per status.
 *
 * The glyph is `aria-hidden` and the label is real text, so a screen reader
 * hears the word without hearing "check mark" first.
 */
const PRESENTATION: Record<MilestoneStatus["tag"], { glyph: string; variant: BadgeVariant }> = {
  claimable: { glyph: "✓", variant: "default" },
  not_due_yet: { glyph: "·", variant: "outline" },
  no_employment: { glyph: "—", variant: "outline" },
  below_threshold: { glyph: "▽", variant: "secondary" },
  below_minimum_wage: { glyph: "!", variant: "secondary" },
  evidence_missing: { glyph: "?", variant: "destructive" },
  evidence_unacceptable: { glyph: "✕", variant: "destructive" },
  needs_preapproval: { glyph: "?", variant: "destructive" },
  subsidized_not_payable: { glyph: "$", variant: "secondary" },
  stacking_uncounted: { glyph: "⧉", variant: "secondary" },
  needs_new_employer: { glyph: "→", variant: "secondary" },
};

export function StatusBadge({
  status,
  showDetail = false,
}: {
  status: MilestoneStatus;
  showDetail?: boolean;
}) {
  const { label, detail } = describeStatus(status);
  const { glyph, variant } = PRESENTATION[status.tag];

  return (
    <span className="inline-flex flex-col gap-0.5">
      <Badge variant={variant} className="gap-1.5">
        <span aria-hidden="true">{glyph}</span>
        {label}
      </Badge>
      {showDetail ? <span className="text-muted-foreground text-xs">{detail}</span> : null}
    </span>
  );
}

/**
 * The same detail text the badge can show, for table cells that need the
 * explanation in a title attribute or a separate column.
 */
export function statusDetail(status: MilestoneStatus): string {
  return describeStatus(status).detail;
}
