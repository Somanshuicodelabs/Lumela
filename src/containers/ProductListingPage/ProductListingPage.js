import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bool, func, object, shape, string } from 'prop-types';

import { ensureCurrentUser, ensureOwnListing, ensureUser } from '../../util/data';
import { types as sdkTypes } from '../../util/sdkLoader';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';

import { useConfiguration } from '../../context/configurationContext';
import { H3, Page, Footer, LayoutSingleColumn, LayoutWrapperAccountSettingsSideNav, FieldTextInput } from '../../components';
import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';

import { isScrollingDisabled } from '../../ducks/ui.duck';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { propTypes } from '../../util/types';
import ProductListingPageForm from './ProductListingPageForm/ProductListingPageForm';
// import { Form } from 'react-final-form';

const { UUID } = sdkTypes;


export const ProductListingPageComponent = props => {
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
        images
        // onShowListing,
        // createListingError,
    } = props;
    
    console.log('listing :>> ', listing);

    
    const [resetForm, setResetForm] = useState(false);
    const currentListing = ensureOwnListing(listing);
    const { publicData = {} } = currentListing.attributes;
    console.log('publicData :>> ', publicData);
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
            <LayoutSingleColumn
                topbar={
                    <>
                        <TopbarContainer currentPage="CreateCouponPage" />
                    </>
                }
                footer={<Footer />}
            >
                <div>
                </div>
            </LayoutSingleColumn>
            <LayoutWrapperAccountSettingsSideNav currentTab="ProductListingPage" />
            <ProductListingPageForm
                // className={css.form}
                images={restImages}
                initialValues={
                    resetForm
                        ? {}
                        : {
                            // businessName: publicData?.businessName,
                            // email: publicData?.email,
                            // abn: publicData?.abn,
                            // website: publicData?.website,
                            // instagram: publicData?.instagram,
                            // facebook: publicData?.facebook,
                            // images
                        }
                }
                saveActionMsg={submitButtonText}
                setResetForm={() => setResetForm(true)}
                onSubmit={values => {
                    const { businessName, email, abn, website, instagram, facebook } = values;

                    onSubmit({
                        title: businessName.trim(),
                        description: '',
                        publicData: {
                            businessName: businessName.trim(),
                            email,
                            abn,
                            website,
                            instagram,
                            facebook,
                        },
                    });
                }}
                onChange={onChange}
                disabled={disabled}
                ready={ready}
                updated={panelUpdated}
                updateInProgress={updateInProgress}
                fetchErrors={errors}
                publicData={publicData}
            />
        </Page>
    );
};

ProductListingPageComponent.defaultProps = {
    currentUser: null,
    uploadImageError: null,
    image: null,
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

    // from useConfiguration()
    // config: object.isRequired,

    // from injectIntl
    intl: intlShape.isRequired,
};

const mapStateToProps = state => {
    const { currentUser } = state.user;
    // const {
    //   uploadInProgress,
    //   updateInProgress,
    //   createListingError,
    //   createListingInProgress,
    //   couponTemplateAfterImageUpload,
    // } = state.CreateCouponPage;

    const getOwnListing = id => {
        const listings = getMarketplaceEntities(state, [{ id, type: 'ownListing' }]);
        return listings.length === 1 ? listings[0] : null;
    };

    return {
        currentUser,
        //   image,
        getOwnListing,
        scrollingDisabled: isScrollingDisabled(state),
        //   updateInProgress,
        //   uploadImageError,
        //   uploadInProgress,
        //   createListingError,
        //   createListingInProgress,
        //   couponTemplateAfterImageUpload
    };
};

const mapDispatchToProps = dispatch => ({
    onImageUpload: (data, config, templateType) => dispatch(uploadImage(data, config, templateType)),
    onRequestCreateCoupon: (values, config) => dispatch(requestCreateCoupon(values, config)),
    onShowListing: (id, config) => dispatch(showListing(id, config)),
    onRequestUpdateListing: (values, config) => dispatch(requestUpdateListing(values, config)),
    onGetAllMerchant: () => dispatch(getAllMerchats())
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