import { approvedCatalog as catalog } from '@/lib/catalog/products';

export default function AdminPage() {
  const pending = catalog.filter(
    (product) => product.status === 'PENDING_REVIEW',
  );
  const previewProducts = catalog.slice(0, 50);
  const categoryCounts = [
    ...new Set(catalog.map((product) => product.category)),
  ]
    .sort()
    .map((category) => ({
      category,
      count: catalog.filter((product) => product.category === category).length,
    }));
  return (
    <main className="page-shell">
      <header>
        <p className="eyebrow">Protected admin workspace</p>
        <h1>Catalog control, before publish.</h1>
        <p>
          This visual admin surface shows the review workflow. Production access
          should be protected by the configured identity provider and
          server-side role checks.
        </p>
      </header>
      <div className="admin-grid">
        <div className="admin-stat">
          <p>Approved products</p>
          <strong>
            {catalog.filter((product) => product.status === 'APPROVED').length}
          </strong>
        </div>
        <div className="admin-stat">
          <p>Pending review</p>
          <strong>{pending.length}</strong>
        </div>
        <div className="admin-stat">
          <p>Detailed records</p>
          <strong>
            {
              catalog.filter(
                (product) => Object.keys(product.specifications).length > 1,
              ).length
            }
          </strong>
        </div>
        <div className="admin-stat">
          <p>Categories</p>
          <strong>{categoryCounts.length}</strong>
        </div>
      </div>
      <section className="admin-list admin-categories">
        <div>
          <b>Category</b>
          <b>Products</b>
          <b>Coverage</b>
          <b>Action</b>
        </div>
        {categoryCounts.map(({ category, count }) => (
          <div key={category}>
            <span>
              <b>{category}</b>
            </span>
            <span>{count}</span>
            <span>
              {Math.round((count / catalog.length) * 100)}% of catalog
            </span>
            <a href={`/shop?category=${encodeURIComponent(category)}`}>
              View category
            </a>
          </div>
        ))}
      </section>
      <section className="admin-list">
        <div>
          <b>Product</b>
          <b>Model</b>
          <b>Status</b>
          <b>Action</b>
        </div>
        {previewProducts.map((product) => (
          <div key={product.id}>
            <span>
              <b>{product.name}</b>
              <br />
              <small>{product.category}</small>
            </span>
            <span>{product.model}</span>
            <span className="status">{product.status.replace('_', ' ')}</span>
            <span>Preview changes</span>
          </div>
        ))}
      </section>
    </main>
  );
}
