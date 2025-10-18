export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001/api';

export type Car = {
  id: string; vin: string; make: string; model: string; year: number;
  priceCents: number; mileage: number; color?: string; condition?: string; description?: string;
};

export async function getCars() {
  const res = await fetch(`${API_BASE}/cars`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch cars');
  return res.json() as Promise<Car[]>;
}

export async function getCar(id: string) {
  const res = await fetch(`${API_BASE}/cars/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch car');
  return res.json() as Promise<Car>;
}

export function dollars(cents: number) {
  return (cents / 100).toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}
