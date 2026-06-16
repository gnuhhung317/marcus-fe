import { getTrainingPageData } from '@/lib/contracts/client';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default async function TrainingPage() {
  const { courses, metrics } = await getTrainingPageData();

  return (
    <div className="flex flex-col gap-10">
      <header className="max-w-4xl">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Trading Academy</p>
        <h1 className="mt-4 font-display text-5xl text-main md:text-6xl">Build Repeatable Trading Workflows</h1>
        <p className="mt-4 text-lg text-muted">
          Educational modules for professional traders transitioning from discretionary setups to autonomous systems.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card variant="glass" className="p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Active Students</p>
          <p className="mt-2 text-3xl font-semibold text-main">{metrics.activeStudents}</p>
        </Card>
        <Card variant="glass" className="p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Bots Deployed</p>
          <p className="mt-2 text-3xl font-semibold text-main">{metrics.botsDeployed}</p>
        </Card>
        <Card variant="glass" className="p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Avg Performance</p>
          <p className="mt-2 text-3xl font-semibold text-positive">+{metrics.averagePerformancePercent.toFixed(1)}%</p>
        </Card>
        <Card variant="glass" className="p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Academy Rating</p>
          <p className="mt-2 text-3xl font-semibold text-main">{metrics.academyRating.toFixed(1)} / 5</p>
        </Card>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-[10px]">
                {course.level}
              </Badge>
              <p className="text-xs text-muted">{course.progress}%</p>
            </div>
            <h2 className="mt-4 font-display text-2xl text-main">{course.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{course.summary}</p>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-border/60">
              <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${course.progress}%` }} />
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
