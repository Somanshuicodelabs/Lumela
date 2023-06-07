import React, { useState } from 'react';
import { bool, func, node, number, string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';

import css from './SearchFiltersPrimary.module.css';
import IconArrowDown from '../IconArrowDown/IconArrowDown';
import IconArrowUp from '../IconArrowUp/IconArrowUp';
import { NamedLink, SearchFiltersSecondary } from '../../components';
import FilterComponent from '../../containers/SearchPage/FilterComponent';
import { useEffect } from 'react';
import { useRef } from 'react';
import Drawer from 'react-modern-drawer';
// import { getFilterValues } from '../../containers/SearchPage/SearchPage.duck';

const CANDO = 'canDo';
const SKINTONES = 'skinTones';
const SKINTYPES = 'skinTypes';
const HAIRTYPES = 'hairTextures';

const SearchFiltersPrimaryComponent = props => {
  const {
    rootClassName,
    className,
    children,
    pageName,
    sortByComponent,
    listingsAreLoaded,
    resultsCount,
    searchInProgress,
    isSecondaryFiltersOpen,
    filterKeyBtn,
    toggleSecondaryFiltersOpen,
    selectedSecondaryFiltersCount,
    selectedSecondaryCanDoFiltersCount,
    isLandingSearch,
    applyFilters,
    cancelFilters,
    resetAll,
    onClosePanel,
    urlQueryParams,
    secondaryFilters,
    initialValues,
    getHandleChangedValueFn,
    onManageDisableScrolling,
    onClick,
    ref,
  } = props;

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filterKey, setFilterKey] = useState('');
  const hasNoResult = listingsAreLoaded && resultsCount === 0;
  const classes = classNames(
    rootClassName || css.root,
    className,
    isLandingSearch ? css.landingSearch : null
  );
  const modalRef = useRef(null);
  const [filterHeight, setfilterHeight] = useState(0);
  useEffect(() => {
    if (modalRef && modalRef.current && modalRef.current.clientHeight != filterHeight) {
      setfilterHeight(modalRef.current.clientHeight);
    }
  }, [filterHeight]);
  useEffect(() => {
    const handleClickOutsideModal = event => {
      if (
        isSecondaryFiltersOpen &&
        onClosePanel &&
        !event.target.closest(`.${css.searchFiltersPanel}`)
      ) {
        onClosePanel();
      }
    };

    document.addEventListener('mousedown', handleClickOutsideModal);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal);
    };
  }, [isSecondaryFiltersOpen, onClosePanel]);

  const toggleFilterDrawer = () => {
    setIsFilterDrawerOpen(!isFilterDrawerOpen);
  };

  // const FilterData = getFilterValues(urlQueryParams);

  const toggleSecondaryFiltersOpenButtonClasses =
    isSecondaryFiltersOpen || selectedSecondaryFiltersCount > 0
      ? css.searchFiltersPanelOpen
      : css.searchFiltersPanelClosed;
  const renderToggleButton = (buttonClassName, onClickHandler, messageId, icon) => (
    <button className={toggleSecondaryFiltersOpenButtonClasses} onClick={onClickHandler}>
      <FormattedMessage
        id={messageId}
        values={{
          count:
            buttonClassName === CANDO
              ? selectedSecondaryCanDoFiltersCount
              : selectedSecondaryFiltersCount,
        }}
      />
      {filterKeyBtn === buttonClassName ? <IconArrowUp /> : <IconArrowDown />}
    </button>
  );
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const toggleSecondaryFiltersOpenButton = toggleSecondaryFiltersOpen ? (
    <div className={css.moreFilters}>
      {renderToggleButton(
        CANDO,
        () => {
          setFilterKey(CANDO);
          toggleSecondaryFiltersOpen(!isSecondaryFiltersOpen, CANDO);
          toggleFilterDrawer();
        },
        'SearchFiltersPrimary.canDoButton',
        filterKeyBtn === CANDO ? <IconArrowUp /> : <IconArrowDown />
      )}

      {renderToggleButton(
        'filters',
        () => {
          setFilterKey('filters');
          toggleSecondaryFiltersOpen(!isSecondaryFiltersOpen, 'filters');
          toggleFilterDrawer();
        },
        'SearchFiltersPrimary.moreFiltersButton',
        filterKeyBtn === 'filters' ? <IconArrowUp /> : <IconArrowDown />
      )}

      {isMobile ? (
        <Drawer
          open={isFilterDrawerOpen}
          onClose={toggleFilterDrawer}
          direction="bottom"
          className={css.filterDrawerContainer}
        // size={filterHeight}
        >
          <div className={css.filterDrawerBody} ref={modalRef}>
            <div className={css.filterDrawerHead}>
              <h2>

              </h2>
              <span className={css.closeBtn} onClick={toggleFilterDrawer}>
                &times;
              </span>
            </div>
            <div className={css.filterDrawerContent}>
              {isSecondaryFiltersOpen && (
                <div
                  className={classNames(
                    css.searchFiltersPanel,
                    filterKey === CANDO ? css.candoFilterDropdown : null
                  )}
                >
                  {filterKey === 'filters' && !isMobile && (
                    <div className={css.moreFilterHead}>
                      <h2>Filters</h2>
                      {/* <NamedLink name="SearchPage" className={css.clearAllFilters} to={{ search: '' }}>
                    Clear All
                  </NamedLink> */}
                    </div>
                  )}
                  <SearchFiltersSecondary
                    urlQueryParams={urlQueryParams}
                    listingsAreLoaded={listingsAreLoaded}
                    applyFilters={applyFilters}
                    cancelFilters={cancelFilters}
                    resetAll={resetAll}
                    onClosePanel={onClosePanel}
                    isCanDoFilter={filterKey === CANDO}
                    closeDrawer={toggleFilterDrawer}
                  >
                    {secondaryFilters
                      .filter(config => {
                        if (filterKey == CANDO && config.id == CANDO) {
                          return config;
                        } else if (FilterData && filterKey != CANDO) {
                          return FilterData === 'Treatments' ? config.id === SKINTYPES
                            : FilterData === 'Hairdressers' ? config.id === HAIRTYPES
                              : FilterData === 'Mens / Barber' ? config.id === HAIRTYPES
                                : FilterData === 'Extensions' ? config.id === HAIRTYPES
                                  : FilterData === 'Nails' ? config.id === SKINTONES
                                    : null
                        } else if (filterKey != CANDO && config.id != CANDO) {
                          return config;
                        } else {
                          return null;
                        }
                      })
                      .map(config => (
                        <FilterComponent
                          key={`SearchFiltersSecondary.${config.id}`}
                          idPrefix="SearchFiltersSecondary"
                          filterConfig={config}
                          urlQueryParams={urlQueryParams}
                          initialValues={initialValues}
                          getHandleChangedValueFn={getHandleChangedValueFn}
                          showAsPopup={false}
                          isSearchFilters={true}
                        />
                      ))}
                  </SearchFiltersSecondary>
                </div>
              )}
            </div>
          </div>
        </Drawer>
      ) : (
        <>
          {isSecondaryFiltersOpen && (
            <div
              className={classNames(
                css.searchFiltersPanel,
                filterKey === CANDO ? css.candoFilterDropdown : null
              )}
              ref={modalRef}
            >
              {filterKey === 'filters' && (
                <div className={css.moreFilterHead}>
                  <h2>Filters</h2>
                  {/* <NamedLink name="SearchPage" className={css.clearAllFilters} to={{ search: '' }}>
          Clear All
        </NamedLink> */}
                </div>
              )}

              <SearchFiltersSecondary
                urlQueryParams={urlQueryParams}
                listingsAreLoaded={listingsAreLoaded}
                applyFilters={applyFilters}
                cancelFilters={cancelFilters}
                resetAll={resetAll}
                onClosePanel={onClosePanel}
                isCanDoFilter={filterKey === CANDO}
              >
                {secondaryFilters
                  .filter(config =>
                    filterKey === CANDO ? config.id === CANDO : config.id !== CANDO
                  )
                  .map(config => (
                    <FilterComponent
                      key={`SearchFiltersSecondary.${config.id}`}
                      idPrefix="SearchFiltersSecondary"
                      filterConfig={config}
                      urlQueryParams={urlQueryParams}
                      initialValues={initialValues}
                      getHandleChangedValueFn={getHandleChangedValueFn}
                      showAsPopup={false}
                      isSearchFilters={true}
                    />
                  ))}
              </SearchFiltersSecondary>
            </div>
          )}
        </>
      )}
    </div>
  ) : null;

  return (
    <div className={classes}>
      <div className={css.filters}>
        {sortByComponent}
        {children}
        {toggleSecondaryFiltersOpenButton}
        {pageName === 'LandingPage' ? null :
          <button className={css.clearAllFilters} onClick={onClick}>
            <FormattedMessage id={'SearchFiltersMobile.resetAll'} />
          </button>}
        {/* {pageName !== 'LandingPage' ? (
          <NamedLink
            name="SearchPage"
            className={css.clearAllFilters}
            to={{
              search: '',
            }}
          >
            Clear all
          </NamedLink>
        ) : null} */}
      </div>
      {pageName == 'LandingPage' || isMobile ? null : listingsAreLoaded && !hasNoResult ? (
        <div className={css.searchOptions}>
          <div className={css.searchResultSummary}>
            <span className={css.resultsFound}>
              <FormattedMessage
                id="SearchFiltersPrimary.foundResults"
                values={{ count: resultsCount }}
              />
            </span>
          </div>
        </div>
      ) : null}

      {!isLandingSearch && hasNoResult ? (
        <div className={css.noSearchResults}>
          <FormattedMessage id="SearchFiltersPrimary.noResults" />
        </div>
      ) : null}

      {!isLandingSearch && searchInProgress ? (
        <div className={css.loadingResults}>
          <FormattedMessage id="SearchFiltersPrimary.loadingResults" />
        </div>
      ) : null}
    </div>
  );
};

SearchFiltersPrimaryComponent.defaultProps = {
  rootClassName: null,
  className: null,
  resultsCount: null,
  searchInProgress: false,
  isSecondaryFiltersOpen: false,
  toggleSecondaryFiltersOpen: null,
  selectedSecondaryFiltersCount: 0,
  sortByComponent: null,
};

SearchFiltersPrimaryComponent.propTypes = {
  rootClassName: string,
  className: string,
  listingsAreLoaded: bool.isRequired,
  resultsCount: number,
  searchInProgress: bool,
  isSecondaryFiltersOpen: bool,
  toggleSecondaryFiltersOpen: func,
  selectedSecondaryFiltersCount: number,
  sortByComponent: node,
};

const SearchFiltersPrimary = SearchFiltersPrimaryComponent;

export default SearchFiltersPrimary;
