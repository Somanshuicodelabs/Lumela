import React from 'react';
import PropTypes, { arrayOf } from 'prop-types';

// Import configs and util modules
import {
  LISTING_PAGE_PARAM_TYPE_DRAFT,
  LISTING_PAGE_PARAM_TYPE_EDIT,
  LISTING_PAGE_PARAM_TYPE_NEW,
  LISTING_PAGE_PARAM_TYPES,
} from '../../../util/urlHelpers';
import { ensureListing } from '../../../util/data';
import { createResourceLocatorString } from '../../../util/routes';
import { propTypes } from '../../../util/types';

// Import modules from this directory
import EditListingDescriptionPanel from './EditListingDescriptionPanel/EditListingDescriptionPanel';
import EditListingPhotosPanel from './EditListingPhotosPanel/EditListingPhotosPanel';
import EditListingAvailabilityPanel from './EditListingAvailabilityPanel/EditListingAvailabilityPanel';
import EditListingPricingPanel from './EditListingPricingPanel/EditListingPricingPanel';
import EditListingHairTexturesPanel from './EditListingHairTexturesPanel/EditListingHairTexturesPanel';
import EditListingTeamSizePanel from './EditListingTeamSizePanel/EditListingTeamSizePanel';
import EditListingBookingSystemPanel from './EditListingBookingSystemPanel/EditListingBookingSystemPanel';
import EditListingSkinTypesPanel from './EditListingSkinTypesPanel/EditListingSkinTypesPanel';
import EditListingSkinTonesPanel from './EditListingSkinTonesPanel/EditListingSkinTonesPanel';
import EditListingOffersPanel from './EditListingOffersPanel/EditListingOffersPanel'

import css from './EditListingWizardTab.module.css';
import routeConfiguration from '../../../routing/routeConfiguration';

export const DESCRIPTION = 'description';
export const OFFERS = 'offers';
export const HAIR_TEXTURES = 'hair_texture';
export const TEAM_SIZE = 'team_size';
export const PHOTOS = 'photos';
export const AVAILABILITY = 'availability';
export const PRICING = 'pricing';
export const BOOKING_SYSTEM = "booking_system";
export const SKIN_TONES = 'skin_tones';
export const SKIN_TYPES = 'skin_types';

// EditListingWizardTab component supports these tabs
export const SUPPORTED_TABS = [
  DESCRIPTION,
  PHOTOS,
  OFFERS,
  HAIR_TEXTURES,
  SKIN_TONES,
  SKIN_TYPES,
  TEAM_SIZE,
  AVAILABILITY,
  BOOKING_SYSTEM,
  PRICING,
];

const pathParamsToNextTab = (params, tab, marketplaceTabs) => {
  const nextTabIndex = marketplaceTabs.findIndex(s => s === tab) + 1;
  const nextTab =
    nextTabIndex < marketplaceTabs.length
      ? marketplaceTabs[nextTabIndex]
      : marketplaceTabs[marketplaceTabs.length - 1];
  return { ...params, tab: nextTab };
};

const pathParamsToPrevTab = (params, tab, marketplaceTabs) => {
  const prevTabIndex = marketplaceTabs.findIndex(s => s === tab) - 1;
  const prevTab =
    prevTabIndex < marketplaceTabs.length
      ? marketplaceTabs[prevTabIndex]
      : marketplaceTabs[marketplaceTabs.length - 1];
  return { ...params, tab: prevTab };
};

// When user has update draft listing, he should be redirected to next EditListingWizardTab
const redirectAfterDraftUpdate = (listingId, params, tab, marketplaceTabs, history) => {
  const listingUUID = listingId;
  const currentPathParams = {
    ...params,
    type: LISTING_PAGE_PARAM_TYPE_DRAFT,
    id: listingUUID,
  };
  const routes = routeConfiguration();

  // Replace current "new" path to "draft" path.
  // Browser's back button should lead to editing current draft instead of creating a new one.
  if (params.type === LISTING_PAGE_PARAM_TYPE_NEW) {

    const draftURI = createResourceLocatorString('EditListingPage', routes, currentPathParams, {});

    history.replace(draftURI);
  }

  // Redirect to next tab


  const nextPathParams = pathParamsToNextTab(currentPathParams, tab, marketplaceTabs);

  const to = createResourceLocatorString('EditListingPage', routes, nextPathParams, {});

  history.push(to);
};
const redirectPrevDraftUpdate = (listingId, params, tab, marketplaceTabs, history) => {
  const currentPathParams = {
    ...params,
    type: LISTING_PAGE_PARAM_TYPE_DRAFT,
    id: listingId,
  };
  const routes = routeConfiguration();

  // Replace current "new" path to "draft" path.
  // Browser's back button should lead to editing current draft instead of creating a new one.
  if (params.type === LISTING_PAGE_PARAM_TYPE_NEW) {
    const draftURI = createResourceLocatorString('EditListingPage', routes, currentPathParams, {});
    history.replace(draftURI);
  }

  // Redirect to next tab
  const nextPathParams = pathParamsToPrevTab(currentPathParams, tab, marketplaceTabs);
  const to = createResourceLocatorString('EditListingPage', routes, nextPathParams, {});
  history?.push(to);
};

const EditListingWizardTab = props => {
  const {
    tab,
    marketplaceTabs,
    params,
    locationSearch,
    errors,
    fetchInProgress,
    newListingPublished,
    handleCreateFlowTabScrolling,
    handlePublishListing,
    history,
    images,
    listing,
    weeklyExceptionQueries,
    monthlyExceptionQueries,
    allExceptions,
    onFetchExceptions,
    onAddAvailabilityException,
    onDeleteAvailabilityException,
    onUpdateListing,
    onCreateListingDraft,
    onImageUpload,
    onManageDisableScrolling,
    onProcessChange,
    onUpdateImageOrder,
    onRemoveImage,
    updatedTab,
    updateInProgress,
    tabSubmitButtonText,
    fetchExceptionsInProgress,
    intl,
    config,
    availabilityExceptions,
  } = props;

  const { type } = params;
  const isNewURI = type === LISTING_PAGE_PARAM_TYPE_NEW;
  const isDraftURI = type === LISTING_PAGE_PARAM_TYPE_DRAFT;
  const isNewListingFlow = isNewURI || isDraftURI;
  const isEdit = type == LISTING_PAGE_PARAM_TYPE_EDIT;

  const currentListing = ensureListing(listing);


  // Redirect to next tab
  const nextPathParams = pathParamsToNextTab(params, tab, marketplaceTabs);

  const nextTabPath = createResourceLocatorString(
    'EditListingPage',
    routeConfiguration(),
    nextPathParams,
    {}
  );

  // New listing flow has automatic redirects to new tab on the wizard
  // and the last panel calls publishListing API endpoint.
  const automaticRedirectsForNewListingFlow = (tab, listingId) => {


    if (tab !== marketplaceTabs[marketplaceTabs.length - 1]) {

      // Create listing flow: smooth scrolling polyfill to scroll to correct tab
      handleCreateFlowTabScrolling(false);

      // After successful saving of draft data, user should be redirected to next tab
      redirectAfterDraftUpdate(
        listingId.uuid,
        params,
        tab,
        marketplaceTabs,
        history,
        routeConfiguration()
      );
    } else {

      handlePublishListing(listingId);
    }
  };

  const onCompleteEditListingWizardTab = (tab, updateValues) => {


    const onUpdateListingOrCreateListingDraft = isNewURI
      ? (tab, values) => onCreateListingDraft(values, config)
      : (tab, values) => onUpdateListing(tab, values, config);

    const updateListingValues = isNewURI
      ? updateValues
      : { ...updateValues, id: currentListing.id };

    return onUpdateListingOrCreateListingDraft(tab, updateListingValues)
      .then(r => {


        // In Availability tab, the submitted data (plan) is inside a modal
        // We don't redirect provider immediately after plan is set
        if (isNewListingFlow && tab !== AVAILABILITY) {
          const listingId = r.data.data.id;

          automaticRedirectsForNewListingFlow(tab, listingId);
        }
      })
      .catch(e => {
        console.log(e, '&& >>>>>>> && => e');

        // No need for extra actions
      });
  };

  const panelProps = tab => {
    return {
      className: css.panel,
      errors,
      listing,
      panelUpdated: updatedTab === tab,
      params,
      locationSearch,
      updateInProgress,
      // newListingPublished and fetchInProgress are flags for the last wizard tab
      ready: newListingPublished,
      disabled: fetchInProgress,
      submitButtonText: tabSubmitButtonText,
      listingTypes: config.listing.listingTypes,
      onManageDisableScrolling,
      onSubmit: values => {
        return onCompleteEditListingWizardTab(tab, values);
      },
    };
  };

  // TODO: add missing cases for supported tabs
  switch (tab) {
    case DESCRIPTION: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'EditListingWizard.saveNewDescription'
        : 'EditListingWizard.saveEditDescription';
      return (
        <EditListingDescriptionPanel
          {...panelProps(DESCRIPTION)}
          submitButtonText={intl?.formatMessage({ id: submitButtonTranslationKey })}
          onSubmit={values => {
            onCompleteEditListingWizardTab(tab, values)
              .then(() => {
                if (isEdit) history.push(nextTabPath);
              })
          }}
        />
      );
    }
    case OFFERS: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'EditListingWizard.saveNewFeatures'
        : 'EditListingWizard.saveEditFeatures';
      return (
        <EditListingOffersPanel
          {...panelProps(OFFERS)}
          submitButtonText={intl?.formatMessage({ id: submitButtonTranslationKey })}
          onSubmit={values => {
            onCompleteEditListingWizardTab(tab, values)
              .then((res) => {
                if (isEdit) setTimeout(() => {
                  history.push(nextTabPath);
                }, 500);
              })
          }}
          onPrevious={() => redirectPrevDraftUpdate(listing.id.uuid, params, tab, marketplaceTabs, history.goBack())}
        />
      );
    }
    case TEAM_SIZE: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'EditListingWizard.saveNewPolicies'
        : 'EditListingWizard.saveEditPolicies';
      return (
        <EditListingTeamSizePanel
          {...panelProps(TEAM_SIZE)}
          submitButtonText={intl?.formatMessage({ id: submitButtonTranslationKey })}
          onSubmit={values => {
            onCompleteEditListingWizardTab(tab, values)
              .then(() => {
                if (isEdit) history.push(nextTabPath)
              })
          }}
          onPrevious={() => redirectPrevDraftUpdate(listing.id.uuid, params, tab, marketplaceTabs, history.goBack())}
        />
      );
    }
    case HAIR_TEXTURES: {
      const submitButtonTranslationKey = isNewListingFlow
        ? // ? 'EditListingWizard.saveNewLocation'
        'EditListingWizard.saveNewAvailability'
        : 'EditListingWizard.saveEditLocation';
      return (
        <EditListingHairTexturesPanel
          {...panelProps(HAIR_TEXTURES)}
          submitButtonText={intl?.formatMessage({ id: submitButtonTranslationKey })}
          onSubmit={values => {
            onCompleteEditListingWizardTab(tab, values)
              .then(() => {
                if (isEdit) history.push(nextTabPath)
              })
          }}
          onPrevious={() => redirectPrevDraftUpdate(listing.id.uuid, params, tab, marketplaceTabs, history.goBack())}
        />
      );
    }
    case SKIN_TYPES: {
      const submitButtonTranslationKey = isNewListingFlow
        ? // ? 'EditListingWizard.saveNewLocation'
        'EditListingWizard.saveNewAvailability'
        : 'EditListingWizard.saveEditLocation';
      return (
        <EditListingSkinTypesPanel
          {...panelProps(SKIN_TYPES)}
          submitButtonText={intl?.formatMessage({ id: submitButtonTranslationKey })}
          onSubmit={values => {
            onCompleteEditListingWizardTab(tab, values)
              .then(() => {
                if (isEdit) history.push(nextTabPath)
              })
          }}
          onPrevious={() => redirectPrevDraftUpdate(listing.id.uuid, params, tab, marketplaceTabs, history.goBack())}
        />
      );
    }
    case SKIN_TONES: {
      const submitButtonTranslationKey = isNewListingFlow
        ? // ? 'EditListingWizard.saveNewLocation'
        'EditListingWizard.saveNewAvailability'
        : 'EditListingWizard.saveEditLocation';
      return (
        <EditListingSkinTonesPanel
          {...panelProps(SKIN_TONES)}
          submitButtonText={intl?.formatMessage({ id: submitButtonTranslationKey })}
          onSubmit={values => {
            onCompleteEditListingWizardTab(tab, values)
              .then(() => {
                if (isEdit) history.push(nextTabPath)
              })
          }}
          onPrevious={() => redirectPrevDraftUpdate(listing.id.uuid, params, tab, marketplaceTabs, history.goBack())}
        />
      );
    }
    case PHOTOS: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'EditListingWizard.saveNewPricing'
        : 'EditListingWizard.saveEditPhotos';

      return (
        <EditListingPhotosPanel
          {...panelProps(PHOTOS)}
          submitButtonText={intl?.formatMessage({ id: submitButtonTranslationKey })}
          images={images}
          onImageUpload={onImageUpload}
          onRemoveImage={onRemoveImage}
          onSubmit={values => {
            onCompleteEditListingWizardTab(tab, values)
              .then(() => {
                if (isEdit) history.push(nextTabPath)
              })
          }}
          onUpdateImageOrder={onUpdateImageOrder}
          onPrevious={() => redirectPrevDraftUpdate(listing.id.uuid, params, tab, marketplaceTabs, history.goBack())}
          listingImageConfig={config.layout.listingImage}
        />
      );
    }

    case AVAILABILITY: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'EditListingWizard.saveNewAvailability'
        : 'EditListingWizard.saveEditAvailability';
      return (
        <EditListingAvailabilityPanel
          {...panelProps(AVAILABILITY)}
          fetchExceptionsInProgress={fetchExceptionsInProgress}
          availabilityExceptions={availabilityExceptions}
          submitButtonText={intl?.formatMessage({ id: submitButtonTranslationKey })}
          onAddAvailabilityException={onAddAvailabilityException}
          onDeleteAvailabilityException={onDeleteAvailabilityException}
          onSubmit={values => {
            // We want to return the Promise to the form,
            // so that it doesn't close its modal if an error is thrown.
            return onCompleteEditListingWizardTab(tab, values, true);
          }}
          onNextTab={() =>
            redirectAfterDraftUpdate(listing.id.uuid, params, tab, marketplaceTabs, history)
          }
          onPrevious={() => redirectPrevDraftUpdate(listing.id.uuid, params, tab, marketplaceTabs, history.goBack())}
        />
      );
    }
    case BOOKING_SYSTEM: {
      const submitButtonTranslationKey = isNewListingFlow
        ? // ? 'EditListingWizard.saveNewLocation'
        'EditListingWizard.saveNewAvailability'
        : 'EditListingWizard.saveEditLocation';
      return (
        <EditListingBookingSystemPanel
          {...panelProps(BOOKING_SYSTEM)}
          submitButtonText={intl?.formatMessage({ id: submitButtonTranslationKey })}
          onSubmit={values => {
            onCompleteEditListingWizardTab(tab, values)
              .then(() => {
                if (isEdit) history.push(nextTabPath)
              })
          }}
          onPrevious={() => redirectPrevDraftUpdate(listing.id.uuid, params, tab, marketplaceTabs, history.goBack())}
        />
      );
    }
    case PRICING: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'EditListingWizard.saveNewPricing'
        : 'EditListingWizard.saveEditPricing';
      return (
        <EditListingPricingPanel
          {...panelProps(PRICING)}
          submitButtonText={intl.formatMessage({ id: submitButtonTranslationKey })}
          onSubmit={values => {
            onCompleteEditListingWizardTab(tab, values)
              .then(() => {
                if (isEdit) history.push(nextTabPath)
              })
          }}
          onPrevious={() => redirectPrevDraftUpdate(listing.id.uuid, params, tab, marketplaceTabs, history.goBack())}
        />
      );
    }

    default:
      return null;
  }
};

EditListingWizardTab.defaultProps = {
  listing: null,
  updatedTab: null,
  availabilityExceptions: [],
};

const { array, bool, func, object, oneOf, shape, string } = PropTypes;

EditListingWizardTab.propTypes = {
  params: shape({
    id: string.isRequired,
    slug: string.isRequired,
    type: oneOf(LISTING_PAGE_PARAM_TYPES).isRequired,
    tab: oneOf(SUPPORTED_TABS).isRequired,
  }).isRequired,
  locationSearch: object,
  availabilityExceptions: arrayOf(propTypes.availabilityException),
  errors: shape({
    createListingDraftError: object,
    publishListingError: object,
    updateListingError: object,
    showListingsError: object,
    uploadImageError: object,
  }).isRequired,
  fetchInProgress: bool.isRequired,
  fetchExceptionsInProgress: bool.isRequired,
  newListingPublished: bool.isRequired,
  history: shape({
    push: func.isRequired,
    replace: func.isRequired,
  }).isRequired,
  images: array.isRequired,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: shape({
    attributes: shape({
      publicData: object,
      description: string,
      geolocation: object,
      pricing: object,
      title: string,
    }),
    images: array,
  }),

  handleCreateFlowTabScrolling: func.isRequired,
  handlePublishListing: func.isRequired,
  onUpdateListing: func.isRequired,
  onCreateListingDraft: func.isRequired,
  onImageUpload: func.isRequired,
  onRemoveImage: func.isRequired,
  onProcessChange: func.isRequired,
  updatedTab: string,
  updateInProgress: bool.isRequired,
  config: object.isRequired,
  routeConfiguration: arrayOf(propTypes.route).isRequired,
};

export default EditListingWizardTab;
