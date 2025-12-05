export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001/api';
export const PUBLIC_IMAGE_BASE = process.env.NEXT_PUBLIC_S3_PUBLIC_BASE;

export type Car = {
  id: string; vin: string; make: string; model: string; year: number;
  priceCents: number; mileage: number; color?: string; condition?: string; description?: string;
};

export type CarsResponse = { items: Car[]; page: number; pageSize: number; total: number; };

export type CarImage = { id: string; s3KeyOriginal: string; altText?: string; order: number };

function qs(params: Record<string, any>) {
  const s = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') s.append(k, String(v));
  });
  return s.toString();
}

export function imgUrl(key: string) {
  if (!PUBLIC_IMAGE_BASE) return '';
  return `${PUBLIC_IMAGE_BASE}/${key}`;
}

export async function getCars(params: Partial<Record<string, string | number>> = {}) {
  const query = qs(params);
  const res = await fetch(`${API_BASE}/cars${query ? `?${query}` : ''}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch cars');
  return res.json() as Promise<CarsResponse>;
}

export async function getCar(id: string) {
  const res = await fetch(`${API_BASE}/cars/${id}`, { cache: 'no-store' });

  if (res.status === 404) {
    return null; // signal "car not found"
  }

  if (!res.ok) {
    throw new Error('Failed to fetch car');
  }

  return res.json() as Promise<Car>;
}

export async function getCarImages(id: string) {
  const res = await fetch(`${API_BASE}/cars/${id}/images`, { cache: 'no-store' });

  if (res.status === 404) {
    return []; // no images if car not found
  }

  if (!res.ok) {
    throw new Error('Failed to fetch car images');
  }

  return res.json() as Promise<CarImage[]>;
}


export async function presignUpload(carId: string, file: File) {
  const ext = '.' + (file.name.split('.').pop() || 'bin');
  const body = JSON.stringify({ carId, contentType: file.type || 'application/octet-stream', ext });
  const res = await fetch(`${API_BASE}/uploads/presign`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
  if (!res.ok) throw new Error('Failed to presign');
  return res.json() as Promise<{ key: string; url: string; headers: Record<string,string>; publicUrl: string }>;
}

export async function registerImage(carId: string, key: string, altText?: string) {
  const res = await fetch(`${API_BASE}/cars/${carId}/images`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, altText }),
  });
  if (!res.ok) throw new Error('Failed to register image');
  return res.json() as Promise<CarImage>;
}

export function dollars(cents: number) {
  return (cents / 100).toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}
