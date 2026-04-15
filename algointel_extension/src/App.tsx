import { useState, useEffect } from "react";

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
  summary: string;
  improvements: string[];
}

// ── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Trigger analysis dynamically from window messages
  const handleApiCall = async (codeToAnalyze: string) => {
    setIsLoading(true);
    setAnalysis(null); // Clear previous results while loading

    try {
      const response = await fetch("http://localhost:8080/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: codeToAnalyze,
        }),
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Error fetching analysis:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // content.js posts { type: "ANALYZE_CODE", code: "..." }
      if (event.data?.type === "ANALYZE_CODE" && typeof event.data.code === "string") {
        handleApiCall(event.data.code);
      }
    };

    window.addEventListener("message", handleMessage);

    // Tell parent (content.js) we are ready to receive messages
    window.parent.postMessage({ type: "ALGOINTEL_APP_READY" }, "*");

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const improvementsList = analysis?.improvements || [];
  const visibleImprovements = showAll
    ? improvementsList
    : improvementsList.slice(0, 4);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary antialiased flex flex-col">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-bg-primary/80 border-b border-border flex-shrink-0">
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
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald/10 border border-emerald/20 transition-all">
            <span
              className={`w-1.5 h-1.5 rounded-full ${isLoading ? "bg-amber" : "bg-emerald"} animate-[pulse-dot_2s_ease-in-out_infinite]`}
            />
            <span
              className={`text-[9px] font-semibold ${isLoading ? "text-amber" : "text-emerald"} transition-colors`}
            >
              {isLoading ? "Analyzing" : "Active"}
            </span>
          </div>
        </div>
      </header>

      {/* ── Dynamic Content Area ── */}
      <div className="flex-1 flex flex-col px-5 py-5 overflow-auto relative">
        {/* STATE 1: Empty State — waiting for user to select code */}
        {!analysis && !isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 mb-6 rounded-full bg-border/40 flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-text-muted"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Waiting for Code
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed max-w-[220px]">
              Select code on the page, right-click, and choose
              <span className="font-semibold text-accent"> "Analyze Code with AlgoIntel"</span> to begin.
            </p>
          </div>
        )}

        {/* STATE 2: Loading State */}
        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
            {/* Radar/Pulse Animation */}
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 rounded-full border border-amber/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
              <div className="absolute inset-2 rounded-full border border-amber/40 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite_0.5s]"></div>
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-12 h-12 bg-bg-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.3)] border border-amber/50">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-amber animate-[spin_4s_linear_infinite]"
                  >
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                  </svg>
                </div>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-amber tracking-wide uppercase mb-2">
              Analyzing Heuristics
            </h3>
            <p className="text-xs text-text-muted">
              Parsing syntax and calculating complexity.
            </p>
          </div>
        )}

        {/* STATE 3: Results State */}
        {analysis && !isLoading && (
          <div className="space-y-5 animate-in slide-in-from-bottom-4 fade-in duration-500 fill-mode-both">
            {/* ─────────── COMPLEXITY ─────────── */}
            <Divider label="Complexity" />

            <div className="grid grid-cols-2 gap-3">
              {/* Time */}
              <div className="p-4 rounded-xl bg-bg-card border border-border space-y-2.5 hover:border-border-active hover:shadow-md transition-all">
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
                  {analysis?.timeComplexity || "-"}
                </p>
                <p className="text-[10px] text-text-muted leading-snug">
                  Time execution profile
                </p>
              </div>

              {/* Space */}
              <div className="p-4 rounded-xl bg-bg-card border border-border space-y-2.5 hover:border-border-active hover:shadow-md transition-all">
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
                  {analysis?.spaceComplexity || "-"}
                </p>
                <p className="text-[10px] text-text-muted leading-snug">
                  Memory footprint profile
                </p>
              </div>
            </div>

            {/* ─────────── ANALYSIS ─────────── */}
            <Divider label="Analysis" />

            <div className="space-y-3">
              {/* Summary Card */}
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-bg-card border border-border transition-colors hover:border-border-active hover:shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-amber/10 border border-amber/15 flex items-center justify-center text-base flex-shrink-0">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-amber"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="text-[13px] font-semibold text-text-primary">
                      Architecture Summary
                    </h4>
                  </div>
                  <p className="text-[12px] text-text-secondary leading-[1.7]">
                    {analysis?.summary || "Analyzing components..."}
                  </p>
                </div>
              </div>

              {/* Approach */}
              <div className="flex flex-col gap-2.5 p-4 rounded-xl bg-emerald/[0.05] border border-emerald/12">
                <div className="flex items-center gap-2">
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
                  <h4 className="text-[11px] font-bold text-emerald/90 uppercase tracking-wider">
                    Methodology Highlights
                  </h4>
                </div>
                <p className="text-[12px] text-emerald/80 leading-[1.65] italic">
                  {analysis?.approach
                    ? `"${analysis.approach}"`
                    : "Executing heuristic breakdown..."}
                </p>
              </div>
            </div>

            {/* ─────────── IMPROVEMENTS ─────────── */}
            <Divider label={`Improvements · ${improvementsList.length || 0}`} />

            <div className="pb-2">
              <ul className="space-y-2">
                {visibleImprovements.map((text, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-bg-card border border-border hover:border-border-active transition-colors shadow-sm"
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
                ))}
                {!isLoading && improvementsList.length === 0 && (
                  <div className="text-[12px] text-text-muted text-center py-5 italic">
                    No clear improvements required.
                  </div>
                )}
              </ul>

              {improvementsList.length > 4 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="w-full mt-3 py-2.5 text-[11px] font-semibold text-accent hover:text-accent-dim rounded-xl border border-border hover:border-accent/25 hover:bg-accent/5 transition-all cursor-pointer shadow-sm"
                >
                  {showAll
                    ? "Show less"
                    : `View ${improvementsList.length - 4} more`}
                </button>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="pt-3 pb-1">
              <div className="h-px bg-border mb-4" />
              <p className="text-[9px] text-text-muted/50 font-mono text-center">
                AlgoIntel v1.0
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
