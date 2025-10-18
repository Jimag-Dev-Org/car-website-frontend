import { getCar, dollars } from '../../../lib/api';

export default async function CarDetail({ params }: { params: { id: string } }) {
  const car = await getCar(params.id);

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <a href="/" style={{ textDecoration: 'none' }}>← Back</a>
      <h1 style={{ marginTop: 12 }}>{car.year} {car.make} {car.model}</h1>
      <div style={{ marginTop: 8, fontSize: 18, fontWeight: 700 }}>{dollars(car.priceCents)}</div>
      <ul style={{ marginTop: 12, color: '#444' }}>
        <li>VIN: {car.vin}</li>
        <li>Mileage: {car.mileage.toLocaleString()} miles</li>
        {car.color && <li>Color: {car.color}</li>}
        {car.condition && <li>Condition: {car.condition}</li>}
      </ul>
      {car.description && <p style={{ marginTop: 12 }}>{car.description}</p>}
    </main>
  );
}
