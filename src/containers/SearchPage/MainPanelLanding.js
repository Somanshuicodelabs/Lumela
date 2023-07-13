import React, { Component } from 'react';
import { array, arrayOf, bool, func, number, object, oneOf, shape, string } from 'prop-types';
import classNames from 'classnames';
import omit from 'lodash/omit';
import { createResourceLocatorString } from '../../util/routes';
import { isAnyFilterActive, isMainSearchTypeKeywords, isOriginInUse } from '../../util/search';
import { propTypes } from '../../util/types';

import FilterComponent from './FilterComponent';
import css from './SearchPage.module.css';
import { useConfiguration } from '../../context/configurationContext';
import { useRouteConfiguration } from '../../context/routeConfigurationContext';
import { useIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import SearchFiltersPrimary from './SearchFiltersPrimary/SearchFiltersPrimary';
import SortBy from './SortBy/SortBy';
import { intlShape } from '../../util/reactIntl';
import { getListingsById } from '../../ducks/marketplaceData.duck';
import { isScrollingDisabled } from '../../ducks/ui.duck';
import { cleanSearchFromConflictingParams, createSearchResultSchema, groupListingFieldConfigs, initialValues, searchParamsPicker, validFilterParams, validUrlQueryParamsFromProps } from './SearchPage.shared';
import TopbarSearchForm from '../../components/Topbar/TopbarSearchForm/TopbarSearchForm';
import { parse } from '../../util/urlHelpers';
import { Button } from '../../components';
import MainPanelHeader from './MainPanelHeader/MainPanelHeader';
import NoSearchResultsMaybe from './NoSearchResultsMaybe/NoSearchResultsMaybe';

// Primary filters have their content in dropdown-popup.
// With this offset we move the dropdown to the left a few pixels on desktop layout.
const MODAL_BREAKPOINT = 768; // Search is in modal on mobile layout
const SEARCH_WITH_MAP_DEBOUNCE = 300; // Little bit of debounce before search is initiated.
const FILTER_DROPDOWN_OFFSET = -14;

class MainPanelLandingComponent extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   isSecondaryFiltersOpen: false,
    //   currentQueryParams: props.urlQueryParams,
    //   isplain: false,
    // };
    this.state = {
      isSecondaryFiltersOpen: false,
      currentQueryParams: { ...props.urlQueryParams },
      keyword: ''
    };
    this.applyFilters = this.applyFilters.bind(this);
    this.cancelFilters = this.cancelFilters.bind(this);
    this.resetAll = this.resetAll.bind(this);

    this.initialValues = this.initialValues.bind(this);
    this.getHandleChangedValueFn = this.getHandleChangedValueFn.bind(this);

    // SortBy
    this.handleSortBy = this.handleSortBy.bind(this);
  }


  handleSubmit(values) {
    const { currentSearchParams } = this.props;
    console.log('currentSearchParams', currentSearchParams)
    const { history, config, routeConfiguration } = this.props;

    const topbarSearchParams = () => {
      if (isMainSearchTypeKeywords(config)) {
        return { keywords: values?.keywords };
      }
      // topbar search defaults to 'location' search
      const { search, selectedPlace } = values?.location;
      const { origin, bounds } = selectedPlace;
      const originMaybe = isOriginInUse(config) ? { origin } : {};

      return {
        ...originMaybe,
      
        address: search,
        bounds,
      };
    };
    const searchParams = {
      ...currentSearchParams,
      ...topbarSearchParams(),
    };
    this.setState({ currentQueryParams: { ...this.state.currentQueryParams, ...searchParams } })
  }

  // Apply the filters by redirecting to SearchPage with new filters.
  applyFilters() {
    const { history, routeConfiguration, config } = this.props;
    const { listingFields: listingFieldsConfig } = config?.listing || {};
    const { defaultFilters: defaultFiltersConfig, sortConfig } = config?.search || {};

    const urlQueryParams = validUrlQueryParamsFromProps(this.props);
    const searchParams = { ...urlQueryParams, ...this.state.currentQueryParams };
    const search = cleanSearchFromConflictingParams(
      searchParams,
      listingFieldsConfig,
      defaultFiltersConfig,
      sortConfig
    );

    history.push(createResourceLocatorString('SearchPage', routeConfiguration, {}, search));
  }

  // Close the filters by clicking cancel, revert to the initial params
  cancelFilters() {
    this.setState({ currentQueryParams: {} });
  }

  // Reset all filter query parameters
  resetAll(e) {
    const { history, routeConfiguration, config } = this.props;
    const { listingFields: listingFieldsConfig } = config?.listing || {};
    const { defaultFilters: defaultFiltersConfig } = config?.search || {};

    const urlQueryParams = validUrlQueryParamsFromProps(this.props);
    const filterQueryParamNames = getQueryParamNames(listingFieldsConfig, defaultFiltersConfig);

    // Reset state
    this.setState({ currentQueryParams: {} });

    // Reset routing params
    const queryParams = omit(urlQueryParams, filterQueryParamNames);
    history.push(createResourceLocatorString('SearchPage', routeConfiguration, {}, queryParams));
  }

  initialValues(queryParamNames) {
    // Query parameters that are visible in the URL
    const urlQueryParams = this.props.urlQueryParams;
    // Query parameters that are in state (user might have not yet clicked "Apply")
    const currentQueryParams = this.state.currentQueryParams;

    // Get initial value for a given parameter from state if its there.
    const getInitialValue = paramName => {
      const currentQueryParam = currentQueryParams[paramName];
      const hasQueryParamInState = typeof currentQueryParam !== 'undefined';
      return hasQueryParamInState ? currentQueryParam : urlQueryParams[paramName];
    };

    // Return all the initial values related to given queryParamNames
    // InitialValues for "amenities" filter could be
    // { amenities: "has_any:towel,jacuzzi" }
    const isArray = Array.isArray(queryParamNames);
    return isArray
      ? queryParamNames.reduce((acc, paramName) => {
        return { ...acc, [paramName]: getInitialValue(paramName) };
      }, {})
      : {};
  }

  getHandleChangedValueFn(useHistoryPush) {
    const { history, routeConfiguration, config } = this.props;
    const { listingFields: listingFieldsConfig } = config?.listing || {};
    const { defaultFilters: defaultFiltersConfig, sortConfig } = config?.search || {};

    const urlQueryParams = validUrlQueryParamsFromProps(this.props);

    console.log('this.state.currentQueryParams', this.state.currentQueryParams)
    return updatedURLParams => {
      const updater = prevState => {
        const { address, bounds, keywords } = urlQueryParams;
        const mergedQueryParams = { ...urlQueryParams, ...prevState.currentQueryParams };

        // Address and bounds are handled outside of MainPanel.
        // I.e. TopbarSearchForm && search by moving the map.
        // We should always trust urlQueryParams with those.
        // The same applies to keywords, if the main search type is keyword search.
        const keywordsMaybe = isMainSearchTypeKeywords(config) ? { keywords } : {};
        return {
          currentQueryParams: {
            ...mergedQueryParams,
            ...updatedURLParams,
            ...keywordsMaybe,
            address,
            bounds,
          },
        };
      };

      const callback = () => {
        if (useHistoryPush) {
          const searchParams = this.state.currentQueryParams;
          const search = cleanSearchFromConflictingParams(
            searchParams,
            listingFieldsConfig,
            defaultFiltersConfig,
            sortConfig
          );
          history.push(createResourceLocatorString('SearchPage', routeConfiguration, {}, search));
        }
      };

      this.setState(updater, callback);
    };
  }

  handleSortBy(urlParam, values) {
    const { history, routeConfiguration } = this.props;
    const urlQueryParams = validUrlQueryParamsFromProps(this.props);

    const queryParams = values
      ? { ...urlQueryParams, [urlParam]: values }
      : omit(urlQueryParams, urlParam);

    history.push(createResourceLocatorString('SearchPage', routeConfiguration, {}, queryParams));
  }

  render() {
    const {
      intl,
      listings,
      location,
      searchParams,
      routeConfiguration,
      config,
      history,
      pagination,
      scrollingDisabled,
      searchInProgress,
      searchListingsError,
      currentSearchParams,
      activeListingId,
      onActivateListing,
    } = this.props;
    console.log('currentSearchParams', this.state.currentQueryParams)
    const { listingFields: listingFieldsConfig } = config?.listing || {};
    const { defaultFilters: defaultFiltersConfig, sortConfig } = config?.search || {};

    const activeListingTypes = config?.listing?.listingTypes.map(config => config.listingType);
    const marketplaceCurrency = config.currency;
    const { keywords, address, origin, bounds } = parse(location.search, {
      latlng: ['origin'],
      latlngBounds: ['bounds'],
    });
    const topbarSearcInitialValues = () => {
      if (isMainSearchTypeKeywords(config)) {
        return { keywords };
      }

      // Only render current search if full place object is available in the URL params
      const locationFieldsPresent = isOriginInUse(config)
        ? address && origin && bounds
        : address && bounds;
      return {
        location: locationFieldsPresent
          ? {
            search: address,
            selectedPlace: { address, origin, bounds },
          }
          : null,
      };
    };
    const initialSearchFormValues = topbarSearcInitialValues();

    // Page transition might initially use values from previous search
    // urlQueryParams doesn't contain page specific url params
    // like mapSearch, page or origin (origin depends on config.maps.search.sortSearchByDistance)

    const { searchParamsAreInSync, urlQueryParams, searchParamsInURL } = searchParamsPicker(
      location.search,
      searchParams,
      listingFieldsConfig,
      defaultFiltersConfig,
      sortConfig,
      isOriginInUse(config)
    );

    const validQueryParams = validFilterParams(
      searchParamsInURL,
      listingFieldsConfig,
      defaultFiltersConfig,
      false
    );

    // Page transition might initially use values from previous search
    // urlQueryParams doesn't contain page specific url params
    // like mapSearch, page or origin (origin depends on config.maps.search.sortSearchByDistance)
    const isWindowDefined = typeof window !== 'undefined';
    const isMobileLayout = isWindowDefined && window.innerWidth < MODAL_BREAKPOINT;
    const shouldShowSearchMap =
      !isMobileLayout || (isMobileLayout && this.state.isSearchMapOpenOnMobile);

    const isKeywordSearch = isMainSearchTypeKeywords(config);
    const defaultFilters = isKeywordSearch
      ? defaultFiltersConfig.filter(f => f.key !== 'keywords')
      : defaultFiltersConfig;
    const [customPrimaryFilters, customSecondaryFilters] = groupListingFieldConfigs(
      listingFieldsConfig,
      activeListingTypes
    );
    const availablePrimaryFilters = [...customPrimaryFilters,];
    const availableFilters = [
      ...customPrimaryFilters,
      ...defaultFilters,
      ...customSecondaryFilters,
    ];

    const hasSecondaryFilters = !!(customSecondaryFilters && customSecondaryFilters.length > 0);
    const selectedFilters = validFilterParams(
      validQueryParams,
      listingFieldsConfig,
      defaultFiltersConfig
    );
    const keysOfSelectedFilters = Object.keys(selectedFilters);
    const selectedFiltersCountForMobile = isKeywordSearch
      ? keysOfSelectedFilters.filter(f => f !== 'keywords').length
      : keysOfSelectedFilters.length;
    const isValidDatesFilter =
      searchParamsInURL.dates == null ||
      (searchParamsInURL.dates != null && searchParamsInURL.dates === selectedFilters.dates);
    // Selected aka active filters

    // Selected aka active secondary filters
    const selectedSecondaryFilters = hasSecondaryFilters
      ? validFilterParams(validQueryParams, customSecondaryFilters, [])
      : {};
    const selectedSecondaryFiltersCount = Object.keys(selectedSecondaryFilters).length;

    const isSecondaryFiltersOpen = !!hasSecondaryFilters && this.state.isSecondaryFiltersOpen;
    const propsForSecondaryFiltersToggle = hasSecondaryFilters
      ? {
        isSecondaryFiltersOpen: this.state.isSecondaryFiltersOpen,
        toggleSecondaryFiltersOpen: isOpen => {
          this.setState({ isSecondaryFiltersOpen: isOpen, currentQueryParams: {} });
        },
        selectedSecondaryFiltersCount,
      }
      : {};

    const hasPaginationInfo = !!pagination && pagination.totalItems != null;
    const totalItems =
      searchParamsAreInSync && hasPaginationInfo
        ? pagination.totalItems
        : pagination?.paginationUnsupported
          ? listings.length
          : 0;
    const listingsAreLoaded =
      !searchInProgress &&
      searchParamsAreInSync &&
      !!(hasPaginationInfo || pagination?.paginationUnsupported);

    const conflictingFilterActive = isAnyFilterActive(
      sortConfig.conflictingFilters,
      validQueryParams,
      listingFieldsConfig,
      defaultFiltersConfig
    );
    const sortBy = mode => {
      return sortConfig.active ? (
        <SortBy
          sort={validQueryParams[sortConfig.queryParamName]}
          isConflictingFilterActive={!!conflictingFilterActive}
          hasConflictingFilters={!!(sortConfig.conflictingFilters?.length > 0)}
          selectedFilters={selectedFilters}
          onSelect={this.handleSortBy}
          showAsPopup
          mode={mode}
          contentPlacementOffset={FILTER_DROPDOWN_OFFSET}
        />
      ) : null;
    };
    const noResultsInfo = (
      <NoSearchResultsMaybe
        listingsAreLoaded={listingsAreLoaded}
        totalItems={totalItems}
        location={location}
        resetAll={this.resetAll}
      />
    );

    // const { bounds, origin } = searchParamsInURL || {};
    const { title, description, schema } = createSearchResultSchema(
      listings,
      searchParamsInURL || {},
      intl,
      routeConfiguration,
      config
    );
    const handleKeywordSearch = (e) => {
      this.setState({
        keyword: e.target.value,
        currentQueryParams: {
          ...this.state.currentQueryParams,
          keywords: e.target.value
        }
      })
    }

    console.log(this.state.keyword)
    // Set topbar class based on if a modal is open in
    // a child component
    const topbarClasses = this.state.isMobileModalOpen
      ? classNames(css.topbarBehindModal, css.topbar)
      : css.topbar;

    return (
      <div className={css.searchBarHero}>
        <MainPanelHeader
          className={css.mainPanelMapVariant}
          // sortByComponent={sortBy('desktop')}
          isSortByActive={sortConfig.active}
          listingsAreLoaded={listingsAreLoaded}
          resultsCount={totalItems}
          searchInProgress={searchInProgress}
          searchListingsError={searchListingsError}
          noResultsInfo={noResultsInfo}
          pageName="LandingPage"
          isLandingSearch={true}
        >
          <SearchFiltersPrimary
            className={css.startFilter}
          // {...propsForSecondaryFiltersToggle}
          >
            {/* {availablePrimaryFilters.map(config => {
            return (
              <FilterComponent
                key={`SearchFiltersPrimary.${config.key}`}
                idPrefix="SearchFiltersPrimary"
                config={config}
                marketplaceCurrency={marketplaceCurrency}
                urlQueryParams={validQueryParams}
                initialValues={initialValues(this.props, this.state.currentQueryParams)}
                // getHandleChangedValueFn={(e) => this.setState({ currentQueryParams: { ...this.state.currentQueryParams, ...e } })}
                intl={intl}
                showAsPopup
                contentPlacementOffset={FILTER_DROPDOWN_OFFSET}
              />
            );
          })} */}
            <TopbarSearchForm
              className={css.searchLink}
              desktopInputRoot={css.topbarSearchWithLeftPadding}
              onSubmit={this.handleSubmit}
              isKeywordsSearch={true}
              initialValues={initialSearchFormValues}
              appConfig={config}
            />

            <input
              className={css.keywordInput}
              value={this.state.keyword}
              placeholder="Keywords"
              onChange={handleKeywordSearch}
            />
          </SearchFiltersPrimary>
        </MainPanelHeader>
        <Button
          className={css.searchButton}
          onClick={() => {
            history.push(createResourceLocatorString('SearchPage', routeConfiguration, {}, this.state.currentQueryParams));
          }}
        >
          Search listings
        </Button>
      </div>
    );
  }
}

MainPanelLandingComponent.defaultProps = {
  listings: [],
  pagination: null,
  searchListingsError: null,
  searchParams: {},
  tab: 'listings',
  activeListingId: null,
};

MainPanelLandingComponent.propTypes = {
  listings: array,
  onActivateListing: func.isRequired,
  onManageDisableScrolling: func.isRequired,
  pagination: propTypes.pagination,
  scrollingDisabled: bool.isRequired,
  searchInProgress: bool.isRequired,
  searchListingsError: propTypes.error,
  searchParams: object,
  tab: oneOf(['filters', 'listings', 'map']).isRequired,

  // from useHistory
  history: shape({
    push: func.isRequired,
  }).isRequired,
  // from useLocation
  location: shape({
    search: string.isRequired,
  }).isRequired,

  // from useIntl
  intl: intlShape.isRequired,

  // from useConfiguration
  config: object.isRequired,

  // from useRouteConfiguration
  routeConfiguration: arrayOf(propTypes.route).isRequired,
};

const EnhancedSearchPage = props => {
  const config = useConfiguration();
  const routeConfiguration = useRouteConfiguration();
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();

  return (
    <MainPanelLandingComponent
      config={config}
      routeConfiguration={routeConfiguration}
      intl={intl}
      history={history}
      location={location}
      {...props}
    />
  );
};

const mapStateToProps = state => {
  const {
    currentPageResultIds,
    pagination,
    searchInProgress,
    searchListingsError,
    searchParams,
    activeListingId,
  } = state.SearchPage;
  const listings = getListingsById(state, currentPageResultIds);

  return {
    listings,
    pagination,
    scrollingDisabled: isScrollingDisabled(state),
    searchInProgress,
    searchListingsError,
    searchParams,
    activeListingId,
  };
};

const mapDispatchToProps = dispatch => ({
  onManageDisableScrolling: (componentId, disableScrolling) =>
    dispatch(manageDisableScrolling(componentId, disableScrolling)),
  onActivateListing: listingId => dispatch(setActiveListing(listingId)),
});

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const MainPanelLanding = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(EnhancedSearchPage);

export default MainPanelLanding;
