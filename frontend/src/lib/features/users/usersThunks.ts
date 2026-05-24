// store/features/products/productsThunks.ts
import { HOST } from "@/app/shared/constants/config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAuthHeader } from "@/app/shared/lib/getAuthToken";

export const fetchUser = createAsyncThunk(
  "users/fetchUser",
  async (id: string, { rejectWithValue }) => {
    const authHeader = await getAuthHeader();
    const res = await fetch(`${HOST}/api/users/${id}`, {
      headers: authHeader,
    });
    if (!res.ok) {
      return rejectWithValue("Failed to fetch user");
    }
    return res.json();
  },
);
