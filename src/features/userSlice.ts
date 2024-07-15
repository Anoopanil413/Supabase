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



export const fetchInitialChannels:any = createAsyncThunk(
  'channels/fetchInitialChannels',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('channels')
        .select('*');
      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error:any) {
      return rejectWithValue(error.message);
    }
  }
);


export const SubscribetoChannels:any = createAsyncThunk(
  'users/subscribeChannels',
  async (_, {dispatch, rejectWithValue }) => {
    const channelSubscribed = await supabase
      .channel('channels_chain')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'channels'
        },
        (payload) =>{
          dispatch(addChannel(payload.new));
        } 
      )
      .subscribe();

    if (!channelSubscribed) {
      return rejectWithValue('Failed to subscribe to channels database');
    }

    return channelSubscribed;
  }
);

export const unsubscribeFromChannels:any = createAsyncThunk(
  'users/unsubscribeChannels',
  async (_, { rejectWithValue }) => {
    const val = await supabase.channel('channels').unsubscribe();

    if (val == 'error') {
      return rejectWithValue('Failed to unsubscribe from channels database');
    }

    return true;
  }
);
export const subscribeToMessages:any = createAsyncThunk(
  'users/subscribeMessages',
  async (channelDat:any, { rejectWithValue }) => {
    const {currentChannel:channelName,user} = channelDat
    const myChannel = supabase.channel(channelName, {
      config: {
        broadcast: { ack: true },
      },
    });

    const broadcastChannel = await myChannel.subscribe(async (status) => {
      if (status !== 'SUBSCRIBED') {
        return false;
      }

      const userdat = {
        id:user.id,
        username:user.username
      }
      const serverResponse = await myChannel.send({
        type: 'broadcast',
        event: 'acknowledge',
        payload: {userdat},
      });


console.log("sunscribed",serverResponse,channelName)

      return true;
    });

    if (!broadcastChannel) {
      return rejectWithValue('Failed to subscribe to messages channel');
    }

    const sendMessage = (message:string) => {
      console.log("inside slice I am getting the image as",message)
      myChannel.send({
        type: 'broadcast',
        event: 'message',
        payload: { message },
      });
    };

    const listenMessages = (callback:any) => {
      myChannel.on('broadcast', { event: 'message' }, (payload) => {
        callback(payload);
      });
    };

    const unsubscribeFromChannel = async()=>{
      const server = await myChannel.unsubscribe()

      console.log("Unsubscribed",server)


    }


    return { broadcastChannel, sendMessage, listenMessages ,unsubscribeFromChannel};
  }
);

export const unsubscribeFromMessages:any = createAsyncThunk(
  'users/unsubscribeMessages',
  async (channelDat, { rejectWithValue }) => {
    const {currentChannel} = channelDat

    const val = await supabase.channel(currentChannel).unsubscribe();

    if (val == 'error') {
      return rejectWithValue('Failed to unsubscribe from messages channel');
    }

    return true;
  }
);




export const createProfile:any = createAsyncThunk('users/createProfile', async (profileData:any, { rejectWithValue }) => {
  try {
    let avatar_url = profileData.avatar_url;

    if (profileData.avatar_url) {

      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(`public/${profileData.username}-${Date.now()}`, profileData.avatar_url);

      if (uploadError) {
        console.log("Error",uploadError)

        throw new Error(uploadError.message);
      }

      const publicURL = await supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);

      if (!publicURL) {
        throw new Error("no image url ");
      }
      avatar_url = publicURL.data.publicUrl;


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
    }else{
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
    }

  } catch (error:any) {
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
    viewModal:false,
    messagesSubscription: null,
    channelsSubscription: null,
    channels: [],
    currentChannel:null,
    channelMessagesOnSubscription: {},
    currentChannelname:null
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
    },
    addChannel: (state:any, action) => {
      state.channels.push(action?.payload);
    },
    setUsersCurrentChanel:(state, action)=>{
      state.currentChannel = action.payload
    },
    setCurrentChannelName:(state,action)=>{
      state.currentChannelname = action.payload
    },
    setChannelOnSubscriptionForMsgs: (state:any, action) => {
      const { channelName } = action.payload;
      if (!state.channelMessagesOnSubscription[channelName]) {

        state.channelMessagesOnSubscription[channelName] = { messages: [] };
      }
    },
    addMessageToChannel: (state:any, action:any) => {
      const { channelName, message:newMsg,user,date,image} = action.payload;
      if (state.channelMessagesOnSubscription[channelName]) {

        const message = {
          messages:newMsg,
          user,
          date,
          image:image

        }
        state.channelMessagesOnSubscription[channelName].messages.push(message);
      }
    },
    removeChannelDataonExit:(state:any,action:any)=>{

   

      if (state.channelMessagesOnSubscription[action.payload]) {
        delete state.channelMessagesOnSubscription[action.payload];
      }

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
      })
      .addCase(SubscribetoChannels.fulfilled, (state, action) => {
        state.channelsSubscription = action.payload;
      })
      .addCase(SubscribetoChannels.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(unsubscribeFromChannels.fulfilled, (state) => {
        state.channelsSubscription = null;
      })
      .addCase(unsubscribeFromChannels.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(subscribeToMessages.fulfilled, (state, action) => {
        state.messagesSubscription = action.payload;
      })
      .addCase(subscribeToMessages.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(unsubscribeFromMessages.fulfilled, (state) => {
        state.messagesSubscription = null;
      })
      .addCase(unsubscribeFromMessages.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchInitialChannels.fulfilled, (state, action) => {
        state.channels = action.payload;
      })
      .addCase(fetchInitialChannels.rejected, (state, action) => {
        state.error = action.payload;
      })
  },
});

export const { logout,setModalView, addChannel,setUsersCurrentChanel,setChannelOnSubscriptionForMsgs,addMessageToChannel,setCurrentChannelName,removeChannelDataonExit} = authSlice.actions;
export default authSlice.reducer;
