/* oxlint-disable next/no-html-link-for-pages -- guide links keep native navigation for crawlers and non-JS readers. */
import { ArrowRight } from 'lucide-react';
import { posts } from '@/lib/blog/posts';
import { HUB_GUIDE_SLUG } from '@/lib/blog/guide-products';

// The planning hub first, marked "Start here"; the other guides build on it.
const ordered = [...posts.filter((post) => post.slug === HUB_GUIDE_SLUG), ...posts.filter((post) => post.slug !== HUB_GUIDE_SLUG)];
import { jsonLd, pageMetadata, siteUrl } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Backup Power Guides',
  description:
    'Practical guides to sizing battery backup, choosing between power stations and generators, solar charging, and battery chemistry for home outages.',
  path: '/blog',
});

const dateFormat = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'long',
  timeZone: 'UTC',
});

export default function BlogIndexPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${siteUrl}/blog#blog`,
    name: 'SolarHome Energy Backup Guides',
    url: `${siteUrl}/blog`,
    publisher: { '@id': `${siteUrl}/#organization` },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${siteUrl}/blog/${post.slug}`,
      datePublished: post.published,
      dateModified: post.updated,
    })),
  };

  return (
    <main className="page-shell blog-index">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
      />
      <header>
        <p className="eyebrow">Guides</p>
        <h1>Plan your backup power with real numbers.</h1>
        <p>
          How to size a system, compare options, and get the most from solar
          and batteries during an outage.
        </p>
      </header>
      <ul className="blog-list">
        {ordered.map((post) => (
          <li key={post.slug}>
            <article>
              <p className="blog-meta">
                {post.slug === HUB_GUIDE_SLUG && <span className="start-here">Start here</span>}
                <time dateTime={post.updated}>
                  {dateFormat.format(new Date(post.updated))}
                </time>
                {' · '}
                {post.categories[0]}
              </p>
              <h2>
                <a href={`/blog/${post.slug}`}>{post.title}</a>
              </h2>
              <p>{post.description}</p>
              <a
                className="blog-read"
                href={`/blog/${post.slug}`}
                aria-label={`Read: ${post.title}`}
              >
                Read the guide <ArrowRight size={15} />
              </a>
            </article>
          </li>
        ))}
      </ul>
    </main>
  );
}
