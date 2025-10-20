import { getCars, dollars } from '../lib/api';

type Props = { searchParams: { [k: string]: string | string[] | undefined } };

function linkFor(params: Record<string, any>) {
  const s = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') s.append(k, String(v));
  });
  return `/?${s.toString()}`;
}

export default async function Home({ searchParams }: Props) {
  const title = process.env.NEXT_PUBLIC_SITE_NAME || 'Jimag Autos Marketplace';

  const page = Number(searchParams.page ?? 1);
  const pageSize = Number(searchParams.pageSize ?? 12);

  const data = await getCars({
    make: searchParams.make as string | undefined,
    model: searchParams.model as string | undefined,
    yearMin: searchParams.yearMin ? Number(searchParams.yearMin) : undefined,
    yearMax: searchParams.yearMax ? Number(searchParams.yearMax) : undefined,
    priceMin: searchParams.priceMin ? Number(searchParams.priceMin) : undefined,
    priceMax: searchParams.priceMax ? Number(searchParams.priceMax) : undefined,
    mileageMax: searchParams.mileageMax ? Number(searchParams.mileageMax) : undefined,
    sort: (searchParams.sort as string) || 'newest',
    page, pageSize,
  });

  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>{title}</h1>
      <p style={{ marginTop: 8, color: '#555' }}>Browse inventory. Filter, sort, and paginate.</p>

      {/* Filters form uses GET so params land in the URL */}
      <form method="get" style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
        <input name="make" placeholder="Make" defaultValue={(searchParams.make as string) || ''} />
        <input name="model" placeholder="Model" defaultValue={(searchParams.model as string) || ''} />
        <input name="yearMin" placeholder="Year min" defaultValue={(searchParams.yearMin as string) || ''} />
        <input name="yearMax" placeholder="Year max" defaultValue={(searchParams.yearMax as string) || ''} />
        <input name="priceMax" placeholder="Max $ price" defaultValue={(searchParams.priceMax as string) || ''} />
        <select name="sort" defaultValue={(searchParams.sort as string) || 'newest'}>
          <option value="newest">Newest</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
          <option value="mileage_asc">Lowest mileage</option>
        </select>
        <button type="submit">Apply</button>
      </form>

      <h2 style={{ marginTop: 24 }}>Results ({data.total})</h2>
      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
        {data.items.map((c) => (
          <a key={c.id} href={`/cars/${c.id}`} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontWeight: 700 }}>{c.make} {c.model}</div>
            <div>{c.year} · {c.mileage.toLocaleString()} miles</div>
            <div style={{ marginTop: 6, fontWeight: 700 }}>{dollars(c.priceCents)}</div>
          </a>
        ))}
        {!data.items.length && <div>No cars match your filters.</div>}
      </div>

      {/* Pagination */}
      <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
        <a href={linkFor({ ...searchParams, page: Math.max(1, page - 1) })} aria-disabled={page <= 1}
           style={{ pointerEvents: page <= 1 ? 'none' : 'auto', opacity: page <= 1 ? 0.4 : 1 }}>
          ← Prev
        </a>
        <span>Page {page} / {totalPages}</span>
        <a href={linkFor({ ...searchParams, page: Math.min(totalPages, page + 1) })} aria-disabled={page >= totalPages}
           style={{ pointerEvents: page >= totalPages ? 'none' : 'auto', opacity: page >= totalPages ? 0.4 : 1 }}>
          Next →
        </a>
      </div>
    </main>
  );
}
