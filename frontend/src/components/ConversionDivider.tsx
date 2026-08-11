export default function ConversionDivider({ active }: { active: boolean }) {
  return (
    <div className="hidden md:block relative w-px bg-[var(--color-line)]">
      <div
        className={`absolute inset-0 w-px bg-gradient-to-b from-transparent via-[var(--color-amber)] to-transparent ${
          active ? 'animate-beam-pulse' : 'opacity-30'
        }`}
      />
    </div>
  );
}