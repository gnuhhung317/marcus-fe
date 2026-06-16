import { getBlogPageData } from '@/lib/contracts/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default async function BlogPage() {
  const { posts } = await getBlogPageData();
  const featuredPost = posts[0];

  return (
    <div className="flex flex-col gap-10">
      <header className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Intelligence Feed</p>
          <h1 className="mt-4 font-display text-5xl text-main md:text-6xl">Research Notes for Active Traders</h1>
          <p className="mt-4 text-lg text-muted">Deep-dive strategy notes, sentiment studies, and execution insights from the Marcus core team.</p>
        </div>
        <Card variant="glass-strong" className="p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Latest Alert</p>
          <h2 className="mt-4 text-xl font-semibold text-main">{featuredPost?.title ?? 'Market alert is being updated'}</h2>
          <p className="mt-2 text-sm text-muted">{featuredPost?.excerpt ?? 'Pulling latest intelligence from backend feed.'}</p>
          <div className="mt-6">
            <Button asChild variant="outline" size="sm">
              <a href="#posts">Read intelligence</a>
            </Button>
          </div>
        </Card>
      </header>

      <section id="posts" className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id} variant="glass" className="p-6">
            <Badge variant="outline" className="text-[10px]">
              {post.category}
            </Badge>
            <h3 className="mt-4 font-display text-2xl text-main">{post.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted">{post.excerpt}</p>
            <p className="mt-6 text-xs text-main">{post.readTime}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
