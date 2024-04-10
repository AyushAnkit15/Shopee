import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { User } from "../../types/types";
import axios from "axios";
import { MessageResponse, UserResponse } from "../../types/api.types";

// import { server } from "../store";
export const userAPI = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user/`,
  }),
  endpoints: (builder) => ({
    login: builder.mutation<MessageResponse, User>({
      query: (user) => ({
        url: "new",
        method: "POST",
        body: user,
      }),
    }),
  }),
});

export const getUser = async (_id: string) => {
  try {
    const { data }: { data: UserResponse } = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/v1/user/${_id}`
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const { useLoginMutation } = userAPI;
