/**
 * Invoice numbers are assigned in the transaction that persists the invoice.
 * The database sequence/count must be the source of truth in production so two
 * concurrent requests cannot receive the same number.
 */
export function formatInvoiceNumber(sequence: number, date = new Date()): string {
  if (!Number.isInteger(sequence) || sequence < 1) throw new Error('Invoice sequence must be a positive integer');
  return `INV-${date.getUTCFullYear()}-${String(sequence).padStart(5, '0')}`;
}

export const invoicePaymentInstructions = 'A Stripe-hosted payment link is added after the invoice is approved. Never collect card numbers in this application.';
