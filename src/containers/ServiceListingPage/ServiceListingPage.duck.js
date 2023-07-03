import { denormalisedResponseEntities } from '../../util/data';
import { storableError } from '../../util/errors';
import { currentUserShowSuccess, fetchCurrentUser, fetchCurrentUserHasListings } from '../../ducks/user.duck';
import { createImageVariantConfig } from '../../util/sdkLoader';
import { types as sdkTypes } from '../../util/sdkLoader';
import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { addOwnEntities } from '../ManageListingsPage/ManageListingsPage.duck';
// ================ Action types ================ //

export const CLEAR_UPDATED_FORM = 'app/ServiceListingPage/CLEAR_UPDATED_FORM';

export const UPLOAD_IMAGE_REQUEST = 'app/ServiceListingPage/UPLOAD_IMAGE_REQUEST';
export const UPLOAD_IMAGE_SUCCESS = 'app/ServiceListingPage/UPLOAD_IMAGE_SUCCESS';
export const UPLOAD_IMAGE_ERROR = 'app/ServiceListingPage/UPLOAD_IMAGE_ERROR';

export const UPDATE_PROFILE_REQUEST = 'app/ServiceListingPage/UPDATE_PROFILE_REQUEST';
export const UPDATE_PROFILE_SUCCESS = 'app/ServiceListingPage/UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_ERROR = 'app/ServiceListingPage/UPDATE_PROFILE_ERROR';

export const EXPERT_LISTINGS_REQUEST = 'app/ServiceListingPage/EXPERT_LISTINGS_REQUEST';
export const EXPERT_LISTINGS_SUCCESS = 'app/ServiceListingPage/EXPERT_LISTINGS_SUCCESS';
export const EXPERT_LISTINGS_ERROR = 'app/ServiceListingPage/EXPERT_LISTINGS_ERROR';

export const EXPERT_CREATE_LISTINGS_REQUEST =
  'app/ServiceListingPage/EXPERT_CREATE_LISTINGS_REQUEST';
export const EXPERT_CREATE_LISTINGS_SUCCESS =
  'app/ServiceListingPage/EXPERT_CREATE_LISTINGS_SUCCESS';
export const EXPERT_CREATE_LISTINGS_ERROR = 'app/ServiceListingPage/EXPERT_CREATE_LISTINGS_ERROR';

const { UUID } = sdkTypes;

// ================ Reducer ================ //
const imageIds = images => {
  // For newly uploaded image the UUID can be found from "img.imageId"
  // and for existing listing images the id is "img.id"
  return images ? images.map(img => img.imageId || img.id) : null;
};

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

const initialState = {
  image: null,
  uploadImageError: null,
  uploadInProgress: false,
  updateInProgress: false,
  updateProfileError: null,
  searchInProgress: false,
  currentPageResultIds: [],
  searchListingsError: null,
  createListingInProgress: false,
  availabilityInProgress: false,
  createListingError: null,
};
const resultIds = data => data.data.map(l => l.id);

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case EXPERT_CREATE_LISTINGS_REQUEST:
      return {
        ...state,
        createListingInProgress: true,
        availabilityInProgress: true,
        createListingError: null,
      };
    case EXPERT_CREATE_LISTINGS_SUCCESS:
      return {
        ...state,
        createListingInProgress: false,
        availabilityInProgress: false,
        createListingError: null,
      };
    case EXPERT_CREATE_LISTINGS_ERROR:
      return {
        ...state,
        createListingInProgress: false,
        availabilityInProgress: false,
        createListingError: payload,
      };
    case EXPERT_LISTINGS_REQUEST:
      return {
        ...state,
        searchInProgress: true,
        searchMapListingIds: [],
        searchListingsError: null,
      };
    case EXPERT_LISTINGS_SUCCESS:
      return {
        ...state,
        currentPageResultIds: resultIds(payload.data),
        pagination: payload.data.meta,
        searchInProgress: false,
      };
    case EXPERT_LISTINGS_ERROR:
      // eslint-disable-next-line no-console
      console.error(payload);
      return { ...state, searchInProgress: false, searchListingsError: payload };
    case UPLOAD_IMAGE_REQUEST:
      // payload.params: { id: 'tempId', file }
      return {
        ...state,
        image: { ...payload.params },
        uploadInProgress: true,
        uploadImageError: null,
      };
    case UPLOAD_IMAGE_SUCCESS: {
      // payload: { id: 'tempId', uploadedImage }
      const { id, uploadedImage } = payload;
      const { file } = state.image || {};
      const image = { id, imageId: uploadedImage.id, file, uploadedImage };
      return { ...state, image, uploadInProgress: false };
    }
    case UPLOAD_IMAGE_ERROR: {
      // eslint-disable-next-line no-console
      return { ...state, image: null, uploadInProgress: false, uploadImageError: payload.error };
    }

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

export const clearUpdatedForm = () => ({
  type: CLEAR_UPDATED_FORM,
});

// SDK method: images.upload
export const uploadImageRequest = params => ({ type: UPLOAD_IMAGE_REQUEST, payload: { params } });
export const uploadImageSuccess = result => ({ type: UPLOAD_IMAGE_SUCCESS, payload: result.data });
export const uploadImageError = error => ({
  type: UPLOAD_IMAGE_ERROR,
  payload: error,
  error: true,
});

// SDK method: sdk.currentUser.updateProfile
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

export const expertListingsRequest = searchParams => ({
  type: EXPERT_LISTINGS_REQUEST,
  payload: { searchParams },
});

export const expertListingsSuccess = response => ({
  type: EXPERT_LISTINGS_SUCCESS,
  payload: { data: response.data },
});

export const expertListingsError = e => ({
  type: EXPERT_LISTINGS_ERROR,
  error: true,
  payload: e,
});

export const expertCreateListingRequest = () => ({
  type: EXPERT_CREATE_LISTINGS_REQUEST,
});
export const expertCreateListingSuccess = () => ({
  type: EXPERT_CREATE_LISTINGS_SUCCESS,
});

export const expertCreateListingError = e => ({
  type: EXPERT_CREATE_LISTINGS_ERROR,
  error: true,
  payload: e,
});

// ================ Thunk ================ //

// Images return imageId which we need to map with previously generated temporary id
export function uploadImage(actionPayload) {
  return (dispatch, getState, sdk) => {
    const id = actionPayload.id;
    dispatch(uploadImageRequest(actionPayload));

    const bodyParams = {
      image: actionPayload.file,
    };
    const queryParams = {
      expand: true,
      'fields.image': ['variants.square-small', 'variants.square-small2x'],
    };

    return sdk.images
      .upload(bodyParams, queryParams)
      .then(resp => {
        const uploadedImage = resp.data.data;
        dispatch(uploadImageSuccess({ data: { id, uploadedImage } }));
      })
      .catch(e => dispatch(uploadImageError({ id, error: storableError(e) })));
  };
}

export const fetchCurrentListing = listingId => async (dispatch, getState, sdk) => {
  try {
    dispatch(expertListingsRequest());
    const response = await sdk.ownListings.query({ id: listingId });
    dispatch(addMarketplaceEntities(response));
    dispatch(expertListingsSuccess(response));
    return response;
  } catch (error) {
    console.log(error)
  }
}

export const createExpertListing = (actionPayload, config,listingId) => async (
  dispatch,
  getState,
  sdk
) => {
  try {
    dispatch(expertCreateListingRequest());
    const { images,...rest } = actionPayload;
    console.log(actionPayload, '&&&  &&& => actionPayload');
    
    const imageProperty = typeof images !== 'undefined' ? { images: imageIds(images) } : {};

    const ownListingValues = { ...imageProperty,...rest };
    const ownListingUpdateValues = { id: listingId, ...rest };
    const imageVariantInfo = getImageVariantInfo(config.layout.listingImage);

    const queryParams = {
      expand: true,
      include: ['author', 'images', 'currentStock'],
      'fields.image': imageVariantInfo.fieldsImage,
      ...imageVariantInfo.imageVariants,
    };
    if (listingId) {
    const result =   await sdk.ownListings.update(ownListingUpdateValues, queryParams);
    console.log(result, '&&&  &&& => result');
    
    }
    const response =
    //  listingId
    //   ? await sdk.ownListings.update(ownListingUpdateValues, queryParams)
      // : 
      await sdk.ownListings.create(ownListingValues, queryParams);
      console.log(response, '&&&  &&& => response');
      
    dispatch(expertCreateListingSuccess());
    dispatch(fetchCurrentListing(response.data.data.id))
    return response;
  } catch (error) {
    dispatch(expertCreateListingError(error));
    console.log(error, '&&&  &&& => error');
  }
};

export const updateProfile = actionPayload => {
  return (dispatch, getState, sdk) => {
    dispatch(updateProfileRequest());

    const queryParams = {
      expand: true,
      include: ['profileImage'],
      'fields.image': ['variants.square-small', 'variants.square-small2x'],
    };

    return sdk.currentUser
      .updateProfile(actionPayload, queryParams)
      .then(response => {
        dispatch(updateProfileSuccess(response));

        const entities = denormalisedResponseEntities(response);
        if (entities.length !== 1) {
          throw new Error('Expected a resource in the sdk.currentUser.updateProfile response');
        }
        const currentUser = entities[0];

        // Update current user in state.user.currentUser through user.duck.js
        dispatch(currentUserShowSuccess(currentUser));
        return response;
      })
      .catch(e => dispatch(updateProfileError(storableError(e))));
  };
};

export const loadData = () => async (dispatch, getState, sdk) => {
  try {
    const fetchUser = await dispatch(fetchCurrentUser())
    const result = await dispatch(fetchCurrentUserHasListings());

    const currentUser = getState().user.currentUser;
    // const userRole = getUserRole(currentUser);
    dispatch(expertListingsRequest());
    // if (userRole === USER_ROLE_EXPERT && result.data.data.length > 0 && result.data.data) {
      const response = await sdk.ownListings.query();
      console.log(response, '&&&  &&& => response');
      
      const listingId = response?.data?.data?.at(0)
      // if (listingId) {
      //   dispatch(fetchStripeAccount());
      // }
      dispatch(addOwnEntities(response));
      dispatch(expertListingsSuccess(response));
    // }
  } catch (error) {
    console.log(error, '&&&  &&& => error');
  }
};
