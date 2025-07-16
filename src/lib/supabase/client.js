import { createClient } from "@supabase/supabase-js";
import { SUPABASE_CONFIG, validateEnvironmentConfig } from "../config/environment.js";

// Validate configuration on import
validateEnvironmentConfig();

export const supabase = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);