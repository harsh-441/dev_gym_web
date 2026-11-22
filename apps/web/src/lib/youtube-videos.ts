import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { INITIAL_YOUTUBE_VIDEOS, YouTubeVideo } from '@parshuram/shared';

const localStorePath = path.join(process.cwd(), '.local-data', 'youtube-videos.json');

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url: url.replace(/\/$/, ''), key } : null;
}

async function supabaseRequest(pathname: string, init?: RequestInit) {
  const config = supabaseConfig();
  if (!config) throw new Error('Supabase is not configured.');
  const response = await fetch(`${config.url}/rest/v1/${pathname}`, {
    ...init,
    cache: 'no-store',
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    }
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase video storage failed (${response.status}): ${detail}`);
  }
  return response;
}

export function getVideoId(value: string) {
  try {
    const url = new URL(value.trim());
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }
    if (!['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(host)) return null;
    const segments = url.pathname.split('/').filter(Boolean);
    const id = url.pathname === '/watch'
      ? url.searchParams.get('v')
      : ['embed', 'shorts', 'live', 'v'].includes(segments[0]) ? segments[1] : null;
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export async function listYouTubeVideos(): Promise<YouTubeVideo[]> {
  if (supabaseConfig()) {
    const response = await supabaseRequest('youtube_videos?select=*&order=order_index.asc,created_at.desc');
    return await response.json();
  }
  try {
    const raw = await readFile(localStorePath, 'utf8');
    return JSON.parse(raw) as YouTubeVideo[];
  } catch (error: any) {
    if (error?.code !== 'ENOENT') throw error;
    return [...INITIAL_YOUTUBE_VIDEOS];
  }
}

export async function upsertYouTubeVideo(video: YouTubeVideo) {
  if (supabaseConfig()) {
    await supabaseRequest('youtube_videos?on_conflict=id', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify(video)
    });
    return;
  }
  const videos = await listYouTubeVideos();
  const index = videos.findIndex((item) => item.id === video.id);
  if (index >= 0) videos[index] = video;
  else videos.unshift(video);
  await mkdir(path.dirname(localStorePath), { recursive: true });
  await writeFile(localStorePath, JSON.stringify(videos, null, 2), 'utf8');
}

export async function deleteYouTubeVideo(id: string) {
  if (supabaseConfig()) {
    await supabaseRequest(`youtube_videos?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
    return;
  }
  const videos = (await listYouTubeVideos()).filter((video) => video.id !== id);
  await mkdir(path.dirname(localStorePath), { recursive: true });
  await writeFile(localStorePath, JSON.stringify(videos, null, 2), 'utf8');
}
