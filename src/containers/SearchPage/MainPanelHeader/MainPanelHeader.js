import React from 'react';
import { bool, func, node, number, string } from 'prop-types';
import classNames from 'classnames';

import { FormattedMessage } from '../../../util/reactIntl';

import css from './MainPanelHeader.module.css';

import Slider from "react-slick";

import popularCategoryImg1 from '../../../assets/popular-img1.png';
import popularCategoryImg2 from '../../../assets/popular-img2.png';
import popularCategoryImg3 from '../../../assets/popular-img3.png'
  ;
import popularCategoryImg4 from '../../../assets/popular-img4.png';
import popularCategoryImg5 from '../../../assets/popular-img5.png';
import { KeywordFilterPlainExample } from '../KeywordFilter/KeywordFilter.example';
import { countBy } from 'lodash';



const MainPanelHeader = props => {
  const {
    rootClassName,
    className,
    children,
    sortByComponent,
    isSortByActive,
    listingsAreLoaded,
    resultsCount,
    searchInProgress,
    noResultsInfo,
  } = props;


  const classes = classNames(rootClassName || css.root, className);

  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4.2,
    slidesToScroll: 1,
    initialSlide: 0,
    // responsive: [
    //   {
    //     breakpoint: 1024,
    //     settings: {
    //       slidesToShow: 3,
    //     },
    //   },
    //   {
    //     breakpoint: 600,
    //     settings: {
    //       slidesToShow: 2,
    //       initialSlide: 2,
    //     },
    //   },
    //   {
    //     breakpoint: 480,
    //     settings: {
    //       slidesToShow: 1,
    //     },
    //   },
    // ],
  };

  return (

    //slider 
    <>




      {/* <div>
        <Slider {...settings}>
          <div>
            <a
              href="s?pub_category=has_any%3Adermatologist%2ChairRemoval%2Cmassage%2CphysioMassage%2CskinSpecialist"
              className={css.categoryBlock}
            >
              <div className={css.imgBlock}>
                <img src={popularCategoryImg1} alt="category" />
              </div>
              <h2>treatments</h2>
            </a>
          </div>
          <div>
            <a
              href="s?pub_category=has_any%3AmakeupArtist%2Ceyebrows%2CeyeLashes%2Cnails"
              className={css.categoryBlock}
            >
              <div className={css.imgBlock}>
                <img src={popularCategoryImg2} alt="category" />
              </div>
              <h2>MENS / Barber</h2>
            </a>
          </div>
          <div className={css.categoryBlock}>
            <a href='#'>
              <div className={css.imgBlock}>
                <img src={popularCategoryImg3} alt="category" />
              </div>
              <h2>Hairdresser</h2>
            </a>
          </div>
          <div>
            <a href="s?pub_category=has_any%3Aextensions" className={css.categoryBlock}>
              <div className={css.imgBlock}>
                <img src={popularCategoryImg4} alt="category" />
              </div>
              <h2>EXTENSIONS</h2>
            </a>
          </div>
          <div>
            <a href="s?pub_category=has_any%3Abraidsandlocs" className={css.categoryBlock}>
              <div className={css.imgBlock}>
                <img src={popularCategoryImg5} alt="category" />
              </div>
              <h2>DREAD-LOCKS</h2>
            </a>
          </div>
        </Slider>
      </div> */}

      <div className={classes}>
        <div className={css.searchOptions}>
          <div className={css.searchResultSummary}>
            <span className={css.resultsFound}>
              {searchInProgress ? (
                <FormattedMessage id="MainPanelHeader.loadingResults" />
              ) : (
                <FormattedMessage
                  id="MainPanelHeader.foundResults"
                  values={{ count: resultsCount }}
                />
              )}
            </span>
          </div>

        </div>

        {children}
        {sortByComponent}
        {noResultsInfo ? noResultsInfo : null}


      </div>

    </>
  );
};

MainPanelHeader.defaultProps = {
  rootClassName: null,
  className: null,
  resultsCount: null,
  searchInProgress: false,
  sortByComponent: null,
};

MainPanelHeader.propTypes = {
  rootClassName: string,
  className: string,
  listingsAreLoaded: bool.isRequired,
  resultsCount: number,
  searchInProgress: bool,
  sortByComponent: node,
};

export default MainPanelHeader;
