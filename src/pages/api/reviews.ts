import type { APIRoute } from 'astro';
import { getReviewsWithRefresh } from '@/lib/reviews-cache';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const data = await getReviewsWithRefresh();

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    console.error('Reviews API error:', error);

    return new Response(JSON.stringify({ error: 'Failed to load reviews' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
