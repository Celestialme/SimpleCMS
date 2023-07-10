import { passwordToken } from "@lucia-auth/tokens";
import { SESSION_COOKIE_NAME } from "lucia-auth";
import type { User } from "@src/collections/Auth";

export async function load(event) {
  let session = event.cookies.get(SESSION_COOKIE_NAME) as string;
  let user = await validate(auth, session);
  if (user.status == 200) {
    return {
      user: user.user
    };
  } else {
    throw redirect(302, `/login`);
  }
}
