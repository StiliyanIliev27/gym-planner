import { supabase } from "./client";
import generateConfirmationCode from "@/lib/utils/generateVerificationCode";

export async function signInAsync(email, password) {
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { error, user: data?.user };
}

export async function signUpAsync({ email, password, firstName, lastName }) {
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "http://localhost/skip-confirmation",
    },
  });

  const user = data?.user;
  if (signUpError || !user) {
    return { error: signUpError };
  }

  const confirmationCode = generateConfirmationCode();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  const { error: profileError } = await supabase.from("profiles").insert({
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

export async function signOutAsync() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

async function sendConfirmationEmail(email, code) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-confirmation-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email, code }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || "Failed to send email",
      };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function verifyConfirmationCodeAsync(code) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("confirmation_code", code)
    .gte("confirmation_expires_at", new Date().toISOString())
    .single();

  if (error || !profile) {
    return { success: false, error: "Invalid or expired code." };
  }

  const userId = profile.id;

  const { error: profileUpdateError } = await supabase
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

  return { success: true };
}
