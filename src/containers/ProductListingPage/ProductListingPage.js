import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { array, arrayOf, bool, func, number, object, shape, string } from 'prop-types';
import { ensureCurrentUser, ensureOwnListing, ensureUser } from '../../util/data';
import { types as sdkTypes } from '../../util/sdkLoader';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { useConfiguration } from '../../context/configurationContext';
import { H3, Page, Footer, LayoutSingleColumn, LayoutWrapperAccountSettingsSideNav, FieldTextInput, LayoutSideNavigation, LayoutWrapperMain, UserNav } from '../../components';
import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';
import { isScrollingDisabled, manageDisableScrolling } from '../../ducks/ui.duck';
import { getListingsById, getMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { propTypes } from '../../util/types';
import ProductListingPageForm from './ProductListingPageForm/ProductListingPageForm';
import {
    requestFetchAvailabilityExceptions,
    requestAddAvailabilityException,
    requestDeleteAvailabilityException,
    requestCreateListingDraft,
    requestPublishListingDraft,
    requestImageUpload,
    removeListingImage,
    savePayoutDetails,
    compareAndSetStock,
} from '../EditListingPage/EditListingPage.duck';
import css from './ProductListingPage.module.css';
import { fetchBusinessListing, requestCreateListing, requestUpdateListing } from './ProductListingPage.duck';
import { getOwnListingsById } from '../ManageListingsPage/ManageListingsPage.duck';
import { parse } from '../../util/urlHelpers';

const { UUID, Money } = sdkTypes;
const getInitialValues = params => {
    const { listing } = params;
    const isPublished = listing?.id && listing?.attributes?.state !== LISTING_STATE_DRAFT;
    const currentStock = listing?.currentStock;
    // The listing resource has a relationship: `currentStock`,
    // which you should include when making API calls.
    const currentStockQuantity = currentStock?.attributes?.quantity;
    const stock = currentStockQuantity != null ? currentStockQuantity : isPublished ? 0 : 1;
    return { stock };
};


export const ProductListingPageComponent = props => {
    const config = useConfiguration();
    const {
        intl,
        params,
        onImageUpload,
        scrollingDisabled,
        onCreateListing,
        onUpdateListing,
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
        page,
        listingMinimumPriceSubUnits,
        onRemoveListingImage,
        onPublishListingDraft,
        state,
        category,
        onfetchBusinessListing
    } = props;
    const businessUserId = currentUser?.attributes?.profile?.publicData?.userListingId || "";
    const listingSearchId = typeof window !== 'undefined' &&
        parse(window.location.search);
    const listingID = new UUID(listingSearchId?.id)
    const ownListings = getOwnListingsById(state, [listingID])

    const initialValues = getInitialValues(props);
    const marketplaceCurrency = config.currency || ''
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

    const { mainImageId } = publicData || {};
    const restImages = images && images.length
        ? mainImageId
            ? images.filter(image => !image.imageType && mainImageId && image.id && (!image.id.uuid || (image.id.uuid && image.id.uuid != mainImageId)))
            : images.filter(image => !image.imageType)
        : [];
    const profileUser = ensureUser(user);
    const { displayName } = profileUser?.attributes?.profile || {};

    const schemaTitleVars = { name: displayName, siteTitle: config.marketplaceName };
    const schemaTitle = intl?.formatMessage({ id: "ProfilePage.schemaTitle" }, schemaTitleVars);
    const handleValues = async (values) => {

        const { title, brand, color, size, category,
            shortDescription,
            seller,
            price, stock, sort, maxNo, weight, dimensions, width, height, tag } = values;
        const hasNoCurrentStock = listing?.currentStock?.attributes?.quantity == null;
        const hasStockQuantityChanged = stock && stock !== initialValues.stock;
        const oldTotal = hasNoCurrentStock ? null : initialValues.stock;
        const stockUpdateMaybe =
            hasNoCurrentStock || hasStockQuantityChanged
                ? {
                    stockUpdate: {
                        oldTotal,
                        newTotal: stock,
                    },
                }
                : {};

        // New values for listing attributes
        const createdValues = {
            price,
            title: title,
            images: images,
            publicData: {
                brand,
                color,
                size,
                category,
                shortDescription,
                seller,
                sort,
                maxNo,
                weight,
                dimensions,
                listingType: 'product',
                width,
                height,
                tag
            },
            ...stockUpdateMaybe

        };
        const updatedValues = {
            listingSearchId,
            price,
            title: title,
            images: images,
            publicData: {
                brand,
                color,
                size,
                category,
                shortDescription,
                seller,
                sort,
                maxNo,
                weight,
                dimensions,
                listingType: 'product',
                width,
                height,
                tag
            },
            ...stockUpdateMaybe

        };
        listingSearchId.id ?
            onUpdateListing(updatedValues, config, { oldTotal, newTotal: stock }) :
            onCreateListing(createdValues, config, { oldTotal, newTotal: stock })
    }

    const handleValuesDraft = (values) => {
        const { title, brand, color, size, category,
            shortDescription,
            seller,
            price, sort, maxNo, weight, dimensions, width, height, tag } = values;
        const hasNoCurrentStock = listing?.currentStock?.attributes?.quantity == null;
        const hasStockQuantityChanged = stock && stock !== initialValues.stock;
        // currentStockQuantity is null or undefined, return null - otherwise use the value
        const oldTotal = hasNoCurrentStock ? null : initialValues.stock;
        const stockUpdateMaybe =
            hasNoCurrentStock || hasStockQuantityChanged
                ? {
                    stockUpdate: {
                        oldTotal,
                        newTotal: stock,
                    },
                }
                : {};
        onCreateListingDraft({
            price,
            title: title,
            images: images,
            publicData: {
                brand,
                color,
                size,
                category,
                shortDescription,
                seller,
                sort,
                maxNo,
                weight,
                dimensions,
                width,
                height,
                listingType: 'product',
                tag
            },
            ...stockUpdateMaybe
        }, config)
    }

    // save draft
    const { brand, color, size, shortDescription, seller, sort, weight, tag, maxNo, dimensions, width, height } = ownListings[0]?.attributes?.publicData || {};
    const { title, price } = ownListings[0]?.attributes || {};


    const newInitialValues = ownListings && ownListings.length ? {
        images: ownListings[0]?.images,
        title: title,
        brand: brand,
        color: color,
        size: size,
        category: ownListings[0].attributes.publicData.category,
        shortDescription: shortDescription,
        seller: seller,
        price: price,
        sort: sort,
        weight: weight,
        tag: tag,
        maxNo: maxNo,
        dimensions: dimensions,
        width: width,
        height: height,

    } : {
        images: [],
        title: '',
        brand: '',
        color: '',
        size: '',
        category: '',
        shortDescription: '',
        seller: '',
        price: 0,
        sort: '',
        weight: '',
        tag: '',
        maxNo: '',
        dimensions: '',
        width: '',
        height: ''

    }
    const submitButton = listingSearchId.id ? intl.formatMessage({
        id: "ProductListing.updateButtonText"
    }) : intl.formatMessage({
        id: "ProductListing.submitButtonText",
    })


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
                            initialValues={newInitialValues}
                            saveActionMsg={submitButton}
                            setResetForm={() => setResetForm(true)}
                            onSubmit={handleValues}
                            handleValues={handleValues}
                            handleValuesDraft={handleValuesDraft}
                            onChange={onChange}
                            disabled={disabled}
                            category={category}
                            ready={ready}
                            updated={panelUpdated}
                            updateInProgress={updateInProgress}
                            onPublishListingDraft={onPublishListingDraft}
                            fetchErrors={errors}
                            publicData={publicData}
                            onImageUpload={onImageUpload}
                            onRemoveImage={onRemoveListingImage}
                            listingMinimumPriceSubUnits={listingMinimumPriceSubUnits}
                            marketplaceCurrency={marketplaceCurrency}
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
    onPublishListingDraft: func.isRequired,
    scrollingDisabled: bool.isRequired,
    updateInProgress: bool.isRequired,
    uploadImageError: propTypes.error,
    uploadInProgress: bool.isRequired,
    submitButtonText: string.isRequired,
    listing: object,
    page: object.isRequired,
    marketplaceCurrency: string.isRequired,
    onRemoveListingImage: func.isRequired,
    listingMinimumPriceSubUnits: number.isRequired,
    listingTypes: arrayOf(
        shape({
            stockType: string,
        })
    ).isRequired,
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
    intl: intlShape.isRequired,
};

const mapStateToProps = state => {
    const page = state.EditListingPage;
    const { currentUser, currentUserListing } = state.user;
    const category = state?.ProductListingPage?.currentBusinessLising?.attributes?.publicData?.category
        || [];


    const getOwnListing = id => {
        const listings = getMarketplaceEntities(state, [{ id, type: 'ownListing' }]);
        return listings.length === 1 ? listings[0] : null;
    };

    return {
        state,
        currentUser,
        category,
        currentUserListing,
        page,
        getOwnListing,
        scrollingDisabled: isScrollingDisabled(state)
    };
};

const mapDispatchToProps = dispatch => ({
    onCreateListingDraft: (values, config) => dispatch(requestCreateListingDraft(values, config)),
    onCreateListing: (values, config, stockUpdateMaybe) => dispatch(requestCreateListing(values, config, stockUpdateMaybe)),
    onUpdateListing: (values, config, stockUpdateMaybe) => dispatch(requestUpdateListing(values, config, stockUpdateMaybe)),
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
    onCreateDraftServiceListing: (updatedValues, config) => dispatch(requestCreateListingDraft(updatedValues, config)),
    onfetchBusinessListing: (listingId) => dispatch(fetchBusinessListing(listingId)),
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