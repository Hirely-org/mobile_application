// app/api/jobs/route.tss
import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import api_url from '@/config';

export async function GET() {
  try {
    const session = await getSession();
    console.log('APIURL', api_url);
    if (!session || !session.idToken) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const response = await fetch(`http://traefik.traefik.svc.cluster.local:5000/jobRead`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.idToken}`,
      },
    });

    if (!response.ok) {
        // Log more details about the error
        console.error('Internal service response:', {
          status: response.status,
          statusText: response.statusText
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      // Log the full error details
      console.error('Detailed API route error:', error);
      return new NextResponse(
        JSON.stringify({ message: 'Internal Server Error', error: error.message }), 
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  }