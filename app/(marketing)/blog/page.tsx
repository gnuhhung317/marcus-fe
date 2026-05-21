import { getBlogPageData } from '@/lib/contracts/client';

export default async function BlogPage() {
  const { posts } = await getBlogPageData();
  const featuredPost = posts[0];

  return (
    <div className="space-y-10">
      <header className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Intelligence Feed</p>
          <h1 className="mt-4 font-display text-5xl text-white md:text-6xl">Research Notes for Active Traders</h1>
          <p className="mt-4 text-lg text-muted">Deep-dive strategy notes, sentiment studies, and execution insights from the Marcus core team.</p>
        </div>
        <div className="glass rounded-2xl p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Latest Alert</p>
          <h2 className="mt-4 text-xl font-semibold text-white">{featuredPost?.title ?? 'Market alert is being updated'}</h2>
          <p className="mt-2 text-sm text-muted">{featuredPost?.excerpt ?? 'Pulling latest intelligence from backend feed.'}</p>
          <button className="mt-6 rounded-lg border border-[rgba(148,163,184,0.45)] px-4 py-2 text-sm text-white transition-colors hover:bg-[rgba(148,163,184,0.12)]">
            Read intelligence
          </button>
        </div>
      </header>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id} className="glass rounded-2xl p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">{post.category}</p>
            <h3 className="mt-4 font-display text-2xl text-white">{post.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted">{post.excerpt}</p>
            <p className="mt-6 text-xs text-white">{post.readTime}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
