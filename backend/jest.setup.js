// Mock @supabase/supabase-js createClient for tests so production code stays unchanged
jest.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        upload: async () => ({ error: null }),
        getPublicUrl: () => ({
          data: { publicUrl: "http://example.com/fake" },
        }),
        remove: async () => ({ error: null }),
      }),
    },
  }),
}));
