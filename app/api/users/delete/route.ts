// app/api/users/delete/route.ts
import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function DELETE() {
 try {
   const session = await getSession();
   if (!session?.idToken) {
     return new NextResponse('Unauthorized', { status: 401 });
   }

   const response = await fetch('http://traefik.traefik.svc.cluster.local:5000/users', {
     method: 'DELETE',
     headers: {
       'Authorization': `Bearer ${session.idToken}`,
     },
   });

   if (!response.ok) {
     throw new Error('Failed to delete account');
   }

   return new NextResponse(null, { status: 200 });
 } catch (error) {
   return new NextResponse('Internal Server Error', { status: 500 });
 }
}