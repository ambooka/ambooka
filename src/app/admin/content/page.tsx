import { CheckCircle2, XCircle } from "lucide-react";
const keep = [
  "Problem statements before screenshots",
  "Implementation notes and decision logs",
  "Engineering evidence: tests, CI, Docker, migrations, monitoring and docs",
  "Honest project status labels",
  "Case studies for featured projects",
];
const remove = [
  "Playful inspection overlays on the public shell",
  "Random GitHub repository dumps as the main portfolio",
  "Overclaiming planned work as completed",
  "Neon/glow-heavy theme elements that reduce readability",
  "Old experiments leading the recruiter journey",
];
export default function AdminContentPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-800 bg-slate-950 p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
          Content discipline
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white md:text-5xl">
          Proof over spectacle
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
          The public portfolio must present completed, verifiable work in
          software, payments, ERP, infrastructure, and computer vision. Résumé
          evidence stays factual and unsupported future capability stays out.
        </p>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <RuleCard title="Keep" items={keep} positive />
        <RuleCard title="Remove / avoid" items={remove} />
      </section>
    </div>
  );
}
function RuleCard({
  title,
  items,
  positive = false,
}: {
  title: string;
  items: string[];
  positive?: boolean;
}) {
  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-sm leading-6 text-slate-300"
          >
            {positive ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
            ) : (
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
            )}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
