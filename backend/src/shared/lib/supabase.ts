import { createClient } from "@supabase/supabase-js";

// Production behavior: require proper SUPABASE env vars.
// For tests, provide a minimal stub so unit tests that import the repo
// don't need real Supabase credentials. This keeps production behavior
// unchanged while making tests robust.
let supabaseClient: any;

if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabaseClient = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  );
} else if (process.env.NODE_ENV === "test") {
  const storageStub = {
    upload: async () => ({ error: null }),
    getPublicUrl: () => ({ data: { publicUrl: "http://example.com/fake" } }),
    remove: async () => ({ error: null }),
  };

  const from = (_: string) => storageStub;

  supabaseClient = { storage: { from } };
} else {
  // In non-test environments, missing env vars are a misconfiguration.
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
}

export const supabase = supabaseClient;
