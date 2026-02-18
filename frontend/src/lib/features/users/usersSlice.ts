import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUser } from "./usersThunks";

type UserState = {
  data: {
    id: string;
    role: string;
    first_name: string;
    last_name: string;
    email: string;
    nationality: string;
    avatar_url: string;
  } | null;
  loading: boolean;
  error: string | null;
};

const initialState: UserState = {
  data: null,
  loading: true,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetUser(state) {
      state.data = null;
      state.loading = true;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<{ loading: boolean }>) {
      state.loading = action.payload.loading;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.user;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Something went wrong";
      });
  },
});

export const { resetUser, setLoading } = usersSlice.actions;
export default usersSlice.reducer;
