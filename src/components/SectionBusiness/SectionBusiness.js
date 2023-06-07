import classNames from 'classnames';
import React, { useState } from 'react';
import css from './SectionBusiness.module.css';
// import Tabs, { TabPane } from 'rc-tabs';
// import '../../../node_modules/rc-tabs/assets/index.css';
import './react-tab.css';
import IconRightArrow from '../IconRightArrow/IconRightArrow';
// import IconCurrentLocation from '../LocationAutocompleteInput/IconCurrentLocation';
// import IconReviewStar from '../IconReviewStar/IconReviewStar';
// import categoryImg1 from '../../assets/category1.png';
// import categoryImg2 from '../../assets/category2.jpg';
// import categoryImg3 from '../../assets/category3.jpg';
// import Logo from '../Logo/Logo';
import { lazyLoadWithDimensions } from '../../util/contextHelpers';
import { ensureListing } from '../../util/data';
import Slider from 'react-slick';
import { ListingCard } from '../../components';

export default function SectionBusiness(props) {
  const { rootClassName, className, listings, setActiveListing, searchPageListingCard } = props;

  const LazyImage = lazyLoadWithDimensions(SectionBusiness, { loadAfterInitialRendering: 3000 });

  const classes = classNames(
    rootClassName || css.root,
    className,
    searchPageListingCard ? css.searchPageResultPanel : null
  );

  const [toggleState, setToggleState] = useState(1);

  const toggleTab = index => {
    setToggleState(index);
  };

  function callback(e) {
    console.log(e);
  }
  var settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2.4,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2.1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Panel width relative to the viewport
  const panelMediumWidth = 50;
  const panelLargeWidth = 62.5;
  const cardRenderSizes = [
    '(max-width: 767px) 100vw',
    `(max-width: 1023px) ${panelMediumWidth}vw`,
    `(max-width: 1920px) ${panelLargeWidth / 2}vw`,
    `${panelLargeWidth / 3}vw`,
  ].join(', ');
  return (
    <div className={classes}>
      <div className={css.fixedWidthContainer}>
        <div className={css.horizontalTabs}>
          <div className={css.tabWrapper}>
            <a href="/s" className={css.seeMore}>
              <span>
                See more <IconRightArrow />
              </span>
            </a>
          </div>
          <div className={css.categoriesBlock}>
            <Slider {...settings}>
              {listings.map((l, index) =>
                index <= 3 ? (
                  <ListingCard
                    className={css.listingCard}
                    key={l.id.uuid}
                    listing={l}
                    renderSizes={cardRenderSizes}
                    setActiveListing={setActiveListing}
                    searchPageListingCard={searchPageListingCard}
                    isLandingPageListingCard={true}
                  />
                ) : null
              )}
              {/* {listings.map((item, index) =>
                index <= 5 ? (
                  <div className={css.category}>
                    <div className={css.categoryImg}>
                      <span className={css.border}></span>
                      <img
                        src={item?.images?.[0]?.attributes?.variants?.['square-small2x']?.url}
                        alt="category"
                      />
                    </div>
                    <div className={css.categoryInfo}>
                      <div className={css.categoryHead}>
                        <h2>{item?.attributes?.publicData?.businessName} </h2>
                        <span className={css.rating}>
                          5.0 <IconReviewStar />
                        </span>
                      </div>
                      <div className={css.categoryBody}>
                        <p className={css.location}>
                          {item?.attributes?.publicData?.location?.address}
                        </p>
                        {/* <p className={css.serviceType}>Hair Salon</p> */}
              {/* </div>
                    </div>
                  </div> */}
              {/* ) */}
            </Slider>
          </div>

          {/* <a href="/" className={css.seeMoreMobile}>
            <span>
              See more <IconRightArrow />
            </span>
          </a> */}
        </div>
      </div>
    </div>
  );
}
