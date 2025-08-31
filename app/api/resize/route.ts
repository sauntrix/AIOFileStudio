import sharp from 'sharp';

export const runtime = 'edge'; // allow Vercel Edge, but sharp is native; you may change to 'nodejs' if issues

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageBase64, width, height, quality = 80, format = 'jpeg' } = body;
    if (!imageBase64) return new Response(JSON.stringify({ error: 'No image provided' }), { status: 400 });

    const b64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
    const buffer = Buffer.from(b64, 'base64');

    let transformer = sharp(buffer);
    if (width || height) transformer = transformer.resize(width || null, height || null, { fit: 'inside' });
    if (format === 'webp') transformer = transformer.webp({ quality });
    else if (format === 'png') transformer = transformer.png();
    else transformer = transformer.jpeg({ quality });

    const out = await transformer.toBuffer();
    return new Response(out, {
      status: 200,
      headers: { 'Content-Type': `image/${format === 'jpg' ? 'jpeg' : format}` }
    });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Processing failed', detail: String(err) }), { status: 500 });
  }
}
