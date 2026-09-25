/* oxlint-disable next/no-html-link-for-pages -- article links keep native navigation for crawlers and non-JS readers. */
import type { ReactNode } from 'react';
import type { BlogBlock } from '@/lib/blog/posts';

/** Renders [label](href) inline links; external links open safely in a new tab. */
export function RichText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const [whole, label, href] = match;
    const start = match.index ?? 0;
    if (start > last) parts.push(text.slice(last, start));
    parts.push(
      href.startsWith('http') ? (
        <a key={start} href={href} target="_blank" rel="noopener">
          {label}
        </a>
      ) : (
        <a key={start} href={href}>
          {label}
        </a>
      ),
    );
    last = start + whole.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

export function BlogBlocks({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2 key={index} id={block.id}>
                {block.text}
              </h2>
            );
          case 'h3':
            return <h3 key={index}>{block.text}</h3>;
          case 'p':
            return (
              <p key={index}>
                <RichText text={block.text} />
              </p>
            );
          case 'ul':
          case 'ol': {
            const List = block.type;
            return (
              <List key={index}>
                {block.items.map((item) => (
                  <li key={item}>
                    <RichText text={item} />
                  </li>
                ))}
              </List>
            );
          }
          case 'table':
            return (
              <div key={index} className="blog-table">
                <table>
                  <caption>{block.caption}</caption>
                  <thead>
                    <tr>
                      {block.head.map((cell, cellIndex) => (
                        <th key={cellIndex} scope="col">
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) =>
                          cellIndex === 0 ? (
                            <th key={cellIndex} scope="row">
                              {cell}
                            </th>
                          ) : (
                            <td key={cellIndex}>{cell}</td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'note':
            return (
              <aside key={index} className="blog-note">
                <RichText text={block.text} />
              </aside>
            );
        }
      })}
    </>
  );
}
