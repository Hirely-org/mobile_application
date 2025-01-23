// middleware.ts
import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default withMiddlewareAuthRequired(
  async function middleware(request: NextRequest) {
    try {
      const baseUrl = request.nextUrl.origin;
      // Get token from your endpoint
      const tokenResponse = await fetch(`${baseUrl}/token`, {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      });

      if (!tokenResponse.ok) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      const { idToken } = await tokenResponse.json();

      // Then, fetch user data with the token
      const userResponse = await fetch(`http://traefik.traefik.svc.cluster.local:5000/users/me`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (!userResponse.ok) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      const userData = await userResponse.json();
      console.log('User data:', userData);
      // Check if user has the required role (admin or employer)
      if (userData.role?.name !== 'Admin' && userData.role?.name !== 'Employer') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
);

export const config = {
  matcher: ['/job/create'],
};