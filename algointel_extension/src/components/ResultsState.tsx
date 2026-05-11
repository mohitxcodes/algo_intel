import type { AnalysisResponse } from "../types";

export default function ResultsState({
  analysis,
}: {
  analysis: AnalysisResponse;
}) {
  const timeIsOptimal =
    analysis?.timeComplexity === analysis?.suggestedTimeComplexity;
  const spaceIsOptimal =
    analysis?.spaceComplexity === analysis?.suggestedSpaceComplexity;

  // Show only the first sentence of approach
  const firstLine = analysis?.approach
    ? analysis.approach.split(/[.!?\n]/)[0] + "."
    : "—";

  return (
    <div className="space-y-5 pb-4">
      {/* ─── COMPLEXITY ─── */}
      <section>
        <SectionLabel label="Complexity" />

        <div className="mt-2.5 space-y-0 divide-y divide-border">
          {/* Time */}
          <div className="flex items-center justify-between py-3">
            <span className="text-[11px] text-text-muted font-medium">
              Current Time
            </span>
            <span className="font-mono text-[13px] font-bold text-text-primary">
              {analysis?.timeComplexity || "—"}
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-[11px] text-text-muted font-medium">
              Optimized Time
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-[13px] font-bold ${timeIsOptimal ? "text-emerald" : "text-amber"}`}
              >
                {analysis?.suggestedTimeComplexity || "—"}
              </span>
              {timeIsOptimal && (
                <span className="text-[8px] font-bold text-emerald bg-emerald/10 px-1.5 py-0.5 rounded-full uppercase">
                  ✓
                </span>
              )}
            </div>
          </div>

          {/* Space */}
          <div className="flex items-center justify-between py-3">
            <span className="text-[11px] text-text-muted font-medium">
              Current Space
            </span>
            <span className="font-mono text-[13px] font-bold text-text-primary">
              {analysis?.spaceComplexity || "—"}
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-[11px] text-text-muted font-medium">
              Optimized Space
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-[13px] font-bold ${spaceIsOptimal ? "text-emerald" : "text-amber"}`}
              >
                {analysis?.suggestedSpaceComplexity || "—"}
              </span>
              {spaceIsOptimal && (
                <span className="text-[8px] font-bold text-emerald bg-emerald/10 px-1.5 py-0.5 rounded-full uppercase">
                  ✓
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── APPROACH (first line only) ─── */}
      <section>
        <SectionLabel label="Approach" />
        <p className="mt-2 text-[12px] text-text-secondary leading-relaxed">
          {firstLine}
        </p>
      </section>

      {/* ─── IMPROVEMENTS ─── */}
      {analysis?.improvements && analysis.improvements.length > 0 && (
        <section>
          <SectionLabel label="Improvements" badge={String(analysis.improvements.length)} />
          <ul className="mt-2 space-y-1.5">
            {analysis.improvements.map((text, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-accent font-mono text-[10px] font-bold mt-[3px]">
                  {i + 1}.
                </span>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  {text}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ─── SUMMARY (at the end) ─── */}
      <section>
        <SectionLabel label="Summary" />
        <p className="mt-2 text-[12px] text-text-muted leading-relaxed italic">
          {analysis?.summary || "No summary available."}
        </p>
      </section>
    </div>
  );
}

function SectionLabel({ label, badge }: { label: string; badge?: string }) {
  return (
    <div className="flex items-center gap-2">
      <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.12em]">
        {label}
      </h3>
      {badge && (
        <span className="text-[8px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
}
