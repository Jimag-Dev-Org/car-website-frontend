// app/cars/[id]/not-found.tsx

export default function CarNotFound() {
  return (
    <main style={{ padding: 24, maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>Car not found</h1>
      <p style={{ marginBottom: 20 }}>
        We couldn&apos;t find the car you were looking for. It may have been removed or the URL is incorrect.
      </p>
      <a href="/" style={{ textDecoration: 'none', fontWeight: 600 }}>
        ← Back to all cars
      </a>
    </main>
  );
}
