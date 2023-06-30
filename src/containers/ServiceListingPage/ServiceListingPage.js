import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bool, func, object, shape, string } from 'prop-types';

import { ensureCurrentUser, ensureOwnListing, ensureUser } from '../../util/data';
import { types as sdkTypes } from '../../util/sdkLoader';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';

import { useConfiguration } from '../../context/configurationContext';
import { H3, Page, Footer, LayoutSingleColumn, LayoutWrapperAccountSettingsSideNav, FieldTextInput, LayoutSideNavigation, LayoutWrapperMain, UserNav } from '../../components';
import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';

import { isScrollingDisabled } from '../../ducks/ui.duck';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { propTypes } from '../../util/types';
// import ProductListingPageForm from './ProductListingPageForm/ProductListingPageForm';
// import { Form } from 'react-final-form';
import css from './ServiceListingPage.module.css';
import ServiceListingPageForm from './ServiceListingPageForm/ServiceListingPageForm';
import { createExpertListing } from './ServiceListingPage.duck';
import { requestCreateListingDraft, requestUpdateListing } from '../EditListingPage/EditListingPage.duck';

const { UUID } = sdkTypes;


export const ServiceListingPageComponent = props => {
    const config = useConfiguration();
    const {
        intl,
        params,
        image: savedImage,
        onImageUpload,
        uploadImageError,
        getOwnListing,
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
        images,
        onCreateServiceListing,
        onCreateDraftServiceListing,
        onUpdateUserListing
    } = props;



    const [resetForm, setResetForm] = useState(false);
    const currentListing = ensureOwnListing(listing);
    const unitType = listing?.attributes?.publicData?.unitType;
    const { publicData = {} } = currentListing.attributes;
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
                            images={restImages}
                            onCreateDraftServiceListing={onCreateDraftServiceListing}
                            config={config}
                            initialValues={{}
                            }
                            saveActionMsg={submitButtonText}
                            setResetForm={() => setResetForm(true)}
                            onSubmit={values => {
                                const {
                                    title,
                                    price,
                                    category,
                                    shortDescription,
                                    technicalNotes,
                                    hours,
                                    mins,
                                    cancelationPolicy,
                                    noOfBooking,
                                    months,
                                    days,
                                    advanceMonths,
                                    advanceDays,
                                    tag
                                } = values;

                                const updatedValues = {
                                    title: title,
                                    price,
                                    description: '',
                                    publicData: {
                                        category,
                                        shortDescription,
                                        technicalNotes,
                                        hours,
                                        mins,
                                        cancelationPolicy,
                                        noOfBooking,
                                        months,
                                        days,
                                        advanceMonths,
                                        advanceDays,
                                        listingType: 'service',
                                        tag
                                    },
                                }
                                onCreateServiceListing(updatedValues, config).then(() => {
                                    // onUpdateUserListing(null config)
                                })
                            }}
                            onChange={onChange}
                            disabled={disabled}
                            unitType={unitType}
                            ready={ready}
                            updated={panelUpdated}
                            updateInProgress={updateInProgress}
                            fetchErrors={errors}
                            publicData={publicData}
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

    const getOwnListing = id => {
        const listings = getMarketplaceEntities(state, [{ id, type: 'ownListing' }]);
        return listings.length === 1 ? listings[0] : null;
    };

    return {
        currentUser,
        getOwnListing,
        scrollingDisabled: isScrollingDisabled(state),
    };
};

const mapDispatchToProps = dispatch => ({
    onImageUpload: (data, config, templateType) => dispatch(uploadImage(data, config, templateType)),
    onCreateServiceListing: (updatedValues, config) => dispatch(createExpertListing(updatedValues, config)),
    onCreateDraftServiceListing: (updatedValues, config) => dispatch(requestCreateListingDraft(updatedValues, config)),
    onUpdateUserListing: (tab, data, config) => dispatch(requestUpdateListing(tab, data, config))
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