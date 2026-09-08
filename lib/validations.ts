import { z } from 'zod';

export const checkoutSchema = z.object({
  firstName: z.string().trim().min(1), lastName: z.string().trim().min(1), email: z.string().email(), phone: z.string().trim().min(7), address: z.string().trim().min(3), city: z.string().trim().min(2), postalCode: z.string().trim().min(3),
});

export const invoiceRequestSchema = checkoutSchema.extend({ company: z.string().trim().optional(), taxId: z.string().trim().optional(), purchaseOrder: z.string().trim().optional(), notes: z.string().trim().max(2000).optional() });
export const quoteRequestSchema = z.object({ name: z.string().trim().min(1), email: z.string().email(), appliances: z.string().trim().min(3), backupDuration: z.string().trim().min(1), needsInstallation: z.boolean() });
