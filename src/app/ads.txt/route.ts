// Serves /ads.txt for AdSense once NEXT_PUBLIC_ADSENSE_CLIENT is set
// (e.g. "ca-pub-1234567890123456"). Returns 404 until then.

export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client) {
    return new Response("Not configured", { status: 404 });
  }
  const pubId = client.replace(/^ca-/, "");
  return new Response(`google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "content-type": "text/plain" },
  });
}
