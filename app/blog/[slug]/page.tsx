/* oxlint-disable next/no-html-link-for-pages -- guide links keep native navigation for crawlers and non-JS readers. */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { BlogBlocks, RichText } from '@/components/blog-content';
import { postBySlug, posts } from '@/lib/blog/posts';
import { defaultOgImage, jsonLd, pageMetadata, siteName, siteUrl } from '@/lib/seo';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = postBySlug((await params).slug);
  if (!post) return {};
  const base = pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: 'article',
      publishedTime: post.published,
      modifiedTime: post.updated,
    },
  };
}

const dateFormat = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'long',
  timeZone: 'UTC',
});

export default async function BlogPostPage({ params }: Params) {
  const post = postBySlug((await params).slug);
  if (!post) notFound();

  const url = `${siteUrl}/blog/${post.slug}`;
  const headings = post.blocks.filter((block) => block.type === 'h2');
  const related = posts.filter((other) => other.slug !== post.slug).slice(0, 3);
  const plain = (text: string) => text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: post.title,
      description: post.description,
      url,
      mainEntityOfPage: url,
      datePublished: post.published,
      dateModified: post.updated,
      image: `${siteUrl}${defaultOgImage.url}`,
      author: { '@type': 'Organization', name: siteName, url: siteUrl },
      publisher: { '@id': `${siteUrl}/#organization` },
      isPartOf: { '@id': `${siteUrl}/blog#blog` },
      citation: post.sources.map((source) => source.url),
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.answer-block'],
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: plain(faq.answer) },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { name: 'Home', item: siteUrl },
        { name: 'Guides', item: `${siteUrl}/blog` },
        { name: post.title, item: url },
      ].map((entry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        ...entry,
      })),
    },
  ];

  return (
    <main className="page-shell blog-post">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
      />
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <ol>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/blog">Guides</a>
          </li>
          <li aria-current="page">{post.title}</li>
        </ol>
      </nav>
      <article>
        <header className="blog-header">
          <h1>{post.title}</h1>
          <p className="blog-meta">
            By {siteName} · Updated{' '}
            <time dateTime={post.updated}>
              {dateFormat.format(new Date(post.updated))}
            </time>
          </p>
        </header>
        <p className="answer-block">{post.answer}</p>
        <nav aria-label="On this page" className="blog-toc">
          <h2>On this page</h2>
          <ol>
            {headings.map((heading) => (
              <li key={heading.id}>
                <a href={`#${heading.id}`}>{heading.text}</a>
              </li>
            ))}
            <li>
              <a href="#faq">Frequently asked questions</a>
            </li>
          </ol>
        </nav>
        <div className="blog-body">
          <BlogBlocks blocks={post.blocks} />
          <h2 id="faq">Frequently asked questions</h2>
          {post.faqs.map((faq) => (
            <section key={faq.question} className="blog-faq">
              <h3>{faq.question}</h3>
              <p>
                <RichText text={faq.answer} />
              </p>
            </section>
          ))}
          {post.sources.length > 0 && (
            <section className="blog-sources" aria-labelledby="sources">
              <h2 id="sources">Sources</h2>
              <ul>
                {post.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noopener">
                      {source.name}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>
      <aside className="blog-aside">
        <section aria-labelledby="shop-links">
          <h2 id="shop-links">Shop for this project</h2>
          <ul>
            {post.shopLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>
                  {link.label} <ArrowRight size={15} />
                </a>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="more-guides">
          <h2 id="more-guides">More guides</h2>
          <ul>
            {related.map((other) => (
              <li key={other.slug}>
                <a href={`/blog/${other.slug}`}>{other.title}</a>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </main>
  );
}
