import React, { useState } from 'react';
import { arrayOf, bool, func, node, object, shape, string } from 'prop-types';
import classNames from 'classnames';

import Field, { hasDataInFields } from '../../Field';
import BlockBuilder from '../../BlockBuilder';

import {search} from '../../../../config/configMaps';

import SectionContainer from '../SectionContainer';
import css from './SectionArticle.module.css';
import { Icon } from '../../../../components/IconBannedUser/IconBannedUser.example';
import IconLocation from '../../../../components/IconLocation/IconLocation';
import { IconSearch } from '../../../../components';
import IconSearchGlass from '../../../../components/IconSearchGlass/IconSearchGlass';
import MainPanelLandingPage from '../../../SearchPage/MainPanelLandingPage';
import { parse } from 'url';
import {
  pickSearchParamsOnly,
  validURLParamsForExtendedData,
} from '../../../SearchPage/SearchPage.helpers';
import { stringify } from 'querystring';
import {sortConfig} from '../../../../config/configSearch';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getListingsById } from '../../../../ducks/marketplaceData.duck';
import { withViewport } from '../../../../util/contextHelpers';

// Section component that's able to show article content
// The article content is mainly supposed to be inside a block
const SectionArticleComponent = props => {
  const {
    sectionId,
    className,
    rootClassName,
    defaultClasses,
    title,
    description,
    appearance,
    callToAction,
    blocks,
    isInsideContainer,
    options,
    sortConfig,
    filterConfig,
    currentPageResultIds,
    pagination,
    searchInProgress,
    searchListingsError,
    searchParams,
    listings,
    searchMapListingIds,
    activeListingId,
    location,
    history,
    onActivateListing,
    viewport,
  } = props;

  // If external mapping has been included for fields
  // E.g. { h1: { component: MyAwesomeHeader } }
  const fieldComponents = options?.fieldComponents;
  const fieldOptions = { fieldComponents };

  const hasHeaderFields = hasDataInFields([title, description, callToAction], fieldOptions);
  const hasBlocks = blocks?.length > 0;

  const [onOpenMobile, setonOpenMobileModal] = useState(false);

  const onOpenMobileModal = () => {
    setonOpenMobileModal(true);
  };
  const { mapSearch, page, ...searchInURL } = parse(location.search, {
    latlng: ['origin'],
    latlngBounds: ['bounds'],
  });

  const onMapIconClick = () => {
    this.useLocationSearchBounds = true;
    this.setState({ isSearchMapOpenOnMobile: true });
  };
  const urlQueryParams = pickSearchParamsOnly(searchInURL, filterConfig, sortConfig);
  const validQueryParams = validURLParamsForExtendedData(searchInURL, filterConfig);

  // const pageMetaProps = getMetadata(meta, schemaType, options?.fieldComponents);
  const urlQueryString = stringify(urlQueryParams);
  const paramsQueryString = stringify(pickSearchParamsOnly(searchParams, filterConfig, sortConfig));
  const searchParamsAreInSync = urlQueryString === paramsQueryString;
  return (
    <SectionContainer
      id={sectionId}
      className={className}
      rootClassName={rootClassName}
      appearance={appearance}
      options={fieldOptions}
    >
      {hasHeaderFields ? (
        <header className={classNames(defaultClasses.sectionDetails, props?.additionalClass)}>
          <Field
            data={title}
            className={classNames(defaultClasses.title, props?.title?.additionalClass)}
            options={fieldOptions}
          />
          <Field
            data={description}
            className={classNames(defaultClasses.description, props?.description?.additionalClass)}
            options={fieldOptions}
          />
          <Field data={callToAction} className={defaultClasses.ctaButton} options={fieldOptions} />
        </header>
      ) : null}
      {hasBlocks ? (
        <div
          className={classNames(
            defaultClasses.blockContainer,
            css.articleMain,
            props?.additionalClass,
            {
              [css.noSidePaddings]: isInsideContainer,
            }
          )}
        >
          <BlockBuilder
            blocks={blocks}
            id={sectionId}
            ctaButtonClass={defaultClasses.ctaButton}
            options={options}
          />
          {sectionId == 'hero-landing' ? (
            <MainPanelLandingPage
              isSelect={true}
              isDateSelect={true}
              className={css.filterSearch}
              urlQueryParams={validQueryParams}
              // listings={listings}
              searchInProgress={searchInProgress}
              searchListingsError={searchListingsError}
              searchParamsAreInSync={searchParamsAreInSync}
              onActivateListing={onActivateListing}
              onManageDisableScrolling={() => {}}
              onOpenModal={onOpenMobileModal}
              onCloseModal={() => {
                setonOpenMobileModal(false);
              }}
              onMapIconClick={() => {
                onMapIconClick;
              }}
              pagination={pagination}
              searchParamsForPagination={parse(location.search)}
              history={history}
              viewport={viewport}
            />
          ) : null}
        </div>
      ) : null}
    </SectionContainer>
  );
};

const propTypeOption = shape({
  fieldComponents: shape({ component: node, pickValidProps: func }),
});

SectionArticleComponent.defaultProps = {
  className: null,
  rootClassName: null,
  defaultClasses: null,
  textClassName: null,
  title: null,
  description: null,
  appearance: null,
  callToAction: null,
  blocks: [],
  isInsideContainer: false,
  options: null,
  filterConfig: search.filters,
  sortConfig: sortConfig,
};

SectionArticleComponent.propTypes = {
  sectionId: string.isRequired,
  className: string,
  rootClassName: string,
  defaultClasses: shape({
    sectionDetails: string,
    title: string,
    description: string,
    ctaButton: string,
  }),
  title: object,
  description: object,
  appearance: object,
  callToAction: object,
  blocks: arrayOf(object),
  isInsideContainer: bool,
  options: propTypeOption,
  location: shape({
    search: string.isRequired,
  }).isRequired,
  history: shape({
    push: func.isRequired,
  }).isRequired,
};

const mapStateToProps = state => {
  const {
    currentPageResultIds,
    pagination,
    searchInProgress,
    searchListingsError,
    searchParams,
    searchMapListingIds,
    activeListingId,
  } = state.SearchPage;
  const pageListings = getListingsById(state, currentPageResultIds);
  return {
    listings: pageListings,
    pagination,
    searchInProgress,
    searchListingsError,
    searchParams,
    searchMapListingIds,
    activeListingId,
  };
};

const mapDispatchToProps = dispatch => ({
  // onManageDisableScrolling: (componentId, disableScrolling) =>
  //   dispatch(manageDisableScrolling(componentId, disableScrolling)),
  // onSearchMapListings: searchParams => dispatch(searchMapListings(searchParams)),
  onActivateListing: listingId => dispatch(setActiveListing(listingId)),
});

const SectionArticle = compose(
  withRouter,
  withViewport,
  connect(mapStateToProps, mapDispatchToProps)
)(SectionArticleComponent);

export default SectionArticle;
