import React from 'react';
import { array, bool, func, object, string } from 'prop-types';
import classNames from 'classnames';

// Import configs and util modules
import { FormattedMessage } from '../../../../util/reactIntl';
import { LISTING_STATE_DRAFT } from '../../../../util/types';

// Import shared components
import { H3, ListingLink } from '../../../../components';

// Import modules from this directory
import EditListingPhotosForm from './EditListingPhotosForm';
import css from './EditListingPhotosPanel.module.css';
import { ensureOwnListing } from '../../../../util/data';


const EditListingPhotosPanel = props => {
  const {
    className,
    rootClassName,
    errors,
    disabled,
    ready,
    listing,
    onImageUpload,
    submitButtonText,
    onChange,
    panelUpdated,
    updateInProgress,
    onSubmit,
    onRemoveImage,
    listingImageConfig,
    onPrevious,
    onUpdateImageOrder,
    images
  } = props;

  const rootClass = rootClassName || css.root;
  const classes = classNames(rootClass, className);
  const isPublished = listing?.id && listing?.attributes?.state !== LISTING_STATE_DRAFT;
  const currentListing = ensureOwnListing(listing);
  const {  publicData, description } = currentListing.attributes || {};

  // Only render current search if full place object is available in the URL params
  // TODO bounds are missing - those need to be queried directly from Google Places
  // const locationFieldsPresent =
  //   publicData &&
  //   publicData.location &&
  //   publicData.location.address &&
  //   geolocation;
  // const locationField =
  //   publicData && publicData.location ? publicData.location : {};
  // const { address } = locationField || {};
  // const location = locationFieldsPresent
  //   ? {
  //     search: address,
  //     selectedPlace: { address, origin: geolocation },
  //   }
  //   : null;
  const { mainImageId } = publicData || {};

  const restImages = images && images.length
    ? mainImageId
      ? images.filter(image => !image.imageType && mainImageId && image.id && (!image.id.uuid || (image.id.uuid && image.id.uuid != mainImageId)))
      : images.filter(image => !image.imageType)
    : [];

  const mainImage = images && images.length
    ? images.filter(image => image.imageType == 'main').length
      ? images.filter(image => image.imageType == 'main')[images.filter(image => image.imageType == 'main').length - 1]
      : images.filter(image => mainImageId && image.id && image.id.uuid == mainImageId).length
        ? images.filter(image => mainImageId && image.id && image.id.uuid == mainImageId)[0]
        : []
    : [];

  return (
    <div className={classes}>
      {/* <H3 as="h1">
        {isPublished ? (
          <FormattedMessage
            id="EditListingPhotosPanel.title"
            values={{ listingTitle: <ListingLink listing={listing} />, lineBreak: <br /> }}
          />
        ) : (
          <FormattedMessage
            id="EditListingPhotosPanel.createListingTitle"
            values={{ lineBreak: <br /> }}
          />
        )}
      </H3> */}
      <div className={css.editListingContent}>
        <h2><FormattedMessage id="EditListingPhoto.heading" /> </h2>
        <EditListingPhotosForm
          className={css.form}
          disabled={disabled}
          onPrevious={onPrevious}
          ready={ready}
          fetchErrors={errors}
          initialValues={{ images, description }}
          images={restImages}
          mainImage={mainImage}
          onImageUpload={onImageUpload}
          onSubmit={values => {
            const { mainImage: dummyMainImage, addImage, description, canDo, ...updateValues } = values;
            if (updateValues.images && updateValues.images.length) {              
              //  const {
              //    selectedPlace: { address, origin },
              //  } = location || {};
              Object.assign(updateValues, {
                // description,
                publicData: {
                  mainImageId: mainImage && mainImage.imageId && mainImage.imageId.uuid
                    ? mainImage.imageId.uuid
                    : mainImageId
                      ? mainImageId
                      : '',
                  //  location: { address },
                  //  canDo : canDo
                }

              });
              //  setState({
              //    initialValues: {
              //      location: {
              //        search: address,
              //        selectedPlace: { address, origin },
              //      },
              //    },
              //  });
            }
            
            onSubmit(updateValues);
          }}
          onChange={onChange}
          onUpdateImageOrder={onUpdateImageOrder}
          onRemoveImage={onRemoveImage}
          saveActionMsg={submitButtonText}
          updated={panelUpdated}
          updateInProgress={updateInProgress}
          listingImageConfig={listingImageConfig}
        />
      </div>
    </div>
  );
};

EditListingPhotosPanel.defaultProps = {
  className: null,
  rootClassName: null,
  errors: null,
  images: [],
  listing: null,
};

EditListingPhotosPanel.propTypes = {
  className: string,
  rootClassName: string,
  errors: object,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  images: array,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  onImageUpload: func.isRequired,
  onSubmit: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  onRemoveImage: func.isRequired,
  listingImageConfig: object.isRequired,
};

export default EditListingPhotosPanel;