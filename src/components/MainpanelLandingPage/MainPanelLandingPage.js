import React, { Component } from 'react';
import { array, arrayOf, bool, func, object, oneOf, shape, string } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useHistory, useLocation } from 'react-router-dom';
import debounce from 'lodash/debounce';
import omit from 'lodash/omit';
import classNames from 'classnames';

import { useIntl, intlShape, FormattedMessage } from '../../util/reactIntl';
import { useConfiguration } from '../../context/configurationContext';
import { useRouteConfiguration } from '../../context/routeConfigurationContext';

import { createResourceLocatorString, pathByRouteName } from '../../util/routes';
import {
    isAnyFilterActive,
    isMainSearchTypeKeywords,
    isOriginInUse,
    getQueryParamNames,
} from '../../util/search';
import { parse } from '../../util/urlHelpers';
import { SEARCH_PAGE, propTypes } from '../../util/types';
import { getListingsById } from '../../ducks/marketplaceData.duck';
import { manageDisableScrolling, isScrollingDisabled } from '../../ducks/ui.duck';

import { H3, H5, ModalInMobile, Page } from '../../components';
import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';
import TopbarSearchForm, { LocationSearchField } from '../../components/Topbar/TopbarSearchForm/TopbarSearchForm'

import { setActiveListing } from './SearchPage.duck';
import {
    groupListingFieldConfigs,
    initialValues,
    searchParamsPicker,
    validUrlQueryParamsFromProps,
    validFilterParams,
    cleanSearchFromConflictingParams,
    createSearchResultSchema,
} from './SearchPage.shared';

import FilterComponent from './FilterComponent';
import SearchMap from './SearchMap/SearchMap';
import MainPanelHeader from './MainPanelHeader/MainPanelHeader';
import SearchFiltersSecondary from './SearchFiltersSecondary/SearchFiltersSecondary';
import SearchFiltersPrimary from './SearchFiltersPrimary/SearchFiltersPrimary';
import SearchFiltersMobile from './SearchFiltersMobile/SearchFiltersMobile';
import SortBy from './SortBy/SortBy';
import SearchResultsPanel from './SearchResultsPanel/SearchResultsPanel';
import NoSearchResultsMaybe from './NoSearchResultsMaybe/NoSearchResultsMaybe';

import css from './SearchPage.module.css';
import { KeywordFilter, LocationAutocompleteInput } from '../../examples';
import { KeywordFilterPlainExample, KeywordFilterPopupExample } from './KeywordFilter/KeywordFilter.example';
import { Form } from 'react-final-form';
const MODAL_BREAKPOINT = 768; // Search is in modal on mobile layout
const SEARCH_WITH_MAP_DEBOUNCE = 300; // Little bit of debounce before search is initiated.

// Primary filters have their content in dropdown-popup.
// With this offset we move the dropdown to the left a few pixels on desktop layout.
const FILTER_DROPDOWN_OFFSET = -14;



