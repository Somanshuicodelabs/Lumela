import { createImageVariantConfig, types as sdkTypes } from '../../util/sdkLoader';
import { storableError } from '../../util/errors';
import { compareAndSetStock, updateStockOfListingMaybe } from '../EditListingPage/EditListingPage.duck';
import { currentUserShowSuccess, fetchCurrentUser, fetchCurrentUserHasListings } from '../../ducks/user.duck';
import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { addOwnEntities } from '../ManageListingsPage/ManageListingsPage.duck';
import { parse } from '../../util/urlHelpers';
const { UUID } = sdkTypes;

// ================ Action types ================ //
export const CREATE_LISTING_REQUEST = 'app/ProductListingPage/UPDATE_LISTING_REQUEST';
export const CREATE_LISTING_SUCCESS = 'app/ProductListingPage/UPDATE_LISTING_SUCCESS';
export const CREATE_LISTING_ERROR = 'app/ProductListingPage/UPDATE_LISTING_ERROR';

export const UPDATE_LISTING_REQUEST = 'app/ProductListingPage/UPDATE_PROFILE_REQUEST';
export const UPDATE_LISTING_SUCCESS = 'app/ProductListingPage/UPDATE_PROFILE_SUCCESS';
export const UPDATE_LISTING_ERROR = 'app/ProductListingPage/UPDATE_PROFILE_ERROR';

export const SHOW_LISTINGS_REQUEST = 'app/ProductListingPage/SHOW_LISTINGS_REQUEST';
export const SHOW_LISTINGS_SUCCESS = 'app/ProductListingPage/SHOW_LISTINGS_SUCCESS';
export const SHOW_LISTINGS_ERROR = 'app/ProductListingPage/SHOW_LISTINGS_ERROR';

export const SHOW_BUSINESS_LISTINGS_REQUEST = 'app/ProductListingPage/SHOW_BUSINESS_LISTINGS_REQUEST';
export const SHOW_BUSINESS_LISTINGS_SUCCESS = 'app/ProductListingPage/SHOW_BUISNESS_LISTINGS_SUCCESS';
export const SHOW_BUSINESS_LISTINGS_ERROR = 'app/ProductListingPage/SHOW_BUSINESS_LISTINGS_ERROR';

export const PUBLISH_LISTING_REQUEST = 'app/ProductListingPage/PUBLISH_LISTING_REQUEST';
export const PUBLISH_LISTING_SUCCESS = 'app/ProductListingPage/PUBLISH_LISTING_SUCCESS';
export const PUBLISH_LISTING_ERROR = 'app/ProductListingPage/PUBLISH_LISTING_ERROR';


export const CLEAR_UPDATED_FORM = 'app/ProductListingPage/CLEAR_UPDATED_FORM';


const resultIds = data => data.data.map(l => l.id);

const updateUploadedImagesState = (state, payload) => {
  const { uploadedImages, uploadedImagesOrder } = state;
  

  // Images attached to listing entity
  const attachedImages = payload?.data?.relationships?.images?.data || [];
  const attachedImageUUIDStrings = attachedImages.map(img => img.id.uuid);

  // Uploaded images (which are propably not yet attached to listing)
  const unattachedImages = Object.values(state?.uploadedImages);
  const duplicateImageEntities = unattachedImages.filter(unattachedImg =>
    attachedImageUUIDStrings.includes(unattachedImg?.imageId?.uuid)
  );
  return duplicateImageEntities.length > 0
    ? {
        uploadedImages: {},
        uploadedImagesOrder: [],
      }
    : {
        uploadedImages,
        uploadedImagesOrder,
      };
};

// ================ Reducer ================ //

const initialState = {
  // Error instance placeholders for each endpoint
  createListingError: null,
  createListingInProgress: null,
  updateInProgress: false,
  updateProfileError: null,
  currentPageResultIds:[],
  currentBusinessLising:{},
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
    case SHOW_BUSINESS_LISTINGS_REQUEST:
      return {
        ...state,
        searchInProgress: true,
        searchMapListingIds: [],
        searchListingsError: null,
      };
    case SHOW_BUSINESS_LISTINGS_SUCCESS:
      return {
        ...state,
        currentBusinessLising: payload,
      };
    case SHOW_BUSINESS_LISTINGS_ERROR:
      // eslint-disable-next-line no-console
      console.error(payload);
      return { ...state, searchInProgress: false, searchListingsError: payload };


    case UPDATE_LISTING_REQUEST:
      return {
        ...state,
        updateInProgress: true,
        updateListingError: null,
      };
    case UPDATE_LISTING_SUCCESS:
      return {
        ...state,
        ...updateUploadedImagesState(state, payload),
        createListingInProgress: false,
      };
    case UPDATE_LISTING_ERROR:
      return {
        ...state, createListingInProgress: false, createListingError: payload 
      };

      case PUBLISH_LISTING_REQUEST:
        return {
          ...state,
          updateInProgress: true,
          updateListingError: null,
        };
      case PUBLISH_LISTING_SUCCESS:
        return {
          ...state,
          createListingDraftInProgress: false,
        };
      case PUBLISH_LISTING_ERROR: {
        return {
          ...state,
            createListingInProgress: false,
            error: payload,
        };
      }

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

export const updateListingRequest = () => ({ type: UPDATE_LISTING_REQUEST })
export const updateListingSuccess = () => ({ type: UPDATE_LISTING_SUCCESS })
export const updateListingError = () => ({ type: UPDATE_LISTING_ERROR })

export const publishListingRequest =  () => ({type: PUBLISH_LISTING_REQUEST});
export const publishListingSuccess =  () => ({type: PUBLISH_LISTING_SUCCESS});
export const publishListingError =  () => ({type: PUBLISH_LISTING_ERROR});


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
export const showBusinessListingsRequest = searchParams => ({
  type: SHOW_BUSINESS_LISTINGS_REQUEST,
  payload: { searchParams },
});

export const showBusinessListingsSuccess = response => (
  {
  type: SHOW_BUSINESS_LISTINGS_SUCCESS,
  payload: response,
});

export const showBusinessListingsError = e => ({
  type: SHOW_BUSINESS_LISTINGS_ERROR,
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

export function requestUpdateListing(data, config, stockUpdateMaybe) {

  return (dispatch, getState, sdk) => {
    dispatch(updateListingRequest(data));
    const { stockUpdate, images,listingSearchId, ...rest } = data;

    // If images should be saved, create array out of the image UUIDs for the API call
    // Note: in this template, image upload is not happening at the same time as listing creation.
    // const imageProperty = typeof images !== 'undefined' ? { images: imageIds(images) } : {};
    const ownListingValues = { ...rest, id:listingSearchId.id, images: images.map(itm => itm.imageId) };
    const imageVariantInfo = getImageVariantInfo(config?.layout?.listingImage);
    // console.log('queryParams :>> ', queryParams);

    let createListingResponse = null;
    return sdk.ownListings.update(ownListingValues, {
      expand: true,
        include: ["images"]
      }  )
      .then(response => {
        createListingResponse = response;
        const listingId = response.data.data.id;
        dispatch(updateStockOfListingMaybe(listingId, stockUpdate, dispatch))
      })
      .then(() => {
        // Modify store to understand that we have created listing and can redirect away
        dispatch(showBusinessListingsSuccess(createListingResponse));
        return createListingResponse;
      })
      .catch(e => {
        console.log('error at requestCreateListing :>> ', e);
        return dispatch(updateListingError(storableError(e)));
      });

  }
}

// export function requestPublishListingDraft  (data, config) {
//   console.log('data :>> ', data);
//   return (dispatch, getState, sdk) => {
//   dispatch(publishListingRequest(data));
//   const { listingSearchId, ...rest } = data;
//   const ownListingValues = { ...rest, id:listingSearchId.id};

//   return sdk.ownListings
//     .publishDraft(ownListingValues, { expand: true })
//     .then(response => {
//       console.log('response :>> ', response);
//       // Add the created listing to the marketplace data
//       dispatch(addMarketplaceEntities(response));
//       dispatch(publishListingSuccess(response));
//       return response;
//     })
//     .catch(e => {
//       dispatch(publishListingError(storableError(e)));
//     });
//   }
// };

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


export const fetchBusinessListing = (businessUserId) => async (dispatch, getState, sdk) => {
  try {
    dispatch(showBusinessListingsRequest());
    const params = {
      id: new UUID (businessUserId),
      include: ["images","author"],
      'fields.image': ['variants.square-small', 'variants.square-small2x']
    };
    const response = await sdk.ownListings.show(params, { expand: true });
    dispatch(showBusinessListingsSuccess(response.data.data));
    return response;
  } catch (error) {
    console.log(error)
  }
}

export const loadData = (params, search) => async (dispatch, getState, sdk) => {
  try {
    const searchParams = parse(search);
    await dispatch(fetchBusinessListing(getState().user.currentUser?.attributes?.profile?.publicData?.userListingId))

    const fetchUser = await dispatch(fetchCurrentUser())
    const result = await dispatch(fetchCurrentUserHasListings());

    const currentUser = getState().user.currentUser;
    dispatch(showListingsRequest());
  } catch (error) {
    console.log(error, '&&&  &&& => error');
  }
};