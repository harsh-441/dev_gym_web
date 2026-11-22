import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { YouTubeVideo } from '@parshuram/shared';
import { getVerifiedAdminIdentity } from '@/lib/admin-auth';
import { deleteYouTubeVideo, getVideoId, listYouTubeVideos, upsertYouTubeVideo } from '@/lib/youtube-videos';

export const dynamic = 'force-dynamic';

function unauthorized() {
  return NextResponse.json({ success: false, error: 'Please sign in with an owner or admin account.' }, { status: 401 });
}

export async function GET(request: NextRequest) {
  if (!await getVerifiedAdminIdentity(request)) return unauthorized();
  try {
    return NextResponse.json({ success: true, videos: await listYouTubeVideos() }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Could not load videos.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const identity = await getVerifiedAdminIdentity(request);
  if (!identity) return unauthorized();
  return saveVideo(request, identity.id, false);
}

export async function PATCH(request: NextRequest) {
  const identity = await getVerifiedAdminIdentity(request);
  if (!identity) return unauthorized();
  return saveVideo(request, identity.id, true);
}

async function saveVideo(request: NextRequest, userId: string, requireExisting: boolean) {
  try {
    const body = await request.json();
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const youtubeUrl = typeof body.youtube_url === 'string' ? body.youtube_url.trim() : '';
    const category = typeof body.category === 'string' ? body.category.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const youtubeId = getVideoId(youtubeUrl);
    if (!title || !category || !youtubeId) {
      return NextResponse.json({ success: false, error: 'Enter a title, category, and valid YouTube video URL.' }, { status: 400 });
    }

    const existingId = typeof body.id === 'string' ? body.id : '';
    if (requireExisting && !existingId) return NextResponse.json({ success: false, error: 'Video ID is required for an update.' }, { status: 400 });
    const existing = existingId ? (await listYouTubeVideos()).find((video) => video.id === existingId) : undefined;
    if (existingId && !existing) return NextResponse.json({ success: false, error: 'Video not found.' }, { status: 404 });
    const currentVideos = await listYouTubeVideos();
    const video: YouTubeVideo = {
      id: existing?.id || randomUUID(),
      title,
      youtube_id: youtubeId,
      youtube_url: youtubeUrl,
      category,
      description,
      is_featured: existing?.is_featured || false,
      order_index: existing?.order_index ?? currentVideos.length + 1,
      created_at: existing?.created_at || new Date().toISOString()
    };
    await upsertYouTubeVideo(video);
    return NextResponse.json({ success: true, video, updated_by: userId });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Could not save video.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!await getVerifiedAdminIdentity(request)) return unauthorized();
  try {
    const { id } = await request.json();
    if (typeof id !== 'string' || !id.trim()) return NextResponse.json({ success: false, error: 'Video ID is required.' }, { status: 400 });
    await deleteYouTubeVideo(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Could not remove video.' }, { status: 500 });
  }
}
