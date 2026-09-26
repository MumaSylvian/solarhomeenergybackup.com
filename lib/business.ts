/**
 * The business identity, as published in the Privacy Policy (effective
 * September 26, 2026). Every page, the footer, and structured data read these
 * values so the name, address, and contact details are identical everywhere.
 */
export const business = {
  legalName: 'SolarHome Energy Backup LLC',
  tradingName: 'Solar Home Energy Backup',
  streetAddress: '218 Springfield Road',
  locality: 'Baton Rouge',
  region: 'LA',
  postalCode: '70807',
  country: 'US',
  countryName: 'United States',
  email: 'info@solarhomeenergybackup.com',
  phoneDisplay: '+1 (938) 263-4728',
  phoneE164: '+1-938-263-4728',
} as const;

export const addressLines = [
  business.streetAddress,
  `${business.locality}, ${business.region} ${business.postalCode}`,
  business.countryName,
];
