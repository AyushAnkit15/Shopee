import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { User } from "../../types/types";
import axios from "axios";
import { MessageResponse, UserResponse , ProductResponse , NewProductRequest , UpdateProductRequest , DeleteProductRequest } from "../../types/api.types";
import {
  AllProductsResponse,
  CategoriesResponse,
  SearchProductsResponse,
  SearchProductsRequest,
} from "../../types/api.types";

// import { server } from "../store";
export const productAPI = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
  }),
  endpoints: (builder) => ({
    latestProducts: builder.query<AllProductsResponse, string>({
      query: () => "latest",
    }),
    allProducts: builder.query<AllProductsResponse, string>({
      query: (_id) => `admin/products?_id=${_id}`,
    }),
    categories: builder.query<CategoriesResponse, string>({
      query: () => `categories`,
    }),
    searchProducts: builder.query<
      SearchProductsResponse,
      SearchProductsRequest
    >({
      query: ({ search, category, price, sort, page }) => {
        let base = `qu?page=${page}`;


        if(search){
          base += `&search=${search}`
        }
        if (price) {
          base += `&price=${price}`;
        }
        if (sort) {
          base += `&sort=${sort}`;
        }

        if (category) {
          base += `&category=${category}`;
        }

        return base;
      },
    }),
    productDetails: builder.query<ProductResponse, string>({
      query: (id) => id,
      // providesTags: ["product"],
    }),

    newProduct: builder.mutation<MessageResponse, NewProductRequest>({
      query: ({ formData, id }) => ({
        url: `new?_id=${id}`,
        method: "POST",
        body: formData,
      }),
      //invalidatesTags: ["product"],
    }),

    updateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({
      query: ({ formData, userId, productId }) => ({
        url: `${productId}?_id=${userId}`,
        method: "PUT",
        body: formData,
      }),
      // invalidatesTags: ["product"],
    }),

    deleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({
      query: ({ userId, productId }) => ({
        url: `${productId}?_id=${userId}`,
        method: "POST",
      }),
      // invalidatesTags: ["product"],
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

export const {
  useLatestProductsQuery,
  useAllProductsQuery,
  useCategoriesQuery,  useSearchProductsQuery,useNewProductMutation,useProductDetailsQuery , useUpdateProductMutation,useDeleteProductMutation
} = productAPI;
