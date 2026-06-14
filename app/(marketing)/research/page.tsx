import { getResearchPageData } from '@/lib/contracts/client';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default async function ResearchPage() {
  const { reports, library } = await getResearchPageData();
  const featuredReport = reports[0];

  return (
    <div className="flex flex-col gap-10">
      <Card variant="glass" className="relative overflow-hidden p-8 noise">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Research Library</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl text-main md:text-6xl">
          {featuredReport?.title ?? 'Research stream is loading'}
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-muted">
          Latest institutional briefings from Marcus quant research desk and execution intelligence team.
        </p>
      </Card>

      <section className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="grid gap-5 md:grid-cols-2">
          {reports.map((report) => (
            <Card key={report.id} variant="glass" className="p-6">
              <Badge variant="outline" className="text-[10px]">
                {report.category}
              </Badge>
              <h2 className="mt-4 font-display text-2xl text-main">{report.title}</h2>
              <p className="mt-4 text-sm text-muted">Published: {report.publishedAt}</p>
              <p className="mt-2 text-sm text-main">{report.readTime}</p>
            </Card>
          ))}
        </div>
        <Card variant="glass" className="p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">PDF Library</p>
          <ul className="mt-5 flex flex-col gap-3">
            {library.map((file) => (
              <li key={file.fileId} className="rounded-xl border border-border/60 bg-surface/80 px-4 py-3 text-sm text-main">
                <p>{file.title}</p>
                <p className="mt-1 text-xs text-muted">
                  {file.format} - {file.sizeMb.toFixed(1)} MB
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}
