export default function LoadingState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      {/* Spinner */}
      <div className="relative w-12 h-12 mb-5">
        <div className="absolute inset-0 rounded-full border-2 border-border" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin" />
      </div>
      <h3 className="text-sm font-semibold text-text-primary mb-1">
        Analyzing code...
      </h3>
      <p className="text-[11px] text-text-muted">
        Parsing syntax and computing complexity
      </p>
    </div>
  );
}
