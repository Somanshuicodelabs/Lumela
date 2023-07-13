import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { array, arrayOf, bool, func, number, object, shape, string } from 'prop-types';
import { types as sdkTypes } from '../../util/sdkLoader';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { Page, Footer, LayoutSideNavigation, LayoutWrapperMain} from '../../components';
import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';
import { isScrollingDisabled, manageDisableScrolling } from '../../ducks/ui.duck';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { propTypes } from '../../util/types';
// import {
//     requestCreateListingDraft,
//     requestPublishListingDraft,
//     requestImageUpload,
//     removeListingImage,
//     savePayoutDetails,
// } from '../EditListingPage/EditListingPage.duck';
import css from './AdministratorPage.module.css';
// import { fetchBusinessListing, requestCreateListing, requestUpdateListing } from './ProductListingPage.duck';
import AdministratorFormPage from './AdministratorFormPage/AdministratorFormPage';
import { ensureUser } from '../../util/data';
import { useConfiguration } from '../../context/configurationContext';

const { UUID, Money } = sdkTypes;

export const AdministratorPageComponent = (props) => {
    const config = useConfiguration();
    const {
      intl,
      params,
      onImageUpload,
      scrollingDisabled,
      disabled,
      ready,
      onChange,
      panelUpdated,
      updateInProgress,
      errors,
      listingMinimumPriceSubUnits,
      onRemoveListingImage,
      onPublishListingDraft,
      category,
      user,
    } = props;
  
    const profileUser = ensureUser(user);
    const { displayName } = profileUser?.attributes?.profile || {};
  
    const schemaTitleVars = { name: displayName, siteTitle: config.marketplaceName };
    const schemaTitle = intl?.formatMessage({ id: "ProfilePage.schemaTitle" }, schemaTitleVars);

    const tabs =  [
        {
        key : "General",
        value : "GENERAL",
        },
        {
        key : "location",
        value : "LOCATION",
        },
        {
        key : "store-hours",
        value : "STORE HOURS",
        }
        // {
        // key : "General",
        // value : "GENERAL",
        // },
        // {
        // key : "General",
        // value : "GENERAL",
        // }
    ];
  
    const renderTabContent = (category) => {
      switch (category) {
        case 'General':
          return <AdministratorFormPage
          className={css.productFormWrapper}
          setResetForm={() => setResetForm(true)}
          onSubmit={() => {}}
          onChange={onChange}
          disabled={disabled}
          category={category}
          ready={ready}
          updated={panelUpdated}
          updateInProgress={updateInProgress}
          onPublishListingDraft={onPublishListingDraft}
          fetchErrors={errors}
        />
        case 'location':
          return <Category2Form />;
        case 'store-hours':
          return <Category3Form />;
        default:
          return null;
      }
    };
  
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
            {tabs.map((item) => 
                <div onClick={() => renderTabContent(item.key)}>{item.value}</div>
            )}
          <LayoutWrapperMain>
            <h1 className={css.mainHeading}>
              <FormattedMessage id="ProductListingPage.addNewProduct" />
            </h1>
          </LayoutWrapperMain>
        </LayoutSideNavigation>
      </Page>
    );
  };
AdministratorPageComponent.defaultProps = {
    currentUser: null,
    uploadImageError: null,
    image: null,
    listing: null,
};

AdministratorPageComponent.propTypes = {
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

const AdministratorPage = compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    injectIntl
)(AdministratorPageComponent);

export default AdministratorPage;