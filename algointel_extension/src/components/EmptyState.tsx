export default function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
      <div className="w-14 h-14 mb-5 rounded-2xl bg-bg-elevated border border-border flex items-center justify-center">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-text-muted"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-text-primary mb-1.5">
        No code selected
      </h3>
      <p className="text-[11px] text-text-muted leading-relaxed max-w-[200px]">
        Select code on any page, right-click and choose{" "}
        <span className="text-accent font-medium">"Analyze Code"</span>
      </p>
    </div>
  );
}
