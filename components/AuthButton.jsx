import { getSession } from '@auth0/nextjs-auth0';

export default async function AuthButton() {
  
  const { user } = await getSession();

  return (
    <div>

    {!user ? (
        <div>
          <a href="/api/auth/login">Login</a>
        </div>
      ) : (
          <div>
          <a href="/api/auth/logout">Logout</a>
        </div>
      )}
      </div>
  );
}