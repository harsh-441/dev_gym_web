type SupabaseRequestOptions = {
  method?: string;
  query?: Record<string, string>;
  body?: unknown;
  prefer?: string;
};

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url: url.replace(/\/$/, ''), key } : null;
}

export async function supabaseRest<T>(path: string, options: SupabaseRequestOptions = {}): Promise<T> {
  const config = supabaseConfig();
  if (!config) throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');

  const url = new URL(`${config.url}/rest/v1/${path}`);
  for (const [key, value] of Object.entries(options.query || {})) url.searchParams.set(key, value);

  const response = await fetch(url, {
    method: options.method || 'GET',
    cache: 'no-store',
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      'Content-Type': 'application/json',
      ...(options.prefer ? { Prefer: options.prefer } : {})
    },
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {})
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${detail || response.statusText}`);
  }
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
