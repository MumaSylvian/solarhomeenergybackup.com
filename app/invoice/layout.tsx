import { pageMetadata } from '@/lib/seo';

// The invoice page is a client component, so its metadata lives here.
export const metadata = pageMetadata({
  title: 'Request an Invoice',
  description: 'Send your cart and delivery details to request a reviewed invoice with payment instructions.',
  path: '/invoice',
  noindex: true,
});

export default function InvoiceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
