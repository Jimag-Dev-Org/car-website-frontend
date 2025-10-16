// car-website-frontend/app/page.tsx
export default async function Home() {
  const api = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001/api';
  const res = await fetch(`${api}/cars`, { cache: 'no-store' });
  const cars = res.ok ? await res.json() : [];
  const title = process.env.NEXT_PUBLIC_SITE_NAME || 'Jimag Autos Marketplace';

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>{title}</h1>
      <p style={{ marginTop: 8, color: '#555' }}>
        Browse inventory, add to cart, and contact us to purchase.
      </p>

      <h2 style={{ marginTop: 24 }}>Latest cars</h2>
      <div style={{
        marginTop: 12, display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12
      }}>
        {cars.map((c: any) => (
          <div key={c.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
            <div style={{ fontWeight: 700 }}>{c.make} {c.model}</div>
            <div>{c.year} · {c.mileage} miles</div>
            <div style={{ marginTop: 6, fontWeight: 700 }}>${c.price}</div>
          </div>
        ))}
        {!cars.length && <div>No cars yet.</div>}
      </div>
    </main>
  );
}
