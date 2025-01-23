// app/api/jobs/[id]/route.ts
import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log("ROUTEJOB",params.id);
  try {
    const session = await getSession();
    
    if (!session || !session.idToken) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const response = await fetch(`http://traefik.traefik.svc.cluster.local:5000/jobRead/${params.id}`, {
      headers: {
        'Authorization': `Bearer ${session.idToken}`,
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