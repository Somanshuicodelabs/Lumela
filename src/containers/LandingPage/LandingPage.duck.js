import { fetchPageAssets } from '../../ducks/hostedAssets.duck';
import {onGetBlogsData} from '../../util/api'
export const ASSET_NAME = 'landing-page';

// export const loadData = (params, search) => dispatch => {
//   const pageAsset = { landingPage: `content/pages/${ASSET_NAME}.json` };
//   return dispatch(fetchPageAssets(pageAsset, true));
// };


import { storableError } from '../../util/errors';
import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { parse } from '../../util/urlHelpers';
import search from '../../config/configMaps';

// ================ Action types ================ //

export const SEARCH_LISTINGS_REQUEST = 'app/LandingPage/SEARCH_LISTINGS_REQUEST';
export const SEARCH_LISTINGS_SUCCESS = 'app/LandingPage/SEARCH_LISTINGS_SUCCESS';
export const SEARCH_LISTINGS_ERROR = 'app/LandingPage/SEARCH_LISTINGS_ERROR';

export const SEARCH_MAP_SET_ACTIVE_LISTING =
  'app/LandingPage/SEARCH_MAP_SET_ACTIVE_LISTING';

export const LANDING_PAGE_DATA_REQUEST = 'LANDING_PAGE_DATA_REQUEST';
export const LANDING_PAGE_DATA_SUCCESS = 'LANDING_PAGE_DATA_SUCCESS';
export const LANDING_PAGE_DATA_ERROR = 'LANDING_PAGE_DATA_ERROR';

// ================ Reducer ================ //
const RESULT_PAGE_SIZE = 15;

const initialState = {
  pagination: null,
  searchParams: null,
  searchInProgress: false,
  searchListingsError: null,
  currentPageResultIds: [],
  searchMapListingIds: [],
  searchMapListingsError: null,
  landing_page_data_request: false,
  landing_page_data_success: false,
  landing_page_data: null,
  landing_page_data_error: null,
};

const resultIds = data => data.data.map(l => l.id);

const landingPageReducer = (state = initialState, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case LANDING_PAGE_DATA_REQUEST:
      return {
        ...state,
        landing_page_data_request: true,
        landing_page_data_success: false,
        landing_page_data_error: null,
      };
    case LANDING_PAGE_DATA_SUCCESS:
      return {
        ...state,
        landing_page_data_request: false,
        landing_page_data_success: true,
        landing_page_data_error: null,
        landing_page_data: payload,
      };
    case LANDING_PAGE_DATA_ERROR:
      return {
        ...state,
        landing_page_data_request: false,
        landing_page_data_success: false,
        landing_page_data_error: payload,
      };


    case SEARCH_LISTINGS_REQUEST:
      return {
        ...state,
        searchParams: payload.searchParams,
        searchInProgress: true,
        searchMapListingIds: [],
        searchListingsError: null,
      };

    case SEARCH_LISTINGS_SUCCESS:
      return {
        ...state,
        currentPageResultIds: resultIds(payload.data),
        pagination: payload.data.meta,
        searchInProgress: false,
      };

    case SEARCH_LISTINGS_ERROR:
      return {
        ...state,
        searchInProgress: false,
        searchListingsError: payload,
      };

    case SEARCH_MAP_SET_ACTIVE_LISTING:
      return {
        ...state,
        activeListingId: payload,
      };

    default:
      return state;
  }
};

export default landingPageReducer;

// ================ Action creators ================ //

export const searchListingsRequest = searchParams => ({
  type: SEARCH_LISTINGS_REQUEST,
  payload: { searchParams },
});

export const searchListingsSuccess = response => ({
  type: SEARCH_LISTINGS_SUCCESS,
  payload: { data: response.data },
});

export const searchListingsError = e => ({
  type: SEARCH_LISTINGS_ERROR,
  error: true,
  payload: e,
});

export const landingPageDataRequest = () => ({
  type: LANDING_PAGE_DATA_REQUEST,
});
export const landingPageDataSuccess = payload => ({
  type: LANDING_PAGE_DATA_SUCCESS,
  payload: payload,
});

export const landingPageDataError = error => ({
  type: LANDING_PAGE_DATA_ERROR,
  payload: error,
});

export const searchListings = searchParams => (dispatch, getState, sdk) => {
  dispatch(searchListingsRequest(searchParams));
  
  const { perPage, price, dates, ...rest } = searchParams;
  
  const params = {
    ...rest,
    
    per_page: perPage,
  };
  
  return sdk.listings
    .query(params)
    .then(response => {
      dispatch(addMarketplaceEntities(response));
      dispatch(searchListingsSuccess(response));
      return response;
    })
    .catch(e => {
      dispatch(searchListingsError(storableError(e)));
      throw e;
    });
};


export const setActiveListing = listingId => ({
  type: SEARCH_MAP_SET_ACTIVE_LISTING,
  payload: listingId,
});
export const loadData = (params,search) =>(dispatch) => {
  const queryParams = parse(search, {
    latlng:  ['origin'],
    latlngBounds: ['bounds'],
  });
  const pageAsset = { landingPage: `content/pages/${ASSET_NAME}.json` };
  const { page = 1, address,origin, ...rest } = queryParams;
  const originMaybe = search.sortSearchByDistance && origin ? { origin } : {};
  return Promise.all([
    dispatch(fetchPageAssets(pageAsset, true)),
    dispatch(searchListings({
      ...rest,
      ...originMaybe,
      page,
      perPage: RESULT_PAGE_SIZE,
      include: ['author', 'images','author.profileImage'],
      'fields.listing': ['title', 'geolocation', 'price','publicData'],
      'fields.user': ['profile.displayName', 'profile.abbreviatedName'],
      'fields.image': ['variants.landscape-crop', 'variants.landscape-crop2x', 'variants.square-small',
      'variants.square-small2x'],
      'limit.images': 1,
      pub_featured: true,
    }))
  ])
};

export const strapiBlogs = (params) => (dispatch, getState, sdk) => {
  const paramsValue = params || "MENS";
  return onGetBlogsData({query:`populate[thumbnailImage][populate]&pagination[start]=0&pagination[limit]=3&filters[categories][title][$eq]=${paramsValue}`})
  .then(response => {
    if (response && Object.values(response).length) {
      dispatch(landingPageDataSuccess(response.data))
      return Promise.resolve('Success');
    }
  })
  .catch((error) => {
    dispatch(landingPageDataError(error))
    return error;
  })
};