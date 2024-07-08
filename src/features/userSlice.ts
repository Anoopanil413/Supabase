import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../supabase';

export const login:any = createAsyncThunk('users/login', async ({ email, password }:any, { rejectWithValue }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return rejectWithValue(error.message);
  }
  return data;
});

export const fetchProfile:any = createAsyncThunk('users/fetchProfile', async (userId, { rejectWithValue }) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();


  if (error) {
    return rejectWithValue(error.message);
  }
  return profile;
});

export const createProfile:any = createAsyncThunk('users/createProfile', async (profileData:any, { rejectWithValue }) => {
  try {
    let avatar_url = profileData.avatar_url;


    if (profileData.avatar_file) {

      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(`public/${profileData.username}-${Date.now()}`, profileData.avatar_file);

      if (uploadError) {
        console.log("urllll",uploadError)

        throw new Error(uploadError.message);
      }

      const { publicURL, error: urlError } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);

      if (urlError) {
        throw new Error(urlError.message);
      }
      console.log("urllll",publicURL)
      avatar_url = publicURL;
    }

    const session = await supabase.auth.getSession();
    if (!session) {
      throw new Error("User is not authenticated");
    }
    const userId = session.data.session?.user.id;

    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({ ...profileData, id: userId, avatar_url }, { onConflict: ['id'] });

    if (upsertError) {
      throw new Error(upsertError.message);
    }

    return { ...profileData, id: userId, avatar_url };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});
const authSlice = createSlice({
  name: 'users',
  initialState: {
    user: null,
    profile: null,
    loading: false,
    error: null,
    viewModal:false
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.profile = null;
      sessionStorage.clear()
      localStorage.clear()
    },
    setModalView(state,payload){
        state.viewModal = payload.payload;
    }


  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout,setModalView } = authSlice.actions;
export default authSlice.reducer;
