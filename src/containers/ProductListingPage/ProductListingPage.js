import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { array, bool, func, object, shape, string } from 'prop-types';

import { ensureCurrentUser, ensureOwnListing, ensureUser } from '../../util/data';
import { types as sdkTypes } from '../../util/sdkLoader';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';

import { useConfiguration } from '../../context/configurationContext';
import { H3, Page, Footer, LayoutSingleColumn, LayoutWrapperAccountSettingsSideNav, FieldTextInput, LayoutSideNavigation, LayoutWrapperMain, UserNav } from '../../components';
import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';

import { isScrollingDisabled, manageDisableScrolling } from '../../ducks/ui.duck';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { propTypes } from '../../util/types';
import ProductListingPageForm from './ProductListingPageForm/ProductListingPageForm';
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
} from '../EditListingPage/EditListingPage.duck';
// import { Form } from 'react-final-form';
import css from './ProductListingPage.module.css';
import { requestCreateListing } from './ProductListingPage.duck';

const { UUID } = sdkTypes;


export const ProductListingPageComponent = props => {
    const config = useConfiguration();
    const {
        intl,
        params,
        onImageUpload,
        scrollingDisabled,
        onCreateListing,
        onCreateListingDraft,
        user,
        currentUser,
        listing,
        disabled,
        ready,
        onChange,
        panelUpdated,
        updateInProgress,
        errors,
        page
    } = props;

    const currentListing = ensureOwnListing(listing);
    const currentListingImages =
        currentListing && currentListing.images ? currentListing.images : [];

    const imageOrder = page?.uploadedImagesOrder || [];
    const unattachedImages = imageOrder.map(i => page.uploadedImages
        ?.[i]);

    const allImages = currentListingImages.concat(unattachedImages);
    const removedImageIds = page.removedImageIds || [];
    const images = allImages.filter(img => {
        return !removedImageIds.includes(img.id);
    });
    const { publicData = {} } = currentListing.attributes;
    const {
        title,
        brand,
        color,
        size,
        category,
        shortDescription,
        seller,
        cost } = publicData || {}
    const { mainImageId } = publicData || {};
    const restImages = images && images.length
        ? mainImageId
            ? images.filter(image => !image.imageType && mainImageId && image.id && (!image.id.uuid || (image.id.uuid && image.id.uuid != mainImageId)))
            : images.filter(image => !image.imageType)
        : [];
    const { id } = params || {};
    const listingId = id ? new UUID(id) : null;
    // const currentListing = ensureOwnListing(getOwnListing(listingId));
    // const [imageState, setImageState] = useState(null);
    const ensuredCurrentUser = ensureCurrentUser(currentUser);
    const profileUser = ensureUser(user);
    const isCurrentUser =
        ensuredCurrentUser.id && profileUser.id && ensuredCurrentUser.id.uuid === profileUser.id.uuid;
    const { bio, displayName } = profileUser?.attributes?.profile || {};

    const schemaTitleVars = { name: displayName, siteTitle: config.marketplaceName };
    const schemaTitle = intl?.formatMessage({ id: "ProfilePage.schemaTitle" }, schemaTitleVars);

    const handleValues = (values) => {
        const { title, brand, color, size, category,
            shortDescription,
            seller,
            cost } = values;
        onCreateListing({
            title: title,
            publicData: {
                brand,
                color,
                size,
                category,
                shortDescription,
                seller,
                cost
            },
        }, config)
    }
    const handleValuesDraft = (values) => {
        const { title, brand, color, size, category,
            shortDescription,
            seller,
            cost } = values;
        onCreateListingDraft({
            title: title,
            publicData: {
                brand,
                color,
                size,
                category,
                shortDescription,
                seller,
                cost
            },
        }, config)
    }

    return (
        <Page title={schemaTitle} scrollingDisabled={scrollingDisabled}>
            <LayoutSideNavigation
                mainContentBox={true}
                topbar={
                    <>
                        <TopbarContainer
                            currentPage="ProductListingPage"
                            desktopClassName={css.desktopTopbar}
                            mobileClassName={css.mobileTopbar}
                        />
                        {/* <UserNavUserNav currentPage="ProductListingPage" /> */}
                    </>
                }
                sideNav={null}
                useAccountSettingsNav
                currentPage="ProductListingPage"
                footer={<Footer />}
            >
                <LayoutWrapperMain>
                    <h1 className={css.mainHeading}>
                        <FormattedMessage id="ProductListingPage.addNewProduct" />
                    </h1>
                    <div className={css.contentBox}>
                        <ProductListingPageForm
                            className={css.productFormWrapper}
                            images={restImages}
                            initialValues={{
                                images,
                                title,
                                brand,
                                color,
                                size,
                                category,
                                shortDescription,
                                seller,
                                cost
                            }}
                            saveActionMsg={intl.formatMessage({
                                id: 'StripePayoutPage.submitButtonText',
                            })}
                            setResetForm={() => setResetForm(true)}
                            onSubmit={handleValues}
                            handleValues={handleValues}
                            handleValuesDraft={handleValuesDraft}
                            onChange={onChange}
                            disabled={disabled}
                            ready={ready}
                            updated={panelUpdated}
                            updateInProgress={updateInProgress}
                            fetchErrors={errors}
                            publicData={publicData}
                            onImageUpload={onImageUpload}
                        />
                    </div>
                </LayoutWrapperMain>
            </LayoutSideNavigation>
        </Page>
    );
};

ProductListingPageComponent.defaultProps = {
    currentUser: null,
    uploadImageError: null,
    image: null,
    listing: null,
};

ProductListingPageComponent.propTypes = {
    currentUser: propTypes.currentUser,
    image: shape({
        id: string,
        imageId: propTypes.uuid,
        file: object,
        uploadedImage: propTypes.image,
    }),
    onImageUpload: func.isRequired,
    scrollingDisabled: bool.isRequired,
    updateInProgress: bool.isRequired,
    uploadImageError: propTypes.error,
    uploadInProgress: bool.isRequired,
    submitButtonText: string.isRequired,
    listing: object,
    page: object.isRequired,

    disabled: bool.isRequired,
    ready: bool.isRequired,
    onSubmit: func.isRequired,
    onChange: func.isRequired,
    listing: shape({
        attributes: shape({
            publicData: object,
        }),
        images: array,
    }),
    // from useConfiguration()
    // config: object.isRequired,

    // from injectIntl
    intl: intlShape.isRequired,
};

const mapStateToProps = state => {
    const page = state.EditListingPage;
    const { currentUser, currentUserListing } = state.user;

    const getOwnListing = id => {
        const listings = getMarketplaceEntities(state, [{ id, type: 'ownListing' }]);
        return listings.length === 1 ? listings[0] : null;
    };

    return {
        currentUser,
        currentUserListing,
        page,
        getOwnListing,
        scrollingDisabled: isScrollingDisabled(state)
    };
};

const mapDispatchToProps = dispatch => ({
    onUpdateListing: (tab, values, config) => dispatch(requestUpdateListing(tab, values, config)),
    onCreateListingDraft: (values, config) => dispatch(requestCreateListingDraft(values, config)),
    onCreateListing: (values, config) => dispatch(requestCreateListing(values, config)),
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
});

const ProductListingPage = compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    injectIntl
)(ProductListingPageComponent);

export default ProductListingPage;