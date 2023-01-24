import type {RequestHandler} from './$types'
import {auth} from "@src/routes/api/db"
export  const POST:RequestHandler  = async ({ request }) => {
    let formData = await request.formData()
    let sessionId = formData.get("sessionId") as string
    const resp = await auth.validateSessionUser(sessionId).catch(() => null);
	if (!resp) return new Response(JSON.stringify({ status: 404 }));
    return new Response(JSON.stringify({ user: resp.user.username, session: resp.session?.sessionId, status: 200 }));
  }