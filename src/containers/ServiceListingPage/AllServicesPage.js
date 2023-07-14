import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import { bool, func, object, shape, string } from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';

import { useConfiguration } from '../../context/configurationContext';
import { Page, Footer,LayoutSideNavigation, ProductsCard, PrimaryButton, NamedLink} from '../../components';
import TopbarContainer from '../TopbarContainer/TopbarContainer';

import { isScrollingDisabled } from '../../ducks/ui.duck';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { propTypes } from '../../util/types';
import { ensureCurrentUser, ensureUser } from '../../util/data';
import { fetchCurrentListing } from './ServiceListingPage.duck';
import css from './ServiceListingPage.module.css';
import { getOwnListingsById } from '../ManageListingsPage/ManageListingsPage.duck';
import ServicesCard from '../../components/ServiceCard/ServicesCard';

export const AllServicesPageComponent = props => {
    const config = useConfiguration();
    const {
        intl,
        scrollingDisabled,
        currentUser,
        user,
        onfetchCurrentListing,
        ownListings,
    } = props;
    const [filterText, setFilterText] = useState('');
    const filteredListings = ownListings.filter((listing) => {
        const title = listing.attributes.title.toLowerCase();
        return title.includes(filterText.toLowerCase());
    });

    const handleFilterChange = (event) => {
        setFilterText(event.target.value);
    };
    const ensuredCurrentUser = ensureCurrentUser(currentUser);
    const profileUser = ensureUser(user);
    const isCurrentUser =
        ensuredCurrentUser.id && profileUser.id && ensuredCurrentUser.id.uuid === profileUser.id.uuid;
    const { bio, displayName } = profileUser?.attributes?.profile || {};

    const schemaTitleVars = { name: displayName, siteTitle: config.marketplaceName };

    const schemaTitle = intl?.formatMessage({ id: "ProfilePage.schemaTitle" }, schemaTitleVars);

    useEffect(() => {
        onfetchCurrentListing().then(res => res)
    }, [])

    const input = 'example';

    // const filteredListings = ownListings.filter(listing => {
    //     return listing.attributes.title.includes(input);
    //   });
    //   console.log('filteredListings :>> ', filteredListings);



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
                    <NamedLink name="ServiceListingPage"   >
                        <PrimaryButton>ADD NEW SERVICE </PrimaryButton>
                    </NamedLink>


                    <div>
                        <input type="text" placeholder="Search" value={filterText} onChange={handleFilterChange} />
                        {/* Use the filteredListings as needed */}
                        <div className={css.productCardList}>
                            {filteredListings
                                .filter((item) => item?.attributes?.publicData?.listingType === 'service')
                                .map((item, index) => (
                                    <ServicesCard
                                        key={index}
                                        // productImage={item?.images[0]?.attributes?.variants?.['square-small2x']?.url}
                                        serviceHeading={item?.attributes?.title}
                                        serviceMins={item?.attributes?.publicData?.mins}
                                        serviceDes={item?.attributes?.publicData?.shortDescription}
                                        servicePrice={'$' + item?.attributes?.price?.amount / 100}
                                        status= {item?.attributes?.state}
                                        id={item?.id}
                                    />
                                ))}
                        </div>
                    </div>


                </div>
            </LayoutSideNavigation>
        </Page>
    )
}

AllServicesPageComponent.defaultProps = {
    currentUser: null,
    uploadImageError: null,
    image: null,
};

AllServicesPageComponent.propTypes = {
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
    const { currentUser } = state.user,
        { currentPageResultIds } = state.ServiceListingPage;

    const getOwnListing = id => {
        const listings = getMarketplaceEntities(state, [{ id, type: 'ownListing' }]);
        return listings.length === 1 ? listings[0] : null;
    };

    const ownListings = getOwnListingsById(state, currentPageResultIds)


    // const getListing = id => {
    //     console.log('id :>> ', id);
    //     const ref = { id, type: 'listing' };
    //     const listings = getMarketplaceEntities(state, [ref]);
    //     return listings.length === 1 ? listings[0] : null;
    //   };

    return {
        state,
        currentUser,
        getOwnListing,
        ownListings,
        // getListing,
        scrollingDisabled: isScrollingDisabled(state),
        currentPageResultIds,
    };
};

const mapDispatchToProps = dispatch => ({
    onfetchCurrentListing: (listingId) => dispatch(fetchCurrentListing(listingId)),

});

const AllServicesPage = compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    injectIntl
)(AllServicesPageComponent);

export default AllServicesPage;
