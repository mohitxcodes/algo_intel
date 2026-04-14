import { useEffect, useState } from "react";

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex-1 h-px bg-border" />
      <span className="text-[10px] font-semibold text-text-muted uppercase tracking-[0.12em] whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

interface AnalysisResponse {
  approach: string;
  timeComplexity: string;
  spaceComplexity: string;
}

// ── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);

  const handleApiCall = async () => {
    const response = await fetch("http://localhost:8080/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: "",
      }),
    });
    const data = await response.json();
    console.log(data);
    setAnalysis(data);
  };

  useEffect(() => {
    handleApiCall();
  }, []);

  const [showAll, setShowAll] = useState(false);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary antialiased">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-bg-primary/80 border-b border-border">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12,2 2,7 12,12 22,7 12,2" />
                <polyline points="2,17 12,22 22,17" />
                <polyline points="2,12 12,17 22,12" />
              </svg>
            </div>
            <span className="text-[13px] font-bold tracking-tight bg-gradient-to-r from-text-primary to-accent bg-clip-text text-transparent">
              AlgoIntel
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald/10 border border-emerald/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-[pulse-dot_2s_ease-in-out_infinite]" />
            <span className="text-[9px] font-semibold text-emerald">
              Active
            </span>
          </div>
        </div>
      </header>

      <div className="px-5 py-5 space-y-5">
        {/* ─────────── COMPLEXITY ─────────── */}
        <Divider label="Complexity" />

        <div className="grid grid-cols-2 gap-3">
          {/* Time */}
          <div className="p-4 rounded-xl bg-bg-card border border-border space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red/10 flex items-center justify-center text-red">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                Time
              </span>
            </div>
            <p className="font-mono text-xl font-bold text-text-primary">
              {analysis?.timeComplexity}
            </p>
            <p className="text-[10px] text-text-muted leading-snug">
              Quadratic — nested iteration
            </p>
          </div>

          {/* Space */}
          <div className="p-4 rounded-xl bg-bg-card border border-border space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <rect x="9" y="9" width="6" height="6" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                Space
              </span>
            </div>
            <p className="font-mono text-xl font-bold text-text-primary">
              {analysis?.spaceComplexity}
            </p>
            <p className="text-[10px] text-text-muted leading-snug">
              Constant — no extra memory
            </p>
          </div>
        </div>

        {/* ─────────── ANALYSIS ─────────── */}
        <Divider label="Analysis" />

        <div className="space-y-3">
          {/* Approach Card */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-bg-card border border-border">
            <div className="w-9 h-9 rounded-xl bg-amber/10 border border-amber/15 flex items-center justify-center text-base flex-shrink-0">
              🔍
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <h4 className="text-[13px] font-semibold text-text-primary">
                  {analysis?.approach}
                </h4>
                <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-red/10 text-red border border-red/20">
                  {analysis?.timeComplexity}
                </span>
              </div>
              <p className="text-[12px] text-text-secondary leading-[1.7]">
                {/* {d.summary} */}
                "NA"
              </p>
            </div>
          </div>

          {/* Best Possible */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald/[0.05] border border-emerald/12">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#34d399"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22,4 12,14.01 9,11.01" />
            </svg>
            <p className="text-[12px] text-emerald/90 leading-snug">
              Can be solved in{" "}
              {/* <span className="font-mono font-bold">{d.bestTime}</span> using{" "} */}
              {/* <span className="font-semibold">{d.bestApproach}</span> */}
              "NA"
            </p>
          </div>
        </div>

        {/* ─────────── IMPROVEMENTS ─────────── */}
        {/* <Divider label={`Improvements · ${d.improvements.length}`} /> */}

        <div>
          <ul className="space-y-2">
            {/* {visible.map((text, i) => (
              <li
                key={i}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-bg-card border border-border hover:border-border-active transition-colors"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mt-0.5">
                  <span className="font-mono text-[9px] font-bold text-accent">
                    {i + 1}
                  </span>
                </span>
                <p className="text-[12.5px] text-text-secondary leading-[1.65]">
                  {text}
                </p>
              </li>
            ))} */}
          </ul>

          {/* {d.improvements.length > 4 && ( */}
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full mt-3 py-2.5 text-[11px] font-semibold text-accent hover:text-accent-dim rounded-xl border border-border hover:border-accent/25 hover:bg-accent/5 transition-all cursor-pointer"
          >
            {/* {showAll ? "Show less" : `View ${d.improvements.length - 4} more`} */}
          </button>
          {/* )} */}
        </div>

        {/* ── Footer ── */}
        <div className="pt-3 pb-1">
          <div className="h-px bg-border mb-4" />
          <p className="text-[9px] text-text-muted/50 font-mono text-center">
            AlgoIntel v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
