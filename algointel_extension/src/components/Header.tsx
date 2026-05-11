interface HeaderProps {
  isLoading: boolean;
}

export default function Header({ isLoading }: HeaderProps) {
  const handleClose = () => {
    window.parent.postMessage({ type: "CLOSE_SIDEBAR" }, "*");
  };

  return (
    <header className="flex-shrink-0 border-b border-border bg-bg-primary">
      <div className="flex items-center justify-between px-5 py-3.5">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12,2 2,7 12,12 22,7 12,2" />
              <polyline points="2,17 12,22 22,17" />
              <polyline points="2,12 12,17 22,12" />
            </svg>
          </div>
          <span className="text-[13px] font-semibold text-text-primary tracking-tight">
            AlgoIntel
          </span>
        </div>

        {/* Right: Status + Close */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-border">
            <span
              className={`w-[5px] h-[5px] rounded-full ${isLoading ? "bg-amber" : "bg-emerald"} animate-[pulse-dot_2s_ease-in-out_infinite]`}
            />
            <span
              className={`text-[10px] font-medium ${isLoading ? "text-amber" : "text-emerald"}`}
            >
              {isLoading ? "Analyzing..." : "Ready"}
            </span>
          </div>

          <button
            onClick={handleClose}
            className="w-6 h-6 rounded-md flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors cursor-pointer"
            title="Close"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
