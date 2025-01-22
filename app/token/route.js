import { NextResponse } from 'next/server';
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';

export const GET = withApiAuthRequired(async function GET(req) {
  try {
    const session = await getSession(req, NextResponse);
    if (!session?.idToken) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 });
    }
    console.log('Token:', session.idToken);
    return NextResponse.json({ idToken: session.idToken });
  } catch (error) {
    console.error('Failed to get token:', error);
    return NextResponse.json({ error: 'Failed to get token' }, { status: 500 });
  }
});