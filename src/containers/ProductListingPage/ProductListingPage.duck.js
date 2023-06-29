import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { fetchCurrentUser } from '../../ducks/user.duck';
import { createImageVariantConfig, types as sdkTypes } from '../../util/sdkLoader';
import { denormalisedResponseEntities } from '../../util/data';
import { storableError } from '../../util/errors';
const { UUID } = sdkTypes;

// ================ Action types ================ //
export const CREATE_LISTING_REQUEST = 'app/EditListingPage/UPDATE_LISTING_REQUEST';
export const CREATE_LISTING_SUCCESS = 'app/EditListingPage/UPDATE_LISTING_SUCCESS';
export const CREATE_LISTING_ERROR = 'app/EditListingPage/UPDATE_LISTING_ERROR';

// ================ Reducer ================ //

const initialState = {
    // Error instance placeholders for each endpoint
    createListingError: null,
    createListingInProgress: null,
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


export function requestCreateListing(data, config) {
    return (dispatch, getState, sdk) => {
        dispatch(createListingRequest(data));
        const { stockUpdate, images, ...rest } = data;

        // If images should be saved, create array out of the image UUIDs for the API call
        // Note: in this template, image upload is not happening at the same time as listing creation.
        // const imageProperty = typeof images !== 'undefined' ? { images: imageIds(images) } : {};
        const ownListingValues = { ...rest };

        const imageVariantInfo = getImageVariantInfo(config?.layout?.listingImage);
        const queryParams = {
            expand: true,
            include: ['author', 'images', 'currentStock'],
            'fields.image': imageVariantInfo.fieldsImage,
            ...imageVariantInfo.imageVariants,
        };

        let createListingResponse = null;
        return sdk.ownListings
            .create(ownListingValues)
            .then(response => {
                console.log('response :>> ', response);
                createListingResponse = response;

                const listingId = response.data.data.id;
                // If stockUpdate info is passed through, update stock
                return updateStockOfListingMaybe(listingId, stockUpdate, dispatch);
            })
            .then(() => {
                // Modify store to understand that we have created listing and can redirect away
                dispatch(createListingSuccess(createListingResponse));
                return createListingResponse;
            })
            .catch(e => {
                console.log('error :>> ', e);
                return dispatch(createListingError(storableError(e)));
            });

    }
}