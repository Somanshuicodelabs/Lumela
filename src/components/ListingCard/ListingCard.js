import React, { Component } from 'react';
import { string, func, bool } from 'prop-types';
import classNames from 'classnames';

import { useConfiguration } from '../../context/configurationContext';

import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import { lazyLoadWithDimensions } from '../../util/uiHelpers';
import { propTypes } from '../../util/types';
import { formatMoney } from '../../util/currency';
import { ensureListing, ensureUser } from '../../util/data';
import { richText } from '../../util/richText';
import { createSlug } from '../../util/urlHelpers';
import { isBookingProcessAlias } from '../../transactions/transaction';
import IconFavorite from '../IconFavorite/IconFavorite';
import IconReviewStar from '../IconReviewStar/IconReviewStar';
import { AspectRatioWrapper, NamedLink, ResponsiveImage } from '../../components';
import IconLocationPin from '../IconLocationPin/IconLocationPin';

import css from './ListingCard.module.css';

const MIN_LENGTH_FOR_LONG_WORDS = 10;

const priceData = (price, currency, intl) => {
  if (price && price.currency === currency) {
    const formattedPrice = formatMoney(intl, price);
    return { formattedPrice, priceTitle: formattedPrice };
  } else if (price) {
    return {
      formattedPrice: intl.formatMessage(
        { id: 'ListingCard.unsupportedPrice' },
        { currency: price.currency }
      ),
      priceTitle: intl.formatMessage(
        { id: 'ListingCard.unsupportedPriceTitle' },
        { currency: price.currency }
      ),
    };
  }
  return {};
};

const LazyImage = lazyLoadWithDimensions(ResponsiveImage, { loadAfterInitialRendering: 3000 });

export const ListingCardComponent = props => {
  const config = useConfiguration();
  const {
    className,
    rootClassName,
    intl,
    listing,
    renderSizes,
    setActiveListing,
    showAuthorInfo,
    searchPageListingCard,
    isLandingPageListingCard,
  } = props;
  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureListing(listing);
  const id = currentListing.id.uuid;
  const { title = '', price, publicData } = currentListing.attributes;
  const slug = createSlug(title);
  const author = ensureUser(listing.author);
  const authorName = author.attributes.profile.displayName;
  const firstImage =
    currentListing.images && currentListing.images.length > 0 ? currentListing.images[0] : null;


  const {
    aspectWidth = 1,
    aspectHeight = 1,
    variantPrefix = 'listing-card',
  } = config.layout.listingImage;
  const variants = firstImage
    ? Object.keys(firstImage?.attributes?.variants).filter(k => k.startsWith(variantPrefix))
    : [];

  const { formattedPrice, priceTitle } = priceData(price, config.currency, intl);

  const setActivePropsMaybe = setActiveListing
    ? {
        onMouseEnter: () => setActiveListing(currentListing.id),
        onMouseLeave: () => setActiveListing(null),
      }
    : null;

  return (
    <NamedLink className={classes} name="ListingPage" params={{ id, slug }}>
    <div className={css.category}>
      <div className={css.categoryImg}>
        <span className={css.favorite}>
          <IconFavorite />
        </span>
        <div
          className={css.threeToTwoWrapper}
          onMouseEnter={() => setActiveListing(currentListing.id)}
          onMouseLeave={() => setActiveListing(null)}
        >
          <div className={css.aspectWrapper}>
            <LazyImage
              rootClassName={css.rootForImage}
              alt={title}
              image={firstImage}
              variants={variants}
              sizes={renderSizes}
            />
          </div>
        </div>
      </div>
      <div className={css.categoryInfo}>
        <div className={css.categoryHead}>
          <h2>{publicData?.businessName} </h2>
          <span className={css.rating}>
            4.7 <IconReviewStar />
          </span>
        </div>
        {publicData?.description?.description && (
          <p
            className={classNames(
              css.descripton,
              isLandingPageListingCard && css.hideOnLandingCard
            )}
          >
            {publicData?.description?.description}
          </p>
        )}
        <div className={css.cardContact}>
          <p className={css.location}>
            {!isLandingPageListingCard && <IconLocationPin />}
            <span>{publicData?.location?.address}</span>
          </p>
          {/* <p
            className={classNames(
              css.location,
              isLandingPageListingCard && css.hideOnLandingCard
            )}
          >
            <IconCall />
            <span>02 9489 9480</span>
          </p>
          <p
            className={classNames(
              css.location,
              isLandingPageListingCard && css.hideOnLandingCard
            )}
          >
            <IconAt />
            <span>{publicData?.email}</span>
          </p> */}
        </div>
      </div>
    </div>
    {/* <div className={css.info}> */}
    {/* <div className={css.mainInfo}>
        <div className={css.title}>
          {richText(title, {
            longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS,
            longWordClass: css.longWord,
          })}
        </div>
        <div className={css.certificateInfo}>
          {certificate && !certificate.hideFromListingInfo ? (
            <span>{certificate.label}</span>
          ) : null}
        </div>
      </div> */}
    {/* <div className={css.price}>
        <div className={css.priceValue} title={priceTitle}>
          {formattedPrice}
        </div>
        <div className={css.perUnit}>
          <FormattedMessage id={unitTranslationKey} />
        </div>
      </div> */}
    {/* </div> */}
  </NamedLink>
  );
};

ListingCardComponent.defaultProps = {
  className: null,
  rootClassName: null,
  renderSizes: null,
  setActiveListing: null,
  showAuthorInfo: true,
};

ListingCardComponent.propTypes = {
  className: string,
  rootClassName: string,
  intl: intlShape.isRequired,
  listing: propTypes.listing.isRequired,
  showAuthorInfo: bool,

  // Responsive image sizes hint
  renderSizes: string,

  setActiveListing: func,
};

export default injectIntl(ListingCardComponent);
