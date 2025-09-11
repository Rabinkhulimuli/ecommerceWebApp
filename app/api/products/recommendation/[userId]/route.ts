import { getUserRecommendations } from '@/lib/userRecommendation';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const recommendations = await getUserRecommendations(userId, limit);

    // Add caching headers for better performance
    const response = NextResponse.json(recommendations);
    response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate');

    return response;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}
export const revalidate = 3600; // Revalidate every hour
