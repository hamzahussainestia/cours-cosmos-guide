import { WaveMark } from "@/components/WaveMark";

export function SectionHeading({
  eyebrow,
  title,
  id,
}: {
  eyebrow: string;
  title: string;
  id?: string;
}) {
  return (
    <div className="text-center">
      <p className="text-xs tracking-[0.35em] text-gold uppercase">{eyebrow}</p>
      <h2 id={id} className="mt-3 font-display text-4xl sm:text-5xl">
        {title}
      </h2>
      <div className="mt-6 flex items-center justify-center" aria-hidden>
        <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold/50 sm:w-20" />
        <WaveMark className="h-7 w-auto shrink-0 sm:h-8" draw />
        <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold/50 sm:w-20" />
      </div>
    </div>
  );
}
