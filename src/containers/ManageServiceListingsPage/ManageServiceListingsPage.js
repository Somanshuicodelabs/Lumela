import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { isScrollingDisabled } from '../../ducks/ui.duck';

import {
  H3,
  Page,
  PaginationLinks,
  UserNav,
  Footer,
  LayoutSingleColumn,
  LayoutSideNavigation,
  Button,
  NamedLink
} from '../../components';

import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';
import { closeListing, openListing, getOwnListingsById } from './ManageServiceListingsPage.duck';
import css from './ManageServiceListingsPage.module.css';
import ManageServiceListingsCard from './ManageServiceListingsCard/ManageServiceListingsCard';

export class ManageServiceListingsPageComponent extends Component {
  constructor(props) {
    super(props);

    this.state = { listingMenuOpen: null };
    this.onToggleMenu = this.onToggleMenu.bind(this);
  }

  onToggleMenu(listing) {
    this.setState({ listingMenuOpen: listing });
  }

  render() {
    const {
      closingListing,
      closingListingError,
      listings,
      onCloseListing,
      onOpenListing,
      openingListing,
      openingListingError,
      pagination,
      queryInProgress,
      queryListingsError,
      queryParams,
      scrollingDisabled,
      intl,
    } = this.props;

    const hasPaginationInfo = !!pagination && pagination.totalItems != null;
    const listingsAreLoaded = !queryInProgress && hasPaginationInfo;

    const loadingResults = (
      <div className={css.messagePanel}>
        <H3 as="h2" className={css.heading}>
          <FormattedMessage id="ManageListingsPage.loadingOwnListings" />
        </H3>
      </div>
    );

    const queryError = (
      <div className={css.messagePanel}>
        <H3 as="h2" className={css.heading}>
          <FormattedMessage id="ManageListingsPage.queryError" />
        </H3>
      </div>
    );

    const noResults =
      listingsAreLoaded && pagination.totalItems === 0 ? (
        <H3 as="h1" className={css.heading}>
          <FormattedMessage id="ManageListingsPage.noResults" />
        </H3>
      ) : null;

    const heading =
      listingsAreLoaded && pagination.totalItems > 0 ? (
        <H3 as="h1" className={css.heading}>
          <FormattedMessage
            id="ManageListingsPage.youHaveListings"
            values={{ count: listings.length }}
          />
        </H3>
      ) : (
        noResults
      );

    const page = queryParams ? queryParams.page : 1;
    const paginationLinks =
      listingsAreLoaded && listings && listings.length > 42 ? (
        <PaginationLinks
          className={css.pagination}
          pageName="ManageServiceListingsPage"
          pageSearchParams={{ page }}
          pagination={pagination}
        />
      ) : null;

    const listingMenuOpen = this.state.listingMenuOpen;
    const closingErrorListingId = !!closingListingError && closingListingError.listingId;
    const openingErrorListingId = !!openingListingError && openingListingError.listingId;

    const title = intl.formatMessage({ id: 'ManageServiceListingsPage.title' });

    const panelWidth = 62.5;
    // Render hints for responsive image
    const renderSizes = [
      `(max-width: 767px) 100vw`,
      `(max-width: 1920px) ${panelWidth / 2}vw`,
      `${panelWidth / 3}vw`,
    ].join(', ');

    return (
      <Page title={title} scrollingDisabled={scrollingDisabled}>
        <LayoutSideNavigation
          mainContentBox={true}
          topbar={
            <>
              <TopbarContainer
                currentPage="ManageServiceListingsPage"
                desktopClassName={css.desktopTopbar}
                mobileClassName={css.mobileTopbar}
              />
              {/* <UserNavUserNav currentPage="ManageServiceListingsPage" /> */}
            </>
          }
          sideNav={null}
          useAccountSettingsNav
          currentPage="ManageServiceListingsPage"
          footer={<Footer />}
        >
          {queryInProgress ? loadingResults : null}
          {queryListingsError ? queryError : null}
          {/* <div className={css.listingPanel}>
            {heading}
            <NamedLink name="ServiceListingPage">
              <Button><FormattedMessage id="ManageServiceListingsPage.addServices" /></Button></NamedLink>
            <div className={css.listingCards}>
              {listings.map(l => (
                <ManageServiceListingsCard
                  className={css.listingCard}
                  key={l.id.uuid}
                  listing={l}
                  isMenuOpen={!!listingMenuOpen && listingMenuOpen.id.uuid === l.id.uuid}
                  actionsInProgressListingId={openingListing || closingListing}
                  onToggleMenu={this.onToggleMenu}
                  onCloseListing={onCloseListing}
                  onOpenListing={onOpenListing}
                  hasOpeningError={openingErrorListingId.uuid === l.id.uuid}
                  hasClosingError={closingErrorListingId.uuid === l.id.uuid}
                  renderSizes={renderSizes}
                />
              ))}
            </div>
            {paginationLinks}
          </div> */}
        </LayoutSideNavigation>
      </Page>
    );
  }
}

ManageServiceListingsPageComponent.defaultProps = {
  listings: [],
  pagination: null,
  queryListingsError: null,
  queryParams: null,
  closingListing: null,
  closingListingError: null,
  openingListing: null,
  openingListingError: null,
};

const { arrayOf, bool, func, object, shape, string } = PropTypes;

ManageServiceListingsPageComponent.propTypes = {
  closingListing: shape({ uuid: string.isRequired }),
  closingListingError: shape({
    listingId: propTypes.uuid.isRequired,
    error: propTypes.error.isRequired,
  }),
  listings: arrayOf(propTypes.ownListing),
  onCloseListing: func.isRequired,
  onOpenListing: func.isRequired,
  openingListing: shape({ uuid: string.isRequired }),
  openingListingError: shape({
    listingId: propTypes.uuid.isRequired,
    error: propTypes.error.isRequired,
  }),
  pagination: propTypes.pagination,
  queryInProgress: bool.isRequired,
  queryListingsError: propTypes.error,
  queryParams: object,
  scrollingDisabled: bool.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const {
    currentPageResultIds,
    pagination,
    queryInProgress,
    queryListingsError,
    queryParams,
    openingListing,
    openingListingError,
    closingListing,
    closingListingError,
  } = state.ManageServiceListingsPage;
  const listings = getOwnListingsById(state, currentPageResultIds);
  return {
    currentPageResultIds,
    listings: listings.filter((s) => s.attributes.publicData.listingType === 'service'),
    pagination,
    queryInProgress,
    queryListingsError,
    queryParams,
    scrollingDisabled: isScrollingDisabled(state),
    openingListing,
    openingListingError,
    closingListing,
    closingListingError,
  };
};

const mapDispatchToProps = dispatch => ({
  onCloseListing: listingId => dispatch(closeListing(listingId)),
  onOpenListing: listingId => dispatch(openListing(listingId)),
});

const ManageServiceListingsPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(ManageServiceListingsPageComponent);

export default ManageServiceListingsPage;
