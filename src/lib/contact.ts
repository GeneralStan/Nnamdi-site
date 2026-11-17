export type ContactPayload = {
  name: string;
  email: string;
  company: string;
  message: string;
};

/**
 * STUB — nothing is delivered yet.
 *
 * The form is front-end only for now. Replace the body of this function with
 * the real request (a Route Handler, a form service, an email API…) and let it
 * throw on failure; the form already handles pending, success and error states.
 */
export async function submitContact(payload: ContactPayload): Promise<void> {
  if (process.env.NODE_ENV !== "production") {
    console.info("[contact] stub submission — not sent anywhere", payload);
  }
  await new Promise((resolve) => setTimeout(resolve, 900));
}
