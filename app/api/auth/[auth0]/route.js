// app/api/auth/[auth0]/route.js
import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

// Default handler for all Auth0 routes (login, logout, callback, etc.)
export const GET = handleAuth({
  login: async (req) =>
    handleLogin(req, {
      authorizationParams: {
        prompt: 'login', // 🔹 Forces login page to appear every time
      },
    }),
});
