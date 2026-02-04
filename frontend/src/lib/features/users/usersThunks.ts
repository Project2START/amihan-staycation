// store/features/products/productsThunks.ts
import { HOST } from "@/app/shared/constants/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUser = createAsyncThunk(
  "users/fetchUser",
  async (id: string, { rejectWithValue }) => {
    const res = await fetch(`${HOST}/api/users/${id}`);
    if (!res.ok) {
      return rejectWithValue("Failed to fetch user");
    }
    return res.json();
  },
);
