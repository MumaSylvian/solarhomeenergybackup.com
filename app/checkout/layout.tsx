import { pageMetadata } from '@/lib/seo';

// The checkout page is a client component, so its metadata lives here.
export const metadata = pageMetadata({
  title: 'Checkout',
  description: 'Review the equipment in your cart before requesting an invoice.',
  path: '/checkout',
  noindex: true,
});

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
