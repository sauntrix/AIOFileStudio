export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageBase64 } = body;
    if (!imageBase64) return new Response(JSON.stringify({ error: 'No image provided' }), { status: 400 });

    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ error: 'REMOVE_BG_API_KEY not configured' }), { status: 500 });

    // remove.bg supports image_file_b64 in form data or JSON; we'll use form-data multipart
    const b64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

    // Build multipart/form-data body
    const boundary = '----file-studio-boundary-' + Date.now();
    const CRLF = '\r\n';
    let payload = '';
    payload += `--${boundary}${CRLF}`;
    payload += `Content-Disposition: form-data; name="image_file_b64"${CRLF}${CRLF}`;
    payload += b64 + CRLF;
    payload += `--${boundary}--${CRLF}`;

    const res = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'multipart/form-data; boundary=' + boundary
      },
      body: payload
    });

    if (!res.ok) {
      const text = await res.text();
      return new Response(text, { status: res.status });
    }
    const arrayBuffer = await res.arrayBuffer();
    return new Response(arrayBuffer, {
      status: 200,
      headers: { 'Content-Type': 'image/png' }
    });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Remove.bg failed', detail: String(err) }), { status: 500 });
  }
}
