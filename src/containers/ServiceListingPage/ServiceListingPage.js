import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bool, func, object, shape, string } from 'prop-types';

import { ensureCurrentUser, ensureListing, ensureOwnListing, ensureUser } from '../../util/data';
import { types as sdkTypes } from '../../util/sdkLoader';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';

import { useConfiguration } from '../../context/configurationContext';
import { H3, Page, Footer, LayoutSingleColumn, LayoutWrapperAccountSettingsSideNav, FieldTextInput, LayoutSideNavigation, LayoutWrapperMain, UserNav } from '../../components';
import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';

import { isScrollingDisabled } from '../../ducks/ui.duck';
import { getListingsById, getMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { BUSINESS_LISTING_TYPE, propTypes } from '../../util/types';
// import ProductListingPageForm from './ProductListingPageForm/ProductListingPageForm';
// import { Form } from 'react-final-form';
import css from './ServiceListingPage.module.css';
import ServiceListingPageForm from './ServiceListingPageForm/ServiceListingPageForm';
import { createExpertListing, uploadImage } from './ServiceListingPage.duck';
import { removeListingImage, requestCreateListingDraft, requestImageUpload, requestUpdateListing } from '../EditListingPage/EditListingPage.duck';
import { getOwnListingsById } from '../ManageListingsPage/ManageListingsPage.duck';
import { parse } from '../../util/urlHelpers';

const { UUID } = sdkTypes;


export const ServiceListingPageComponent = props => {
    const config = useConfiguration();
    const {
        intl,
        params,
        image: savedImage,
        onImageUpload,
        uploadImageError,
        scrollingDisabled,
        uploadInProgress,
        createListingInProgress,
        onRequestCreateCoupon,
        onRequestUpdateListing,
        couponTemplateAfterImageUpload,
        onGetAllMerchant,
        handleSubmit,
        user,
        currentUser,
        listing,
        submitButtonText,
        disabled,
        ready,
        onSubmit,
        onChange,
        panelUpdated,
        updateInProgress,
        errors,
        onCreateServiceListing,
        onCreateDraftServiceListing,
        onUpdateUserListing,
        listings,
        onRemoveListingImage,
        page,
        category,
        state
    } = props;

    const listingSearchId = typeof window !== 'undefined' &&
        parse(window.location.search);
    const listingID = new UUID(listingSearchId?.id)
    const ownListings = getOwnListingsById(state, [listingID])

    const imageOrder = page?.uploadedImagesOrder || [];
    const unattachedImages = imageOrder.map(i => page.uploadedImages
        ?.[i]);

    const currentListing = listings.filter((st) => st.attributes.publicData.listingType === BUSINESS_LISTING_TYPE)
    const currentListingImages =
        currentListing && currentListing.images ? currentListing.images : [];
    const allImages = currentListingImages.concat(unattachedImages);
    const removedImageIds = page.removedImageIds || [];
    const images = allImages.filter(img => {
        return !removedImageIds.includes(img.id);
    });

    const [resetForm, setResetForm] = useState(false);
    const unitType = currentListing?.attributes?.publicData?.unitType;
    const { publicData = {} } = !!currentListing.id && currentListing?.attributes;
    const { serviceTags = [] } = publicData || {};

    const { id } = params || {};
    const listingId = currentListing.at(0)?.id;

    // const listings = ensureOwnListing(getOwnListing(listingId));
    // const [imageState, setImageState] = useState(null);
    const ensuredCurrentUser = ensureCurrentUser(currentUser);
    const profileUser = ensureUser(user);
    const isCurrentUser =
        ensuredCurrentUser.id && profileUser.id && ensuredCurrentUser.id.uuid === profileUser.id.uuid;
    const { bio, displayName } = profileUser?.attributes?.profile || {};

    const schemaTitleVars = { name: displayName, siteTitle: config.marketplaceName };
    const schemaTitle = intl?.formatMessage({ id: "ProfilePage.schemaTitle" }, schemaTitleVars);

    // save draft
    const { advanceDays
        , advanceMonths
        , days, hours, mins, months, tag, noOfBooking, shortDescription, technicalNotes } = ownListings[0]?.attributes?.publicData || {};
    const { title, price } = ownListings[0]?.attributes || {};


    const initialValues = ownListings && ownListings.length ? {
        images: ownListings[0]?.images,
        title: title,
        advanceDays: advanceDays,
        advanceMonths: advanceMonths,
        days: days,
        hours: hours,
        shortDescription: shortDescription,
        mins: mins,
        price: price,
        months: months,
        noOfBooking: noOfBooking,
        tag: tag,
        technicalNotes: technicalNotes

    } : {
        images: [],
        title: '',
        advanceDays: '',
        advanceMonths: '',
        days: '',
        hours: '',
        shortDescription: '',
        mins: '',
        price: 0,
        months: '',
        noOfBooking: '',
        tag: '',
        technicalNotes: ''

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
                        <FormattedMessage id="ProductListingPage.addNewServices" />
                    </h1>
                    <div className={css.contentBox}>
                        <ServiceListingPageForm
                            className={css.productFormWrapper}
                            initialValues={initialValues}
                            saveActionMsg={submitButtonText}
                            setResetForm={() => setResetForm(true)}
                            onSubmit={values => {
                                const {
                                    title,
                                    price,
                                    isDraft = false,
                                    ...rest
                                } = values;
                                
                                const updatedValues = {
                                    title,
                                    description: '',
                                    images,
                                    publicData: {
                                        ...rest,
                                        listingType: 'service',
                                    },
                                }
                                if (price) {
                                    Object.assign(updatedValues, { price, });
                                }
                                
                                if (isDraft) {
                                    return onCreateDraftServiceListing(updatedValues, config);
                                }
                                const { tag } = (listing && listing.id && listing.attributes.publicData) || {};
                                // let tag =[];
                                const { serviceTagsData = {} } = (listing && listing.id && listing.attributes.publicData) || {};

                                if (serviceTags && serviceTags && serviceTagsData[serviceTags] && serviceTagsData[serviceTags].length) {
                                    serviceTagsData[serviceTags] = serviceTagsData[serviceTags].filter(sc => sc != listingId.uuid);
                                    if (serviceTagsData[serviceTags] && serviceTagsData[serviceTags].length == 0) {
                                        delete serviceTagsData[serviceTags];
                                    }
                                }
                                if (tag) {
                                    if (serviceTagsData[tag]) {
                                        if (serviceTagsData[tag].length) {
                                            serviceTagsData[tag].push(listingId.uuid);
                                        } else {
                                            serviceTagsData[tag] = [listingId.uuid];
                                        }
                                    } else {
                                        serviceTagsData[tag] = [listingId.uuid];
                                    }
                                }

                                // const merchantPublicData = {
                                //     category: "shop-by-merchants",
                                //     subCategories: Object.keys(subCategoryData),
                                //     subCategoryData,
                                // };
                                onCreateServiceListing(updatedValues, config).then((r) => {
                                    // const data = {
                                    //     publicData: {
                                    //         serviceTags: [...tag, ...serviceTags]
                                    //     }
                                    // }
                                    // onUpdateUserListing(data, config, listingId);
                                })
                            }}
                            onChange={onChange}
                            disabled={disabled}
                            unitType={unitType}
                            onImageUpload={onImageUpload}
                            onRemoveImage={onRemoveListingImage}
                            ready={ready}
                            category={category}
                            updated={panelUpdated}
                            updateInProgress={updateInProgress}
                            fetchErrors={errors}
                            publicData={publicData}
                            images={images}
                            listingImageConfig={config.layout.listingImage}
                        />
                    </div>
                </LayoutWrapperMain>
            </LayoutSideNavigation>
        </Page>
    );
};

ServiceListingPageComponent.defaultProps = {
    currentUser: null,
    uploadImageError: null,
    image: null,
};

ServiceListingPageComponent.propTypes = {
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

    // from useConfiguration()
    // config: object.isRequired,

    // from injectIntl
    intl: intlShape.isRequired,
};

const mapStateToProps = state => {
    const { currentUser } = state.user;
    const { currentPageResultIds } = state.ServiceListingPage;
    const page = state.EditListingPage;
    const listings = getOwnListingsById(state, currentPageResultIds);
    const category = state?.ServiceListingPage
    ?.currentBusinessLising?.attributes?.publicData?.category
        || [];

    return {
        state,
        category,
        currentUser,
        page,
        listings,
        scrollingDisabled: isScrollingDisabled(state),
    };
};

const mapDispatchToProps = dispatch => ({
    onImageUpload: (data, listingImageConfig, imageType) =>
        dispatch(requestImageUpload(data, listingImageConfig, imageType)),
    onCreateServiceListing: (updatedValues, config) => dispatch(createExpertListing(updatedValues, config)),
    onCreateDraftServiceListing: (updatedValues, config) => dispatch(requestCreateListingDraft(updatedValues, config)),
    onUpdateUserListing: (data, config, listingId) => dispatch(createExpertListing(data, config, listingId)),
    onRemoveListingImage: imageId => dispatch(removeListingImage(imageId)),
});

const ServiceListingPage = compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    injectIntl
)(ServiceListingPageComponent);

export default ServiceListingPage;