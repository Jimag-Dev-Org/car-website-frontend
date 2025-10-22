'use client';

import { useState } from 'react';
import { presignUpload, registerImage } from '../../../../../lib/api';

export default function UploadImages({ params }: { params: { id: string } }) {
  // ✅ Hooks at the top, always called
  const [status, setStatus] = useState<string>('');

  const enabled = process.env.NEXT_PUBLIC_ENABLE_LOCAL_UPLOADS === 'true';

  if (!enabled) {
    // ⛔️ Early return is fine *after* hooks are declared
    return (
      <main style={{ padding: 24 }}>
        <h1>Uploads disabled</h1>
        <p>Set NEXT_PUBLIC_ENABLE_LOCAL_UPLOADS=true in .env.local to enable this page.</p>
      </main>
    );
  }

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !files.length) return;

    for (const file of Array.from(files)) {
      try {
        setStatus(`Presigning ${file.name}...`);
        const sig = await presignUpload(params.id, file);

        setStatus(`Uploading ${file.name} to S3...`);
        const put = await fetch(sig.url, { method: 'PUT', headers: sig.headers, body: file });
        if (!put.ok) { setStatus(`Upload failed (${put.status}): ${file.name}`); return; }

        setStatus(`Registering ${file.name}...`);
        await registerImage(params.id, sig.key, file.name);

        setStatus(`Uploaded ${file.name}`);
      } catch (err: any) {
        setStatus(`Error: ${err?.message || 'unknown error'}`);
        return;
      }
    }
    setStatus('Done. Reload the car detail page to see images.');
  }

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <h1>Upload images for car {params.id}</h1>
      <input type="file" multiple accept="image/*" onChange={onFiles} />
      <p style={{ marginTop: 12 }}>{status}</p>
      <p style={{ marginTop: 8 }}>
        <a href={`/cars/${params.id}`}>→ View car</a>
      </p>
    </main>
  );
}
