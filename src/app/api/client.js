// src/app/api/client.js
import { createClient } from "@supabase/supabase-js";

const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function getAdmin() {
  console.log("Service role key:", process.env.SUPABASE_SERVICE_ROLE_KEY); // Should print only when this fn is called on server
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export { client, getAdmin };
