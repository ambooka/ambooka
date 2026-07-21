const focusAreas = [
  {
    title: "Software Engineering",
    description:
      "Full-stack applications, APIs, testing, documentation and production-minded delivery.",
    stack: [
      "Python",
      "TypeScript",
      "React",
      "Next.js",
      "FastAPI",
      "PostgreSQL",
    ],
  },
  {
    title: "Backend & Payment Integrations",
    description:
      "REST APIs, typed integrations, webhooks, retry handling, queues, and transactional data.",
    stack: ["Node.js", "TypeScript", "FastAPI", "PostgreSQL", "Redis", "BullMQ"],
  },
  {
    title: "Business Systems & IT Infrastructure",
    description:
      "ERP implementation, Windows Server, Active Directory, networking, VoIP, CCTV, and user support.",
    stack: ["ERPNext", "Windows Server", "Active Directory", "TCP/IP", "VoIP", "Linux"],
  },
];

export default function CareerFocusPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-800 bg-slate-950 p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
          Career focus
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white md:text-5xl">
          Professional positioning
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
          This private admin page keeps the public portfolio aligned around real
          evidence across software delivery, payment integrations, business
          systems, infrastructure, and applied computer vision.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {focusAreas.map((area) => (
          <article
            key={area.title}
            className="rounded-3xl border border-slate-800 bg-slate-950 p-6"
          >
            <h2 className="text-xl font-bold text-white">{area.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {area.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {area.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
