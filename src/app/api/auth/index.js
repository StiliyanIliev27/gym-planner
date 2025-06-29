import { client, getAdmin } from "../client";
import { default as generateConfirmationCode } from "@/lib/generateVerificationCode";

const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
const ANON_API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 
async function signInAsync(email, password) {
  const { error, data } = await client.auth.signInWithPassword({
    email,
    password,
  });

  return { error, user: data?.user };
}

async function signUpAsync({ email, password, firstName, lastName }) {
  const { data, error: signUpError } = await client.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: 'http://localhost/skip-confirmation', // prevent default email link
    },
  });

  const user = data?.user;
  if (signUpError || !user) {
    return { error: signUpError };
  }

  const confirmationCode = generateConfirmationCode();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 min from now

  const { error: profileError } = await client.from("profiles").insert({
    id: user.id,
    first_name: firstName,
    last_name: lastName,
    avatar_url: "",
    confirmation_code: confirmationCode,
    confirmation_expires_at: expiresAt,
    is_verified: false,
  });

  if (profileError) {
    return { error: profileError };
  }

  await sendConfirmationEmail(email, confirmationCode); 

  return { user };
}

async function signOutAsync() {
  const { error } = await client.auth.signOut();
  return { error };
}

async function sendConfirmationEmail(email, code) {
  try {
    const response = await fetch(`https://${API_KEY}.supabase.co/functions/v1/send-confirmation-email`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json", // ✅ Required!
        Authorization: `Bearer ${ANON_API_KEY}`, // ✅ Assumes this is a valid Supabase anon key
      },
      body: JSON.stringify({ email, code }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); // Prevents crash on non-JSON error
      return { success: false, error: errorData.error || 'Failed to send email' };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}


export async function verifyConfirmationCodeAsync(code) {
  // Step 1: Validate confirmation code
  const { data: profile, error } = await client
    .from("profiles")
    .select("id") // profile.id === auth.users.id
    .eq("confirmation_code", code)
    .gte("confirmation_expires_at", new Date().toISOString())
    .single();

  if (error || !profile) {
    return { success: false, error: "Invalid or expired code." };
  }

  const userId = profile.id;

  // Step 2: Update profiles table
  const { error: profileUpdateError } = await client
    .from("profiles")
    .update({
      is_verified: true,
      confirmation_code: null,
      confirmation_expires_at: null,
    })
    .eq("id", userId);

  if (profileUpdateError) {
    return { success: false, error: "Failed to update profile." };
  }

  // Step 3: Confirm email in auth.users (requires admin client)

  const admin = getAdmin();
  const { error: confirmError } = await admin.auth.admin.getUserById(userId, {
    email_confirm: true,
  });

  if (confirmError) {
    console.error("Failed to confirm user email:", confirmError);
    return { success: false, error: "Failed to confirm email in auth.users." };
  }

  return { success: true };
}

export { signInAsync, signUpAsync, signOutAsync, verifyConfirmationCodeAsync };
