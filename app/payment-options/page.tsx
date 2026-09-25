import { TrustPage } from '@/components/trust-page';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: "Payment Options",
  description:
    "Pay by Zelle, bank transfer, Apple Pay, or Bitcoin after your order is reviewed. Payment is never collected in the browser.",
  path: '/payment-options',
});

export default function PaymentOptionsPage() { return <TrustPage eyebrow="Payment options" title="Choose a payment method after review." intro="Payment is never collected in the browser. We first confirm the requested items, delivery address, and final order total, then provide verified payment instructions." sections={[{ title: 'Zelle and bank transfer', body: 'Recipient details and bank instructions are only sent after an order is confirmed. Verify the recipient through the official order communication before sending payment.' }, { title: 'Apple Pay', body: 'Apple Pay is available only after merchant verification and payment-processor configuration are completed. It is not presented as an active payment button until that setup is live.' }, { title: 'Bitcoin', body: 'A verified wallet address, network, and exact payment amount are supplied after confirmation. Never send cryptocurrency to an address received through an unverified channel.' }]}/>; }
