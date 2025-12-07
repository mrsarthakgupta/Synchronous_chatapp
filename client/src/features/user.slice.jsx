import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createSlice } from "@reduxjs/toolkit";
import {
  HOST,
  SIGNUP_ROUTE,
  LOGIN_ROUTE,
  GET_USER_INFO,
  UPDATE_PROFILE_ROUTE,
  ADD_PROFILE_IMAGE_ROUTE,
  REMOVE_PROFILE_IMAGE_ROUTE,
  LOGOUT_ROUTE,
  SEARCH_CONTACTS_ROUTE,
  GET_MESSAGES_ROUTE,
  GET_CONTACTS_FOR_DM,
  GET_ALL_CONTACT_ROUTE,
  CREATE_CHANNEL,
  GET_USER_CHANNELS_ROUTES,
} from "@/utils/constant";
import { act } from "react";
export const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: "",
  },

  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

export const createChatSlice = createSlice({
  name: "chat",
  initialState: {
    selectedChatType: undefined,
    selectedChatData: {},
    selectedChatMessages: [],
    directMessagesContact: [],
    channels: [],
    isUploading: false,
    isDownloading: false,
    fileUploadProgress: 0,
    fileDownloadProgress: 0,
  },

  reducers: {
    setChannels: (state, action) => {
      state.channels = action.payload;
    },
    addChannel: (state, action) => {
      state.channels = [...state.channels, action.payload];
    },
    setIsUploading: (state, action) => {
      state.isUploading = action.payload;
    },
    setIsDownloading: (state, action) => {
      state.isDownloading = action.payload;
    },
    setFileUploadProgress: (state, action) => {
      state.fileUploadProgress = action.payload;
    },
    setFileDownloadProgress: (state, action) => {
      state.fileDownloadProgress = action.payload;
    },
    setDirectMessagesContact: (state, action) => {
      state.directMessagesContact = action.payload;
    },
    setSelectedChatType: (state, action) => {
      state.selectedChatType = action.payload;
    },
    setSelectedChatData: (state, action) => {
      state.selectedChatData = action.payload;
    },
    closeChat: (state) => {
      state.selectedChatData = undefined;
      state.selectedChatType = undefined;
      state.selectedChatMessages = [];
    },
    setSelectedChatMessages: (state, action) => {
      state.selectedChatMessages = action.payload;
    },
    setAddMessage: (state, action) => {
      const chatMessages = state.selectedChatMessages;
      const chatType = state.selectedChatType;
      const message = action.payload;
      state.selectedChatMessages = [
        ...chatMessages,
        {
          ...message,
          receipent:
            chatType === "channel" ? message.receipent : message.receipent._id,
          sender: chatType === "channel" ? message.sender : message.sender._id,
        },
      ];
    },
  },
});

// This file defines the API slice for managing student data
// It includes endpoints for fetching and creating students, with caching and invalidation features.
export const userApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: HOST,
  }),
  // tagTypes: [ 'User'],
  endpoints: (builder) => ({
    getCurrentUserInfo: builder.query({
      query: () => ({
        url: GET_USER_INFO,
        method: "GET",
        credentials: "include",
      }),
      //providesTags: ["UserChange"],
    }),

    // Endpoint for user signup
    userSignUp: builder.mutation({
      query: (userData) => ({
        url: SIGNUP_ROUTE,
        method: "POST",
        body: userData,
        credentials: "include",
      }),
      providesTags: ["UserChange"],
    }),
    userLogin: builder.mutation({
      query: (userData) => ({
        url: LOGIN_ROUTE,
        method: "POST",
        body: userData,
        credentials: "include",
      }),
      //providesTags: ["UserChange"],
    }),

    updateProfile: builder.mutation({
      query: (userData) => ({
        url: UPDATE_PROFILE_ROUTE,
        method: "POST",
        body: userData,
        credentials: "include",
      }),
      //providesTags: ["UserChange"],
    }),

    uploadProfileImage: builder.mutation({
      query: (formData) => ({
        url: ADD_PROFILE_IMAGE_ROUTE,
        method: "POST",
        body: formData,
        credentials: "include",
      }),
      //providesTags: ["UserChange"],
    }),
    removeProfileImage: builder.mutation({
      query: () => ({
        url: REMOVE_PROFILE_IMAGE_ROUTE,
        method: "DELETE",
        credentials: "include",
      }),
      //providesTags: ["UserChange"],
    }),
    logOut: builder.mutation({
      query: () => ({
        url: LOGOUT_ROUTE,
        method: "POST",
        credentials: "include",
      }),
    }),
    searchContacts: builder.mutation({
      query: (searchTerm) => ({
        url: SEARCH_CONTACTS_ROUTE,
        method: "POST",
        body: searchTerm,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      // invalidatesTags:["UserChange"]
    }),

    getMessages: builder.mutation({
      query: ({ id }) => ({
        url: GET_MESSAGES_ROUTE,
        method: "POST",
        body: { id },
        credentials: "include",
      }),
    }),

    getContactsForDM: builder.query({
      query: () => ({
        url: GET_CONTACTS_FOR_DM,
        method: "GET",
        credentials: "include",
      }),
    }),
    getAllContacts: builder.query({
      query: () => ({
        url: GET_ALL_CONTACT_ROUTE,
        method: "GET",
        credentials: "include",
      }),
    }),
    createNewChannel: builder.mutation({
      query: ({name,members}) => ({
        url: CREATE_CHANNEL,
        method: "POST",
        body:{name, members},
        credentials: "include",
      }),
    }),
     getUserChannels: builder.query({
      query: () => ({
        url: GET_USER_CHANNELS_ROUTES,
        method: "GET",
        credentials: "include",
      }),
    }),
    

    // uploadFile: builder.mutation({
    //   query: (formData) => ({
    //     url: UPLOAD_FILE_ROUTE,
    //     method: "POST",
    //     body: formData,
    //     credentials: "include",
    //   }),
    //   //providesTags: ["UserChange"],
    // }),

    // fetchFile: builder.query({
    //   query: (url) => ({
    //     url,
    //     method: "GET",
    //     responseHandler: async (response) =>
    //       URL.createObjectURL(await response.blob()),
    //     cache: "no-cache",
    //   }),
    //responseHandler: (response) => response.blob(),
    // }),
  }),
});

export const {
  useUserSignUpMutation,
  useUserLoginMutation,
  useGetCurrentUserInfoQuery,
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
  useRemoveProfileImageMutation,
  useLogOutMutation,
  useSearchContactsMutation,
  useGetMessagesMutation,
  useGetContactsForDMQuery,
  useLazyGetAllContactsQuery,
  useCreateNewChannelMutation,
  useLazyGetUserChannelsQuery

} = userApi;
export const { setUserInfo } = userSlice.actions;
export const {
  setSelectedChatData,
  setSelectedChatType,
  closeChat,
  setSelectedChatMessages,
  setAddMessage,
  setDirectMessagesContact,
  setFileDownloadProgress,
  setFileUploadProgress,
  setIsDownloading,
  setIsUploading,
  addChannel,
  setChannels
} = createChatSlice.actions;
export const userReducer = userSlice.reducer;
export const chatReducer = createChatSlice.reducer;
