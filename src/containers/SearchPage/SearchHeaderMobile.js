import React, { Component } from 'react';
import { array, bool, func, number, object, shape, string } from 'prop-types';
import classNames from 'classnames';
import omit from 'lodash/omit';
import { search as searchConfigMaps } from '../../config/configMaps';
import { listingFields } from '../../config/configListing';
import { sortConfig } from '../../config/configSearch';
import routeConfiguration from '../../routing/routeConfiguration';
import { FormattedMessage } from 'react-intl';
import { createResourceLocatorString } from '../../util/routes';
import { isAnyFilterActive } from '../../util/search';
import { propTypes } from '../../util/types';
import SortBy from '../../containers/SearchPage/SortBy/SortBy';
import SearchFiltersPrimary from '../../containers/SearchPage/SearchFiltersPrimary/SearchFiltersPrimary';

import FilterComponent from './FilterComponent';
import { validFilterParams } from '../SearchPage/SearchPage.shared';

import css from './SearchPage.module.css';
import IconGridView from '../../components/IconGridView/IconGridView';
import IconListView from '../../components/IconListView/IconListView';
import IconLocationPin from '../../components/IconLocationPin/IconLocationPin';
import IconSearchGlass from '../../components/IconSearchGlass/IconSearchGlass';
import TopbarSearchForm from '../../components/Topbar/TopbarSearchForm/TopbarSearchForm';
import { decodeLatLngBounds, parseFloatNum } from '../../util/urlHelpers';

import popularCategoryMobileImg1 from '../../assets/popular-mobile-image-1.png';
import popularCategoryMobileImg2 from '../../assets/popular-mobile-image-2.png';
import popularCategoryMobileImg3 from '../../assets/popular-mobile-image-3.png';
import popularCategoryMobileImg4 from '../../assets/popular-mobile-image-4.png';
import popularCategoryMobileImg5 from '../../assets/popular-mobile-image-5.png';

// import Drawer from 'react-modern-drawer';
// import '../../styles/react-modern-drawer.css';
// import { getFilterValues } from './SearchPage.duck';
import { withRouter } from 'react-router-dom';
import { Button } from '../../components';

// Primary filters have their content in dropdown-popup.
// With this offset we move the dropdown to the left a few pixels on desktop layout.
const FILTER_DROPDOWN_OFFSET = -14;

const cleanSearchFromConflictingParams = (searchParams, sortConfig, filterConfig) => {
    // Single out filters that should disable SortBy when an active
    // keyword search sorts the listings according to relevance.
    // In those cases, sort parameter should be removed.
    const sortingFiltersActive = isAnyFilterActive(
        sortConfig.conflictingFilters,
        searchParams,
        filterConfig
    );
    return sortingFiltersActive
        ? { ...searchParams, [sortConfig.queryParamName]: null }
        : searchParams;
};

/**
 * SearchHeaderMobile contains search results and filters.
 * There are 3 presentational container-components that show filters:
 * SearchfiltersMobile, SearchFiltersPrimary, and SearchFiltersSecondary.
 * The last 2 are for desktop layout.
 */
class SearchHeaderMobile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSecondaryFiltersOpen: false,
            currentQueryParams: props.urlQueryParams,
            isPlain: false,
            height: 0,
            mapToggle: false,
            isFilterDrawerOpen: false,
            isResetAll: false,
            isDivVisible: true,
        };
        this.resizeHandler = this.resizeHandler.bind(this);
        this.toggleFilterDrawer = this.toggleFilterDrawer.bind(this);
        this.applyFilters = this.applyFilters.bind(this);
        this.cancelFilters = this.cancelFilters.bind(this);
        this.resetAll = this.resetAll.bind(this);

        this.initialValues = this.initialValues.bind(this);
        this.getHandleChangedValueFn = this.getHandleChangedValueFn.bind(this);

        // SortBy
        this.handleSortBy = this.handleSortBy.bind(this);

        this.divElement = React.createRef();
    }
    toggleFilterDrawer = () => {
        this.setState({ isFilterDrawerOpen: !this.state.isFilterDrawerOpen });
    };
    resizeHandler() {
        const height = this.divElement && this.divElement.clientHeight;
        if (this.state.height != height) {
            this.setState({ height });
        }
    }

    componentDidUpdate() {
        this.resizeHandler();
    }
    componentDidMount() {
        this.resizeHandler();
        window.addEventListener('resize', this.resizeHandler);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeHandler);
    }
    // Apply the filters by redirecting to SearchPage with new filters.
    applyFilters() {
        const { history, urlQueryParams, sortConfig, filterConfig } = this.props;
        const searchParams = { ...urlQueryParams, ...this.state.currentQueryParams };
        const search = cleanSearchFromConflictingParams(searchParams, sortConfig, filterConfig);

        history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, search));
    }

    // Close the filters by clicking cancel, revert to the initial params
    cancelFilters() {
        this.setState({ currentQueryParams: {} });
    }

    // Reset all filter query parameters
    resetAll(e) {
        const { urlQueryParams, history, filterConfig } = this.props;
        const filterQueryParamNames = filterConfig.map(f => f.queryParamNames);

        // Reset state
        this.setState({ currentQueryParams: {} });

        // Reset routing params
        const queryParams = omit(urlQueryParams, filterQueryParamNames);
        history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, queryParams));
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
        const FilterData = getFilterValues(urlQueryParams);

        return isArray
            ? queryParamNames.reduce((acc, paramName) => {
                return {
                    ...acc,
                    [paramName]:
                        FilterData && paramName == 'keywords'
                            ? FilterData + (getInitialValue(paramName) ? ' ' + getInitialValue(paramName) : '')
                            : getInitialValue(paramName),
                };
            }, {})
            : {};
    }

    getHandleChangedValueFn(useHistoryPush) {
        const { urlQueryParams, history, sortConfig, filterConfig } = this.props;

        return updatedURLParams => {
            const updater = prevState => {
                const { address, bounds } = urlQueryParams;
                const mergedQueryParams = { ...urlQueryParams, ...prevState.currentQueryParams };

                // Address and bounds are handled outside of SearchHeaderMobile.
                // I.e. TopbarSearchForm && search by moving the map.
                // We should always trust urlQueryParams with those.
                return {
                    currentQueryParams: { ...mergedQueryParams, ...updatedURLParams, address, bounds },
                };
            };

            const callback = () => {
                if (useHistoryPush) {
                    const searchParams = this.state.currentQueryParams;
                    const search = cleanSearchFromConflictingParams(searchParams, sortConfig, filterConfig);
                    history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, search));
                }
            };

            this.setState(updater, callback);
        };
    }

    handleSortBy(urlParam, values) {
        const { history, urlQueryParams } = this.props;
        const queryParams = values
            ? { ...urlQueryParams, [urlParam]: values }
            : omit(urlQueryParams, urlParam);

        history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, queryParams));
    }

    // Reset all filter query parameters
    handleResetAll(e) {
        window.location.href = '/s';
        this.setState({ isResetAll: true });
        setTimeout(() => {
            this.resetAll(e, 'true');
        }, 200);

        // blur event target if event is passed
        if (e && e.currentTarget) {
            e.currentTarget.blur();
        }
    }
    render() {
        const {
            className,
            rootClassName,
            urlQueryParams,
            listings,
            searchInProgress,
            searchListingsError,
            searchParamsAreInSync,
            pagination,
            filterConfig,
            sortConfig,
            isMapShow,
            showHideMap,
            isSearchPage,
            viewport,
            onMapIconClick,
            initialSearchFormValues,
            showAsModalMaxWidth,
            onManageDisableScrolling,
            onOpenModal,
            onCloseModal,
            currentUser,
            history,
            currentSearchParams,
        } = this.props;

        const handleToggleMap = () => {
            onMapIconClick();

            this.setState(prevState => ({ mapToggle: !prevState.mapToggle }));
        };
        const url = history.location.search;
        const params = new URLSearchParams(url);
        // const pubCategory = params?.getAll('');

        const primaryFilters = filterConfig.filter(f => f.group === 'primary');
        const secondaryFilters = filterConfig.filter(f => f.group !== 'secondary');

        const hasSecondaryFilters = !!(secondaryFilters && secondaryFilters.length > 0);

        // Selected aka active filters
        const selectedFilters = validFilterParams(urlQueryParams, filterConfig);
        const selectedFiltersCount = Object.keys(selectedFilters).length;

        // Selected aka active secondary filters
        const selectedSecondaryFilters = hasSecondaryFilters
            ? validFilterParams(urlQueryParams, secondaryFilters)
            : {};
        let selectedSecondaryFiltersCount = 0,
            selectedSecondaryCanDoFiltersCount = 0;

        for (const key in selectedSecondaryFilters) {
            if (Object.hasOwnProperty.call(selectedSecondaryFilters, key)) {
                const element = selectedSecondaryFilters[key];
                if (key == 'pub_canDo') {
                    selectedSecondaryCanDoFiltersCount += element.split(',').length;
                } else {
                    selectedSecondaryFiltersCount += element.split(',').length;
                }
            }
        }

        const isSecondaryFiltersOpen = !!hasSecondaryFilters && this.state.isSecondaryFiltersOpen;
        const propsForSecondaryFiltersToggle = hasSecondaryFilters
            ? {
                isSecondaryFiltersOpen: this.state.isSecondaryFiltersOpen,
                toggleSecondaryFiltersOpen: (isOpen, filterKey = '') => {
                    this.setState({ isSecondaryFiltersOpen: isOpen, filterKeyBtn: filterKey });
                },
                selectedSecondaryFiltersCount,
                selectedSecondaryCanDoFiltersCount,
            }
            : {};

        const { search } = window.location;
        const urlParam = new URLSearchParams(search);

        const parse = (search, options = {}) => {
            const { latlng = [], latlngBounds = [] } = options;
            const params = Object.fromEntries(urlParam.entries());

            return Object.entries(params).reduce((result, [key, val]) => {
                if (latlng.includes(key)) {
                    result[key] = decodeLatLng(val);
                } else if (latlngBounds.includes(key)) {
                    result[key] = decodeLatLngBounds(val);
                } else if (val === 'true') {
                    result[key] = true;
                } else if (val === 'false') {
                    result[key] = false;
                } else {
                    const num = parseFloatNum(val);
                    result[key] = num === null ? val : num;
                }

                return result;
            }, {});
        };

        const urlParamResult = parse(search);

        // With time-based availability filtering, pagination is NOT
        // supported. In these cases we get the pagination support info in
        // the response meta object, and we can use the count of listings
        // as the result count.
        //
        // See: https://www.sharetribe.com/api-reference/marketplace.html#availability-filtering
        const hasPaginationInfo = !!pagination && !pagination.paginationUnsupported;
        const listingsLength = listings ? listings.length : 0;
        const totalItems =
            searchParamsAreInSync && hasPaginationInfo ? pagination.totalItems : listingsLength;

        const listingsAreLoaded = !searchInProgress && searchParamsAreInSync;

        const sortBy = mode => {
            const conflictingFilterActive = isAnyFilterActive(
                sortConfig.conflictingFilters,
                urlQueryParams,
                filterConfig
            );

            const mobileClassesMaybe =
                mode === 'mobile'
                    ? {
                        rootClassName: css.sortBy,
                        menuLabelRootClassName: css.sortByMenuLabel,
                    }
                    : {};
            return sortConfig.active ? (
                <SortBy
                    {...mobileClassesMaybe}
                    sort={urlQueryParams[sortConfig.queryParamName]}
                    isConflictingFilterActive={!!conflictingFilterActive}
                    onSelect={this.handleSortBy}
                    showAsPopup
                    resetAll={this.resetAll}
                    contentPlacementOffset={FILTER_DROPDOWN_OFFSET}
                />
            ) : null;
        };

        const classes = classNames(rootClassName || css.mobileSearchHeader, className);

        return (
            <div className={classes} style={{ paddingTop: this.state.height }}>
                <div
                    className={css.searchFilterStickSection}
                    ref={divElement => {
                        this.divElement = divElement;
                    }}
                >
                    <div className={css.searchFilterSection}>
                        <div className={css.searchBoxWrapper}>
                            <div className={css.searchforAny}>
                                {primaryFilters.map(listingFields => {
                                    return listingFields.id === 'keyword' ? (
                                        <FilterComponent
                                            key={`SearchFiltersPrimary.${listingFields.id}`}
                                            idPrefix="SearchFiltersPrimary"
                                            filterConfig={filterConfig}
                                            isplain={true}
                                            pageName={'SearchPage'}
                                            urlQueryParams={urlQueryParams}
                                            initialValues={this.initialValues}
                                            getHandleChangedValueFn={this.getHandleChangedValueFn}
                                            showAsPopup
                                            contentPlacementOffset={FILTER_DROPDOWN_OFFSET}
                                            isSearchFilters={true}
                                            isMobileSearchHeader={true}
                                        />
                                    ) : null;
                                })}{' '}
                                <div className={css.allFiltersDiv}>
                                    <div className={css.showMap} onClick={handleToggleMap}>
                                        <span className={css.listIcon}>
                                            {!this.state.mapToggle ? <IconGridView /> : <IconListView />}{' '}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={css.searchforCon}>
                                <div className={css.searchLeft}>
                                    <TopbarSearchForm
                                        className={css.searchLink}
                                        desktopInputRoot={css.topbarSearchWithLeftPadding}
                                        onSubmit={e => {
                                            this.setState({
                                                currentQueryParams: { ...this.state.currentQueryParams, ...e },
                                            });
                                        }}
                                        // defaultLocation={defaultLocation}
                                        initialValues={initialSearchFormValues}
                                        isSearchFilters={true}
                                    />
                                    <Button
                                        onClick={() => {
                                            if (this.state.currentQueryParams.location) {
                                                const { search, selectedPlace } = this.state.currentQueryParams.location;
                                                const { origin, bounds } = selectedPlace;
                                                const originMaybe = searchConfigMaps.sortSearchByDistance ? { origin } : {};
                                                const searchParams = {
                                                    ...this.state.currentQueryParams,
                                                    ...currentSearchParams,
                                                    ...originMaybe,
                                                    address: search,
                                                    bounds,
                                                };

                                                history.push(
                                                    createResourceLocatorString(
                                                        'SearchPage',
                                                        routeConfiguration(),
                                                        {},
                                                        searchParams
                                                    )
                                                );
                                            } else {
                                                history.push(
                                                    createResourceLocatorString(
                                                        'SearchPage',
                                                        routeConfiguration(),
                                                        {},
                                                        this.state.currentQueryParams
                                                    )
                                                );
                                            }
                                        }}
                                        className={classNames(css.heroButton, isSearchPage && css.searchLocationButton)}
                                    >
                                        {viewport.width < 550 && viewport.width && !isSearchPage ? 'Search' : 'Apply'}
                                    </Button>
                                </div>
                            </div>
                            {/* !urlParamResult?.pub_category */}
                            {!this.state.mapToggle && (
                                <SearchFiltersPrimary
                                    className={css.searchFiltersMobile}
                                    filterConfig={filterConfig}
                                    sortByComponent={sortBy('mobile')}
                                    listingsAreLoaded={listingsAreLoaded}
                                    resultsCount={totalItems}
                                    currentUser={currentUser}
                                    searchInProgress={searchInProgress}
                                    searchListingsError={searchListingsError}
                                    urlQueryParams={urlQueryParams}
                                    onManageDisableScrolling={onManageDisableScrolling}
                                    applyFilters={this.applyFilters}
                                    cancelFilters={this.cancelFilters}
                                    resetAll={this.resetAll}
                                    onClosePanel={() =>
                                        this.setState({ isSecondaryFiltersOpen: false, filterKeyBtn: '' })
                                    }
                                    secondaryFilters={secondaryFilters}
                                    onClick={e => this.handleResetAll(e)}
                                    initialValues={this.initialValues}
                                    getHandleChangedValueFn={this.getHandleChangedValueFn}
                                    filterKeyBtn={this.state.filterKeyBtn}
                                    {...propsForSecondaryFiltersToggle}
                                >
                                    {primaryFilters.map(config => (
                                        <FilterComponent
                                            key={`SearchFiltersMobile.${config.id}`}
                                            idPrefix="SearchFiltersPrimary"
                                            filterConfig={filterConfig}
                                            isplain={true}
                                            pageName={'SearchPage'}
                                            onManageDisableScrolling={onManageDisableScrolling}
                                            urlQueryParams={urlQueryParams}
                                            initialValues={this.initialValues}
                                            getHandleChangedValueFn={this.getHandleChangedValueFn}
                                            showAsPopup
                                            contentPlacementOffset={FILTER_DROPDOWN_OFFSET}
                                            isSearchFilters={true}
                                            isMainFilterSection={true}
                                            isCandoFilter={true}
                                            isResetAll={this.state.isResetAll}
                                            liveEdit
                                        />
                                    ))}
                                </SearchFiltersPrimary>
                            )}{' '}
                        </div>
                    </div>
                </div>
                {params?.size >= 1 ? null : (
                    <div className={css.popularSection}>
                        <h1>Popular Categores</h1>
                        <div className={css.mobilePopularCategories}>
                            <a
                                href="s?pub_category=has_any%3Adermatologist%2ChairRemoval%2Cmassage%2CphysioMassage%2CskinSpecialist"
                                className={css.popularCategoryBlock}
                            >
                                <div className={css.imgBlock}>
                                    <img src={popularCategoryMobileImg1} alt="category" />
                                </div>
                                <h2>Treatments</h2>
                            </a>
                            <a
                                href="s?pub_category=has_any%3Aextensions%2ChairStylist%2Cbraidsandlocs"
                                className={css.popularCategoryBlock}
                            >
                                <div className={css.imgBlock}>
                                    <img src={popularCategoryMobileImg2} alt="category" />
                                </div>
                                <h2>Hairdressers</h2>
                            </a>
                            <a
                                href="s?pub_category=has_any%3AmakeupArtist%2Ceyebrows%2CeyeLashes%2Cnails"
                                className={css.popularCategoryBlock}
                            >
                                <div className={css.imgBlock}>
                                    <img src={popularCategoryMobileImg3} alt="category" />
                                </div>
                                <h2>Mens / Barber</h2>
                            </a>
                            <a href="s?pub_category=has_any%3Aextensions" className={css.popularCategoryBlock}>
                                <div className={css.imgBlock}>
                                    <img src={popularCategoryMobileImg4} alt="category" />
                                </div>
                                <h2>Extensions</h2>
                            </a>
                            <a href="s?pub_category=has_any%3Anails" className={css.popularCategoryBlock}>
                                <div className={css.imgBlock}>
                                    <img src={popularCategoryMobileImg5} alt="category" />
                                </div>
                                <h2>Nails</h2>
                            </a>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

SearchHeaderMobile.defaultProps = {
    className: null,
    rootClassName: null,
    listings: [],
    resultsCount: 0,
    pagination: null,
    searchParamsForPagination: {},
    filterConfig: listingFields,
    sortConfig: sortConfig,
};

SearchHeaderMobile.propTypes = {
    className: string,
    rootClassName: string,

    urlQueryParams: object.isRequired,
    listings: array,
    searchInProgress: bool.isRequired,
    searchListingsError: propTypes.error,
    searchParamsAreInSync: bool.isRequired,
    onActivateListing: func.isRequired,
    onManageDisableScrolling: func.isRequired,
    onOpenModal: func.isRequired,
    onCloseModal: func.isRequired,
    onMapIconClick: func.isRequired,
    pagination: propTypes.pagination,
    searchParamsForPagination: object,
    showAsModalMaxWidth: number.isRequired,
    filterConfig: propTypes.filterConfig,
    sortConfig: propTypes.sortConfig,

    history: shape({
        push: func.isRequired,
    }).isRequired,
};

export default withRouter(SearchHeaderMobile);
