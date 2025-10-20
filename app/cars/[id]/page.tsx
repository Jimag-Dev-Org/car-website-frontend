import { getCar, dollars, getCarImages, imgUrl } from '../../../lib/api';

export default async function CarDetail({ params }: { params: { id: string } }) {
  const [car, images] = await Promise.all([ getCar(params.id), getCarImages(params.id) ]);

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <a href="/" style={{ textDecoration: 'none' }}>← Back</a>

      {/* simple gallery */}
      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginTop: 12 }}>
          <img src={imgUrl(images[0].s3KeyOriginal)} alt={images[0].altText || ''} style={{ width: '100%', height: 360, objectFit: 'cover', borderRadius: 8 }} />
          <div style={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: 8 }}>
            {images.slice(1,4).map((im) => (
              <img key={im.id} src={imgUrl(im.s3KeyOriginal)} alt={im.altText || ''} style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 8 }} />
            ))}
          </div>
        </div>
      )}

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
