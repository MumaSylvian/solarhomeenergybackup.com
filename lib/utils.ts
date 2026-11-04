type ClassValue = string | number | boolean | null | undefined | ClassValue[] | Record<string, boolean>;

const flatten = (value: ClassValue): string[] => {
  if (!value) return [];
  if (typeof value === 'string' || typeof value === 'number') return [String(value)];
  if (Array.isArray(value)) return value.flatMap(flatten);
  return Object.entries(value).filter(([, enabled]) => enabled).map(([name]) => name);
};

export function cn(...inputs: ClassValue[]) {
  return flatten(inputs).join(' ');
}
