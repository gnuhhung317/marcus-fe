import { getResearchPageData } from '../../../lib/contracts/client';

export default async function ResearchPage() {
  const { reports, library } = await getResearchPageData();
  const featuredReport = reports[0];

  return (
    <div className="space-y-10">
      <section className="glass relative overflow-hidden rounded-3xl p-8 noise">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Research Library</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl text-white md:text-6xl">
          {featuredReport?.title ?? 'Research stream is loading'}
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-muted">
          Latest institutional briefings from Marcus quant research desk and execution intelligence team.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="grid gap-5 md:grid-cols-2">
          {reports.map((report) => (
            <article key={report.id} className="glass rounded-2xl p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-muted">{report.category}</p>
              <h2 className="mt-4 font-display text-2xl text-white">{report.title}</h2>
              <p className="mt-4 text-sm text-muted">Published: {report.publishedAt}</p>
              <p className="mt-2 text-sm text-white">{report.readTime}</p>
            </article>
          ))}
        </div>
        <aside className="glass rounded-2xl p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">PDF Library</p>
          <ul className="mt-5 space-y-3">
            {library.map((file) => (
              <li key={file.fileId} className="rounded-xl border border-[rgba(132,162,191,0.2)] bg-[rgba(6,10,18,0.55)] px-4 py-3 text-sm text-white">
                <p>{file.title}</p>
                <p className="mt-1 text-xs text-muted">
                  {file.format} · {file.sizeMb.toFixed(1)} MB
                </p>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </div>
  );
}
