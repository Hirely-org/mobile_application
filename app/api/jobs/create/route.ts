// app/api/jobs/create/route.ts
import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import api_url from '@/config';

export async function POST(request: Request) {
 try {
   const session = await getSession();
   console.log('APIURL', api_url);
   if (!session?.user) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }
   console.log('Session', session.idToken);
   const formData = await request.formData();
   
   const response = await fetch(`http://traefik.traefik.svc.cluster.local:5000/jobWrite`, {
     method: 'POST',
     body: formData,
     headers: {
       'Authorization': `Bearer ${session.idToken}`
     }
   });

   if (!response.ok) {
     throw new Error(await response.text());
   }

   const data = await response.json();
   return NextResponse.json(data);
 } catch (error) {
   console.error('Job creation error:', error);
   return NextResponse.json(
     { error: error.message || 'Failed to create job' },
     { status: 500 }
   );
 }
}