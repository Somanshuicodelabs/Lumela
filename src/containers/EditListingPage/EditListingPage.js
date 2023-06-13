import React from 'react';
import { bool, func, object, shape, string, oneOf } from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';

// Import configs and util modules
import { intlShape, injectIntl } from '../../util/reactIntl';
import { types as sdkTypes } from '../../util/sdkLoader';
import {
  LISTING_PAGE_PARAM_TYPE_DRAFT,
  LISTING_PAGE_PARAM_TYPE_NEW,
  LISTING_PAGE_PARAM_TYPES,
  LISTING_PAGE_PENDING_APPROVAL_VARIANT,
  createSlug,
  parse,
  LISTING_PAGE_PARAM_TYPE_EDIT,
} from '../../util/urlHelpers';
import { LISTING_STATE_DRAFT, LISTING_STATE_PENDING_APPROVAL, propTypes } from '../../util/types';
import { ensureOwnListing } from '../../util/data';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { manageDisableScrolling, isScrollingDisabled } from '../../ducks/ui.duck';
import {
  stripeAccountClearError,
  getStripeConnectAccountLink,
} from '../../ducks/stripeConnectAccount.duck';

// Import shared components
import { Footer, ModalMissingInformation, NamedRedirect, Page, UserNav } from '../../components';
import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';

// Import modules from this directory
import {
  requestFetchAvailabilityExceptions,
  requestAddAvailabilityException,
  requestDeleteAvailabilityException,
  requestCreateListingDraft,
  requestPublishListingDraft,
  requestUpdateListing,
  requestImageUpload,
  removeListingImage,
  savePayoutDetails,
} from './EditListingPage.duck';

import { sendVerificationEmail } from '../../ducks/user.duck';
import EditListingWizard from './EditListingWizard/EditListingWizard';

import css from './EditListingPage.module.css';

const STRIPE_ONBOARDING_RETURN_URL_SUCCESS = 'success';
const STRIPE_ONBOARDING_RETURN_URL_FAILURE = 'failure';
const STRIPE_ONBOARDING_RETURN_URL_TYPES = [
  STRIPE_ONBOARDING_RETURN_URL_SUCCESS,
  STRIPE_ONBOARDING_RETURN_URL_FAILURE,
];

const { UUID } = sdkTypes;

// Pick images that are currently attached to listing entity and images that are going to be attached.
// Avoid duplicates and images that should be removed.
const pickRenderableImages = (
  currentListing,
  uploadedImages,
  uploadedImageIdsInOrder = [],
  removedImageIds = []
) => {
  // Images are passed to EditListingForm so that it can generate thumbnails out of them
  const currentListingImages = currentListing && currentListing.images ? currentListing.images : [];
  // Images not yet connected to the listing
  const unattachedImages = uploadedImageIdsInOrder.map(i => uploadedImages[i]);
  const allImages = currentListingImages.concat(unattachedImages);

  const pickImagesAndIds = (imgs, img) => {
    const imgId = img.imageId || img.id;
    // Pick only unique images that are not marked to be removed
    const shouldInclude = !imgs.imageIds.includes(imgId) && !removedImageIds.includes(imgId);
    if (shouldInclude) {
      imgs.imageEntities.push(img);
      imgs.imageIds.push(imgId);
    }
    return imgs;
  };

  // Return array of image entities. Something like: [{ id, imageId, type, attributes }, ...]
  return allImages.reduce(pickImagesAndIds, { imageEntities: [], imageIds: [] }).imageEntities;
};

// N.B. All the presentational content needs to be extracted to their own components
export const EditListingPageComponent = props => {
  const {
    currentUser,
    createStripeAccountError,
    fetchInProgress,
    fetchStripeAccountError,
    getOwnListing,
    getAccountLinkError,
    getAccountLinkInProgress,
    history,
    currentUserListing,
    intl,
    onFetchExceptions,
    currentUserListingFetched,
    onAddAvailabilityException,
    onDeleteAvailabilityException,
    onCreateListingDraft,
    onPublishListingDraft,
    onUpdateListing,
    onImageUpload,
    onRemoveListingImage,
    onManageDisableScrolling,
    onPayoutDetailsSubmit,
    onPayoutDetailsChange,
    onGetStripeConnectAccountLink,
    currentUserHasOrders,
    page,
    params,
    location,
    scrollingDisabled,
    stripeAccountFetched,
    stripeAccount,
    updateStripeAccountError,
    onResendVerificationEmail,
    sendVerificationEmailInProgress,
    sendVerificationEmailError
  } = props;


  const { id, type, returnURLType } = params;
  const isNewURI = type === LISTING_PAGE_PARAM_TYPE_NEW;
  const isDraftURI = type === LISTING_PAGE_PARAM_TYPE_DRAFT;
  const isNewListingFlow = isNewURI || isDraftURI;

  const listingId = page.submittedListingId || (id ? new UUID(id) : null);
  const listing = getOwnListing(listingId);
  const currentListing = ensureOwnListing(getOwnListing(listingId));
  const { state: currentListingState } = currentListing.attributes;

  const isPastDraft = currentListingState && currentListingState !== LISTING_STATE_DRAFT;
  const shouldRedirect = isNewListingFlow && listingId && isPastDraft;

  const hasStripeOnboardingDataIfNeeded = returnURLType ? !!(currentUser && currentUser.id) : true;
  const showForm = hasStripeOnboardingDataIfNeeded && (isNewURI || currentListing.id);

  if (shouldRedirect) {
    const isPendingApproval =
      currentListing && currentListingState === LISTING_STATE_PENDING_APPROVAL;

    // If page has already listingId (after submit) and current listings exist
    // redirect to listing page
    const listingSlug = currentListing ? createSlug(currentListing.attributes.title) : null;

    const redirectProps = isPendingApproval
      ? {
        name: 'ListingPageVariant',
        params: {
          id: listingId.uuid,
          slug: listingSlug,
          variant: LISTING_PAGE_PENDING_APPROVAL_VARIANT,
        },
      }
      : {
        name: 'ListingPage',
        params: {
          id: listingId.uuid,
          slug: listingSlug,
        },
      };

    return isPendingApproval ? <NamedRedirect {...redirectProps} /> : <Redirect to="/p/listing-created-page" />;
  } else if (isNewURI && currentUserListingFetched && currentUserListing) {
    // If we allow only one listing per provider, we need to redirect to correct listing.
    return (
      <NamedRedirect
        name="EditListingPage"
        params={{
          id: currentUserListing.id.uuid,
          slug: createSlug(currentUserListing.attributes.title),
          type: LISTING_PAGE_PARAM_TYPE_EDIT,
          tab: 'description',
        }}
      />
    );

  } else if (showForm) {
    const {
      createListingDraftError = null,
      publishListingError = null,
      updateListingError = null,
      showListingsError = null,
      uploadImageError = null,
      setStockError = null,
      uploadedImages,
      uploadedImagesOrder,
      removedImageIds,
      addExceptionError = null,
      deleteExceptionError = null,
    } = page;
    const errors = {
      createListingDraftError,
      publishListingError,
      updateListingError,
      showListingsError,
      uploadImageError,
      setStockError,
      createStripeAccountError,
      addExceptionError,
      deleteExceptionError,
    };
    // TODO: is this dead code? (shouldRedirect is checked before)
    const newListingPublished =
      isDraftURI && currentListing && currentListingState !== LISTING_STATE_DRAFT;

    // Show form if user is posting a new listing or editing existing one
    const disableForm = page.redirectToListing && !showListingsError;
    const images = pickRenderableImages(
      currentListing,
      uploadedImages,
      uploadedImagesOrder,
      removedImageIds
    );

    const title = isNewListingFlow
      ? intl.formatMessage({ id: 'EditListingPage.titleCreateListing' })
      : intl.formatMessage({ id: 'EditListingPage.titleEditListing' });

    return (
      <Page title={title} scrollingDisabled={scrollingDisabled}>
        <div
          className={classNames(
            css.fixedWidthContainer,
            props.match.params.tab === 'pricing' ? css.pricingContainer : null
          )}
        >
          <ModalMissingInformation
            id="MissingInformationReminder"
            containerClassName={css.missingInformationModal}
            currentUser={currentUser}
            currentUserHasListings={currentUserListing}
            currentUserHasOrders={currentUserHasOrders}
            location={location}
            onManageDisableScrolling={onManageDisableScrolling}
            onResendVerificationEmail={onResendVerificationEmail}
            sendVerificationEmailInProgress={sendVerificationEmailInProgress}
            sendVerificationEmailError={sendVerificationEmailError}
          />
          {/* <TopbarContainer
          className={css.topbar}
          mobileRootClassName={css.mobileTopbar}
          desktopClassName={css.desktopTopbar}
          mobileClassName={css.mobileTopbar}
        /> */}
          <EditListingWizard
            id="EditListingWizard"
            className={css.wizard}
            params={params}
            locationSearch={parse(location.search)}
            disabled={disableForm}
            errors={errors}
            fetchInProgress={fetchInProgress}
            newListingPublished={newListingPublished}
            history={history}
            images={images}
            listing={currentListing}
            weeklyExceptionQueries={page.weeklyExceptionQueries}
            monthlyExceptionQueries={page.monthlyExceptionQueries}
            allExceptions={page.allExceptions}
            onFetchExceptions={onFetchExceptions}
            onAddAvailabilityException={onAddAvailabilityException}
            onDeleteAvailabilityException={onDeleteAvailabilityException}
            onUpdateListing={onUpdateListing}
            onCreateListingDraft={onCreateListingDraft}
            onPublishListingDraft={onPublishListingDraft}
            onPayoutDetailsChange={onPayoutDetailsChange}
            onPayoutDetailsSubmit={onPayoutDetailsSubmit}
            onGetStripeConnectAccountLink={onGetStripeConnectAccountLink}
            getAccountLinkInProgress={getAccountLinkInProgress}
            onImageUpload={onImageUpload}
            onRemoveImage={onRemoveListingImage}
            currentUser={currentUser}
            onManageDisableScrolling={onManageDisableScrolling}
            stripeOnboardingReturnURL={params.returnURLType}
            updatedTab={page.updatedTab}
            updateInProgress={page.updateInProgress || page.createListingDraftInProgress}
            payoutDetailsSaveInProgress={page.payoutDetailsSaveInProgress}
            payoutDetailsSaved={page.payoutDetailsSaved}
            stripeAccountFetched={stripeAccountFetched}
            stripeAccount={stripeAccount}
            stripeAccountError={
              createStripeAccountError || updateStripeAccountError || fetchStripeAccountError
            }
            stripeAccountLinkError={getAccountLinkError}
          />
        </div>
      </Page>
    );
  } else {
    // If user has come to this page through a direct linkto edit existing listing,
    // we need to load it first.
    const loadingPageMsg = {
      id: 'EditListingPage.loadingListingData',
    };
    return (
      <Page title={intl.formatMessage(loadingPageMsg)} scrollingDisabled={scrollingDisabled}>
        <TopbarContainer
        // className={css.topbar}
        // mobileRootClassName={css.mobileTopbar}
        // desktopClassName={css.desktopTopbar}
        // mobileClassName={css.mobileTopbar}
        />
        <UserNav
          selectedPageName={listing ? 'EditListingPage' : 'NewListingPage'}
          listing={listing}
        />
        <div className={css.placeholderWhileLoading} />
        <Footer />
      </Page>
    );
  }
};

EditListingPageComponent.defaultProps = {
  createStripeAccountError: null,
  fetchStripeAccountError: null,
  getAccountLinkError: null,
  getAccountLinkInProgress: null,
  stripeAccountFetched: null,
  currentUser: null,
  stripeAccount: null,
  currentUserHasOrders: null,
  listing: null,
  listingDraft: null,
  notificationCount: 0,
  sendVerificationEmailError: null,
  currentUserListingFetched: false,
};

EditListingPageComponent.propTypes = {
  createStripeAccountError: propTypes.error,
  fetchStripeAccountError: propTypes.error,
  getAccountLinkError: propTypes.error,
  getAccountLinkInProgress: bool,
  updateStripeAccountError: propTypes.error,
  currentUser: propTypes.currentUser,
  fetchInProgress: bool.isRequired,
  getOwnListing: func.isRequired,
  onFetchExceptions: func.isRequired,
  currentUserListingFetched: bool,
  onAddAvailabilityException: func.isRequired,
  onDeleteAvailabilityException: func.isRequired,
  onGetStripeConnectAccountLink: func.isRequired,
  onCreateListingDraft: func.isRequired,
  onPublishListingDraft: func.isRequired,
  onImageUpload: func.isRequired,
  onManageDisableScrolling: func.isRequired,
  onPayoutDetailsChange: func.isRequired,
  onPayoutDetailsSubmit: func.isRequired,
  onRemoveListingImage: func.isRequired,
  onUpdateListing: func.isRequired,
  page: object.isRequired,
  params: shape({
    id: string.isRequired,
    slug: string.isRequired,
    type: oneOf(LISTING_PAGE_PARAM_TYPES).isRequired,
    tab: string.isRequired,
    returnURLType: oneOf(STRIPE_ONBOARDING_RETURN_URL_TYPES),
  }).isRequired,
  stripeAccountFetched: bool,
  stripeAccount: object,
  scrollingDisabled: bool.isRequired,

  /* from withRouter */
  history: shape({
    push: func.isRequired,
  }).isRequired,
  location: shape({
    search: string.isRequired,
  }).isRequired,

  /* from injectIntl */
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const page = state.EditListingPage;
  const {
    getAccountLinkInProgress,
    getAccountLinkError,
    createStripeAccountInProgress,
    createStripeAccountError,
    updateStripeAccountError,
    fetchStripeAccountError,
    stripeAccount,
    stripeAccountFetched,
  } = state.stripeConnectAccount;

  const { currentUser, currentUserListing, currentUserListingFetched, currentUserHasOrders, sendVerificationEmailInProgress, sendVerificationEmailError } = state.user;

  const fetchInProgress = createStripeAccountInProgress;

  const getOwnListing = id => {
    const listings = getMarketplaceEntities(state, [{ id, type: 'ownListing' }]);
    return listings.length === 1 ? listings[0] : null;
  };

  return {
    getAccountLinkInProgress,
    getAccountLinkError,
    sendVerificationEmailInProgress,
    sendVerificationEmailError,
    createStripeAccountError,
    updateStripeAccountError,
    fetchStripeAccountError,
    stripeAccount,
    stripeAccountFetched,
    currentUser,
    currentUserListing,
    currentUserListingFetched,
    currentUserHasOrders,
    fetchInProgress,
    getOwnListing,
    page,
    scrollingDisabled: isScrollingDisabled(state),
  };
};

const mapDispatchToProps = dispatch => ({
  onFetchExceptions: params => dispatch(requestFetchAvailabilityExceptions(params)),
  onAddAvailabilityException: params => dispatch(requestAddAvailabilityException(params)),
  onDeleteAvailabilityException: params => dispatch(requestDeleteAvailabilityException(params)),
  onUpdateListing: (tab, values, config) => dispatch(requestUpdateListing(tab, values, config)),
  onCreateListingDraft: (values, config) => dispatch(requestCreateListingDraft(values, config)),
  onPublishListingDraft: listingId => dispatch(requestPublishListingDraft(listingId)),
  onImageUpload: (data, listingImageConfig, imageType) =>
    dispatch(requestImageUpload(data, listingImageConfig, imageType)),
  onManageDisableScrolling: (componentId, disableScrolling) =>
    dispatch(manageDisableScrolling(componentId, disableScrolling)),
  onPayoutDetailsChange: () => dispatch(stripeAccountClearError()),
  onPayoutDetailsSubmit: (values, isUpdateCall) =>
    dispatch(savePayoutDetails(values, isUpdateCall)),
  onGetStripeConnectAccountLink: params => dispatch(getStripeConnectAccountLink(params)),
  onRemoveListingImage: imageId => dispatch(removeListingImage(imageId)),
  onResendVerificationEmail: () => dispatch(sendVerificationEmail()),
});

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const EditListingPage = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(EditListingPageComponent);

export default EditListingPage;
