import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bool, func, object, shape, string } from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';

import { useConfiguration } from '../../context/configurationContext';
import { H3, Page, Footer, LayoutSingleColumn, LayoutWrapperAccountSettingsSideNav, FieldTextInput, LayoutSideNavigation, LayoutWrapperMain, UserNav, ProductsCard, PrimaryButton } from '../../components';
import TopbarContainer from '../TopbarContainer/TopbarContainer';

import { isScrollingDisabled } from '../../ducks/ui.duck';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { propTypes } from '../../util/types';
// import ProductListingPageForm from './ProductListingPageForm/ProductListingPageForm';
// import { Form } from 'react-final-form';
// import { createExpertListing } from './ServiceListingPage.duck';
import { requestCreateListingDraft, requestUpdateListing } from '../EditListingPage/EditListingPage.duck';
import { ensureCurrentUser, ensureUser } from '../../util/data';
import { fetchCurrentListing } from './ProductListingPage.duck';
import css from './ProductListingPage.module.css';
import productCardImage from '../../assets/productCardImage.png';

const productData = [
    {
        productImage: productCardImage,
        productHeading: "Glossier Oil Serum Hybrid futuredew",
        productSize: "30ml",
        productPrice: "$120",
    },
    {
        productImage: productCardImage,
        productHeading: "Glossier Oil Serum Hybrid futuredew",
        productSize: "30ml",
        productPrice: "$120",
    },
    {
        productImage: productCardImage,
        productHeading: "Glossier Oil Serum Hybrid futuredew",
        productSize: "30ml",
        productPrice: "$120",
    },
    {
        productImage: productCardImage,
        productHeading: "Glossier Oil Serum Hybrid futuredew",
        productSize: "30ml",
        productPrice: "$120",
    },
    {
        productImage: productCardImage,
        productHeading: "Glossier Oil Serum Hybrid futuredew",
        productSize: "30ml",
        productPrice: "$120",
    },
    {
        productImage: productCardImage,
        productHeading: "Glossier Oil Serum Hybrid futuredew",
        productSize: "30ml",
        productPrice: "$120",
    },
]

export const AllProductsPageComponent = props => {
    const config = useConfiguration();
    const {
        intl,
        scrollingDisabled,
        currentUser,
        user,
        onfetchCurrentListing
    } = props;
    const ensuredCurrentUser = ensureCurrentUser(currentUser);
    const profileUser = ensureUser(user);
    const isCurrentUser =
        ensuredCurrentUser.id && profileUser.id && ensuredCurrentUser.id.uuid === profileUser.id.uuid;
    const { bio, displayName } = profileUser?.attributes?.profile || {};

    const schemaTitleVars = { name: displayName, siteTitle: config.marketplaceName };

    const schemaTitle = intl?.formatMessage({ id: "ProfilePage.schemaTitle" }, schemaTitleVars);

    useEffect(() => {
        onfetchCurrentListing()
    }, [])



    return (
        <Page title={schemaTitle} scrollingDisabled={scrollingDisabled}>
            <LayoutSideNavigation
                mainContentBox={true}
                topbar={
                    <>
                        <TopbarContainer
                            currentPage="ProductListingPage"
                        // desktopClassName={css.desktopTopbar}
                        // mobileClassName={css.mobileTopbar}
                        />
                        {/* <UserNavUserNav currentPage="ProductListingPage" /> */}
                    </>
                }
                sideNav={null}
                useAccountSettingsNav
                currentPage="ProductListingPage"
                footer={<Footer />}
            >

                <div className={css.productPageWrapper}>
                    <h2 className={css.mainHeading}>
                        <FormattedMessage id="ProductListingPage.products" />
                    </h2>
                    <PrimaryButton>ADD NEW PRODUCT </PrimaryButton>
                    <div className={css.productCardList}>
                        {productData.map((item) => {
                            return (
                                <ProductsCard
                                    productImage={item.productImage}
                                    productHeading={item.productHeading}
                                    productSize={item.productSize}
                                    productPrice={item.productPrice}
                                />
                            )
                        })}
                    </div>
                </div>
            </LayoutSideNavigation>
        </Page>
    )
}

AllProductsPageComponent.defaultProps = {
    currentUser: null,
    uploadImageError: null,
    image: null,
};

AllProductsPageComponent.propTypes = {
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
    onfetchCurrentListing: (listingId) => dispatch(fetchCurrentListing(listingId)),

});

const AllProductsPage = compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    injectIntl
)(AllProductsPageComponent);

export default AllProductsPage;
