import { createImageVariantConfig, types as sdkTypes } from '../../util/sdkLoader';
import { storableError } from '../../util/errors';
import { compareAndSetStock, updateStockOfListingMaybe } from '../EditListingPage/EditListingPage.duck';
import { currentUserShowSuccess, fetchCurrentUser, fetchCurrentUserHasListings } from '../../ducks/user.duck';
import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { addOwnEntities } from '../ManageListingsPage/ManageListingsPage.duck';
import { parse } from '../../util/urlHelpers';
const { UUID } = sdkTypes;

// ================ Action types ================ //
export const CREATE_LISTING_REQUEST = 'app/EditListingPage/UPDATE_LISTING_REQUEST';
export const CREATE_LISTING_SUCCESS = 'app/EditListingPage/UPDATE_LISTING_SUCCESS';
export const CREATE_LISTING_ERROR = 'app/EditListingPage/UPDATE_LISTING_ERROR';

export const UPDATE_PROFILE_REQUEST = 'app/EditListingPage/UPDATE_PROFILE_REQUEST';
export const UPDATE_PROFILE_SUCCESS = 'app/EditListingPage/UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_ERROR = 'app/EditListingPage/UPDATE_PROFILE_ERROR';

export const SHOW_LISTINGS_REQUEST = 'app/EditListingPage/SHOW_LISTINGS_REQUEST';
export const SHOW_LISTINGS_SUCCESS = 'app/EditListingPage/SHOW_LISTINGS_SUCCESS';
export const SHOW_LISTINGS_ERROR = 'app/EditListingPage/SHOW_LISTINGS_ERROR';



export const CLEAR_UPDATED_FORM = 'app/EditListingPage/CLEAR_UPDATED_FORM';


const resultIds = data => data.data.map(l => l.id);

// ================ Reducer ================ //

const initialState = {
  // Error instance placeholders for each endpoint
  createListingError: null,
  createListingInProgress: null,
  updateInProgress: false,
  updateProfileError: null,
  currentPageResultIds:[],
  pagination: null,

}

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case CREATE_LISTING_REQUEST:
      return { ...state, createListingInProgress: true, createListingError: null };
    case CREATE_LISTING_SUCCESS:
      return {
        ...state,
        ...updateUploadedImagesState(state, payload),
        createListingInProgress: false,
      };
    case CREATE_LISTING_ERROR:
      return { ...state, createListingInProgress: false, createListingError: payload };


    case SHOW_LISTINGS_REQUEST:
      return {
        ...state,
        searchInProgress: true,
        searchMapListingIds: [],
        searchListingsError: null,
      };
    case SHOW_LISTINGS_SUCCESS:
      return {
        ...state,
        currentPageResultIds: resultIds(payload.data),
        pagination: payload.data.meta,
        searchInProgress: false,
      };
    case SHOW_LISTINGS_ERROR:
      // eslint-disable-next-line no-console
      console.error(payload);
      return { ...state, searchInProgress: false, searchListingsError: payload };


    case UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        updateInProgress: true,
        updateProfileError: null,
      };
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        image: null,
        updateInProgress: false,
      };
    case UPDATE_PROFILE_ERROR:
      return {
        ...state,
        image: null,
        updateInProgress: false,
        updateProfileError: payload,
      };

    case CLEAR_UPDATED_FORM:
      return { ...state, updateProfileError: null, uploadImageError: null };
    default:
      return state;
  }
}




// ================ Selectors ================ //

// ================ Action creators ================ //

// SDK method: ownListings.create
export const createListingRequest = () => ({ type: CREATE_LISTING_REQUEST })
export const createListingSuccess = () => ({ type: CREATE_LISTING_SUCCESS })
export const createListingError = () => ({ type: CREATE_LISTING_ERROR })

export const updateProfileRequest = params => ({
  type: UPDATE_PROFILE_REQUEST,
  payload: { params },
});
export const updateProfileSuccess = result => ({
  type: UPDATE_PROFILE_SUCCESS,
  payload: result.data,
});
export const updateProfileError = error => ({
  type: UPDATE_PROFILE_ERROR,
  payload: error,
  error: true,
});

export const clearUpdatedForm = () => ({
  type: CLEAR_UPDATED_FORM,
});


export const showListingsRequest = searchParams => ({
  type: SHOW_LISTINGS_REQUEST,
  payload: { searchParams },
});

export const showListingsSuccess = response => ({
  type: SHOW_LISTINGS_SUCCESS,
  payload: { data: response.data },
});

export const showListingsError = e => ({
  type: SHOW_LISTINGS_ERROR,
  error: true,
  payload: e,
});

////////////////////////////////THUNK////////////////////////////////////////////////////////////////
// const imageIds = images => {
//     // For newly uploaded image the UUID can be found from "img.imageId"
//     // and for existing listing images the id is "img.id"
//     return images ? images.map(img => img.imageId || img.id) : null;
// };

const getImageVariantInfo = listingImageConfig => {
  const { aspectWidth = 1, aspectHeight = 1, variantPrefix = 'listing-card' } = listingImageConfig;
  const aspectRatio = aspectHeight / aspectWidth;
  const fieldsImage = [`variants.${variantPrefix}`, `variants.${variantPrefix}-2x`];

  return {
    fieldsImage,
    imageVariants: {
      ...createImageVariantConfig(`${variantPrefix}`, 400, aspectRatio),
      ...createImageVariantConfig(`${variantPrefix}-2x`, 800, aspectRatio),
    },
  };
};


export function requestCreateListing(data, config, stockUpdateMaybe) {

  return (dispatch, getState, sdk) => {
    dispatch(createListingRequest(data));
    const { stockUpdate, images, ...rest } = data;

    // If images should be saved, create array out of the image UUIDs for the API call
    // Note: in this template, image upload is not happening at the same time as listing creation.
    // const imageProperty = typeof images !== 'undefined' ? { images: imageIds(images) } : {};
    const ownListingValues = { ...rest, images: images.map(itm => itm.imageId) };
    console.log('ownListingValues :>> ', ownListingValues);

    const imageVariantInfo = getImageVariantInfo(config?.layout?.listingImage);
    const queryParams = {
      expand: true,
      include: ['author', 'images', 'currentStock'],
      'fields.image': imageVariantInfo.fieldsImage,
      ...imageVariantInfo.imageVariants,
    };
    // console.log('queryParams :>> ', queryParams);

    let createListingResponse = null;
    return sdk.ownListings
      .create(ownListingValues, {
        expand: true,
        include: ["images"]
      }  )
      .then(response => {
        console.log('response :>> ', response);
        createListingResponse = response;
        const listingId = response.data.data.id;
        dispatch(updateStockOfListingMaybe(listingId, stockUpdate, dispatch))
      })
      .then(() => {
        // Modify store to understand that we have created listing and can redirect away
        dispatch(createListingSuccess(createListingResponse));
        return createListingResponse;
      })
      .catch(e => {
        console.log('error at requestCreateListing :>> ', e);
        return dispatch(createListingError(storableError(e)));
      });

  }
}

export const fetchCurrentListing = listingId => async (dispatch, getState, sdk) => {
  try {
    dispatch(showListingsRequest());
    const queryParams = {
      expand: true,
      'fields.image': ['variants.square-small', 'variants.square-small2x'],
    };
    const response = await sdk.ownListings.query({
      include: ["images"],
      'fields.image': ['variants.square-small', 'variants.square-small2x']
    }, { expand: true });
    dispatch(addOwnEntities(response));
    dispatch(showListingsSuccess(response));
    return response;
  } catch (error) {
    console.log(error)
  }
}

// export const updateProfile = actionPayload => {
//     return (dispatch, getState, sdk) => {
//       dispatch(updateProfileRequest());

//       const queryParams = {
//         expand: true,
//         include: ['profileImage'],
//         'fields.image': ['variants.square-small', 'variants.square-small2x'],
//       };

//       return sdk.currentUser
//         .updateProfile(actionPayload, queryParams)
//         .then(response => {
//           dispatch(updateProfileSuccess(response));

//           const entities = denormalisedResponseEntities(response);
//           if (entities.length !== 1) {
//             throw new Error('Expected a resource in the sdk.currentUser.updateProfile response');
//           }
//           const currentUser = entities[0];

//           // Update current user in state.user.currentUser through user.duck.js
//           dispatch(currentUserShowSuccess(currentUser));
//           return response;
//         })
//         .catch(e => dispatch(updateProfileError(storableError(e))));
//     };
//   };

export const loadData = (params, search) => async (dispatch, getState, sdk) => {
  try {
   const searchParams = parse(search);
   console.log('searchPar :>> ', searchParams);
   
    
    const fetchUser = await dispatch(fetchCurrentUser())
    const result = await dispatch(fetchCurrentUserHasListings());

    const currentUser = getState().user.currentUser;
    // const userRole = getUserRole(currentUser);
    dispatch(showListingsRequest());
    // if (userRole === USER_ROLE_EXPERT && result.data.data.length > 0 && result.data.data) {
    //   const response = await sdk.ownListings.query();
    //   const listingId = response?.data?.data?.at(0)
    //   // if (listingId) {
    //   //   dispatch(fetchStripeAccount());
    //   // }
    //   dispatch(addMarketplaceEntities(response));
    //   dispatch(expertListingsSuccess(response));
    // }
  } catch (error) {
    console.log(error, '&&&  &&& => error');
  }
};