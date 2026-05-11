export default function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 py-3">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border/80 to-border/80" />
      <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.15em] whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-border/80 to-border/80" />
    </div>
  );
}
