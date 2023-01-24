import type {RequestHandler} from './$types'
import {auth} from "@src/routes/api/db"
export  const POST:RequestHandler  = async ({ request }) => {
  let formData = await request.formData()
  let user = await auth
  .authenticateUser('email', formData.get("email") as string, formData.get("password") as string)
  .catch(() => null);
if (!user) return new Response(JSON.stringify({ status: 404 }));
const session = await auth.createSession(user.userId);
console.log(user);
console.log(session);

return new Response(JSON.stringify({ user: user.username, session: session.sessionId, status: 200 }));
  }

