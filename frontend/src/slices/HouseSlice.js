import { ApiSlice } from "./ApiSlice";
import { ADMIN_HOUSES, CITY_URL, CREATE_NEW_HOUSE, CREATE_REVIEW, DELETE_HOUSE_ADMIN, DELETE_HOUSE_USER, DELETE_REVIEW, GET_NEWLY_RIGESTER_PROPERTY, HOUSE_URL, LISTED_HOUSES, SINGLE_HOUSE_URL, UPDATE_EXISTING_HOUSE, UPDATE_USER_EXISTING_HOUSE } from "../constants";

export const houseSlice = ApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllHouses: builder.query({
      query: ({ keyword, price_gte, price_lte, page, category, bhk, postedBy, constructionStatus }) => {
        const formattedParams = {
          keyword,
          page,
          ...({ 'price[gte]': price_lte, 'price[lte]': price_gte }),
          ...(category.length > 0 && { category: JSON.stringify(category) }),
          ...(bhk.length > 0 && { bhk: JSON.stringify(bhk) }),
          ...(postedBy.length > 0 && { postedBy: JSON.stringify(postedBy) }),
          ...(constructionStatus.length > 0 && { constructionStatus: JSON.stringify(constructionStatus) })
        };
        
        const queryString = Object.entries(formattedParams)
          ?.filter(([key, value]) => value !== undefined && value !== null && value !== '')
          ?.map(([key, value]) => `${key}=${value}`)
          ?.join("&");
    
        const finalUrl = queryString ? `${HOUSE_URL}?${queryString}` : HOUSE_URL;
        // console.log(finalUrl);
        return finalUrl;
      },
    }),
    getAllCities: builder.query({
        query: () => CITY_URL,
    }),
    getSingleHouseDetail: builder.query({
        query: ({ houseId }) => `${SINGLE_HOUSE_URL}/${houseId}`
    }),
    createHouse: builder.mutation({
      query:(formData) => ({
          method:'POST',
          url: CREATE_NEW_HOUSE,
          body: {...formData}
      }),
    }),
    updateHouse: builder.mutation({
      query: ({formData, id}) => ({
          method: 'PUT',
          url: `${UPDATE_EXISTING_HOUSE}/${id}`,
          body: { ...formData }
      }),
    }),
    updateUserHouse: builder.mutation({
      query: ({formData, id}) => ({
          method: 'PUT',
          url: `${UPDATE_USER_EXISTING_HOUSE}/${id}`,
          body: { ...formData }
      }),
    }),    
    getHouseListingForUser: builder.query({
        query: ({userId}) => `${LISTED_HOUSES}/${userId}`
    }),
    getAllHousesDataAdmin: builder.query({
        query: () => ADMIN_HOUSES
    }),
    deleteSingleHouseUser: builder.mutation({
      query: (houseId) => ({
          method:'DELETE',
          url: `${DELETE_HOUSE_USER}/${houseId}`
      }),
    }),
    deleteSingleHouseAdmin: builder.mutation({
      query: (houseId) => ({
          method:'DELETE',
          url: `${DELETE_HOUSE_ADMIN}/${houseId}`
      }),
    }),
    getNewly6Properties: builder.query({
      query: () => `${GET_NEWLY_RIGESTER_PROPERTY}`
    }),
    creatingReview: builder.mutation({
      query: (data) => ({
        url: `${CREATE_REVIEW}/${data.id}`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteReview: builder.mutation({
      query: (data) => ({
        url: DELETE_REVIEW,
        method: 'DELETE',
        body: data,
      }),
    }),
  }),
  providesTags: ['Houses'],
});

export const { useGetAllHousesQuery, useGetAllCitiesQuery, useGetSingleHouseDetailQuery, useCreateHouseMutation, useGetHouseListingForUserQuery, useGetAllHousesDataAdminQuery, useDeleteSingleHouseUserMutation, useDeleteSingleHouseAdminMutation, useGetNewly6PropertiesQuery, useUpdateHouseMutation, useUpdateUserHouseMutation, useCreatingReviewMutation, useDeleteReviewMutation } = houseSlice;