import { NextResponse } from 'next/server';

const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN!;
const IG_USER_ID = process.env.INSTAGRAM_USER_ID!;
const API_BASE = 'https://graph.facebook.com/v21.0';

export async function GET() {
  try {
    // Fetch posts (media) with metrics
    const [mediaRes, storiesRes, profileRes] = await Promise.all([
      fetch(`${API_BASE}/${IG_USER_ID}/media?fields=id,caption,timestamp,media_type,like_count,comments_count,permalink,thumbnail_url,media_url&limit=50&access_token=${ACCESS_TOKEN}`),
      fetch(`${API_BASE}/${IG_USER_ID}/stories?fields=id,caption,timestamp,media_type,media_url,thumbnail_url&access_token=${ACCESS_TOKEN}`),
      fetch(`${API_BASE}/${IG_USER_ID}?fields=followers_count,follows_count,media_count,name,username,profile_picture_url&access_token=${ACCESS_TOKEN}`),
    ]);

    const mediaData = await mediaRes.json();
    const storiesData = await storiesRes.json();
    const profileDataRaw = await profileRes.json();

    // Process posts
    const posts = (mediaData.data || []).map((post: Record<string, unknown>) => ({
      id: post.id,
      caption: typeof post.caption === 'string' ? post.caption.substring(0, 100) : '',
      timestamp: post.timestamp,
      mediaType: post.media_type,
      likes: post.like_count || 0,
      comments: post.comments_count || 0,
      permalink: post.permalink,
      thumbnailUrl: post.thumbnail_url || post.media_url,
    }));

    // Calculate profile stats
    const followers = profileDataRaw.followers_count || 0;
    const totalLikes = posts.reduce((s: number, p: { likes: number }) => s + p.likes, 0);
    const totalComments = posts.reduce((s: number, p: { comments: number }) => s + p.comments, 0);
    const engagementRate = posts.length > 0 && followers > 0
      ? ((totalLikes + totalComments) / (posts.length * followers) * 100).toFixed(2)
      : '0';

    // Process stories
    const stories = (storiesData.data || []).map((story: Record<string, unknown>) => ({
      id: story.id,
      caption: story.caption || '',
      timestamp: story.timestamp,
      mediaType: story.media_type,
      thumbnailUrl: story.thumbnail_url || story.media_url,
    }));

    // Format comparison stats
    const typeMap: Record<string, { count: number; likes: number }> = {};
    for (const post of posts) {
      const type = post.mediaType as string;
      if (!typeMap[type]) typeMap[type] = { count: 0, likes: 0 };
      typeMap[type].count += 1;
      typeMap[type].likes += post.likes as number;
    }

    const formatStats = Object.entries(typeMap).map(([type, data]) => ({
      type,
      count: data.count,
      totalLikes: data.likes,
      avgLikes: data.count > 0 ? (data.likes / data.count).toFixed(1) : '0',
      engRate: followers > 0 ? ((data.likes / (data.count * followers)) * 100).toFixed(2) + '%' : '0%',
    }));

    // Day of week analysis
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const dayMap: Record<string, { count: number; likes: number }> = {};
    for (const d of dayNames) dayMap[d] = { count: 0, likes: 0 };
    for (const post of posts) {
      const ts = post.timestamp as string;
      const day = dayNames[new Date(ts).getDay()];
      dayMap[day].count += 1;
      dayMap[day].likes += post.likes as number;
    }
    const dayAnalysis = dayNames.map(day => ({
      day,
      posts: dayMap[day].count,
      avgLikes: dayMap[day].count > 0 ? +(dayMap[day].likes / dayMap[day].count).toFixed(1) : 0,
    }));

    // Top posts by engagement
    const topPosts = [...posts]
      .sort((a, b) => ((b.likes as number) + (b.comments as number)) - ((a.likes as number) + (a.comments as number)))
      .slice(0, 10)
      .map((p, i) => ({
        rank: i + 1,
        ...p,
        engRate: followers > 0 ? (((p.likes as number) + (p.comments as number)) / followers * 100).toFixed(2) + '%' : '0%',
      }));

    return NextResponse.json({
      profile: {
        ...profileDataRaw,
        engagementRate,
        totalLikes,
        totalComments,
        totalPosts: posts.length,
      },
      topPosts,
      stories,
      formatStats,
      dayAnalysis,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
