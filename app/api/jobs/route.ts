// app/api/jobs/route.ts
import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import api_url from '@/config';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session || !session.accessToken) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const response = await fetch(`${api_url}/jobRead`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}