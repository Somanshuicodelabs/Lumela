import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../../../util/reactIntl';

import { LISTING_STATE_DRAFT } from '../../../../util/types';
import { ensureListing } from '../../../../util/data';
import { ListingLink } from '../../../../components';
import css from './EditListingBookingSystemPanel.module.css';
import EditListingBookingSystemForm from './EditListingBookingSystemForm';

const FEATURES_NAME = 'yogaStyles';

const EditListingBookingSystemPanel = props => {
  const {
    rootClassName,
    className,
    listing,
    disabled,
    ready,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
    onPrevious,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureListing(listing);
  const { publicData } = currentListing.attributes;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingFeaturesPanel.title"
      values={{
        listingTitle: (
          <ListingLink listing={listing}>
            <FormattedMessage id="EditListingFeaturesPanel.listingTitle" />
          </ListingLink>
        ),
      }}
    />
  ) : (
    <FormattedMessage id="EditListingFeaturesPanel.createListingTitle" />
  );

  const bookingSystem = publicData && publicData.bookingSystem;
  const other = publicData && publicData.other;
  const initialValues = { bookingSystem ,other};

  return (
    <div className={classes}>
      <p className={css.title}>{panelTitle}</p>
      <div className={css.editListingContainer}>
        {/* <div className={css.sectionHeader}>
          <p className={css.processWrap}>PROGRESS (3/5)</p>
          <div className={css.progressDiv}>
            <span className={css.progress}>&nbsp;</span>
          </div>
        </div> */}
        <div className={css.editListingContent}>
          <h2>What are you currently using for a booking system?</h2>
          <p>If you need help transitioning from your current system to your Lumela profile, we can help you</p>

          <EditListingBookingSystemForm
            className={css.form}
            onPrevious={onPrevious}
            name={FEATURES_NAME}
            initialValues={initialValues}
            onSubmit={values => {
              const { bookingSystem,other} = values;

              const updatedValues = {
                publicData: { bookingSystem,other },
              };
              onSubmit(updatedValues);
            }}
            onChange={onChange}
            saveActionMsg={submitButtonText}
            disabled={disabled}
            ready={ready}
            updated={panelUpdated}
            updateInProgress={updateInProgress}
            fetchErrors={errors}
          />
        </div>
      </div>
    </div>
  );
};

EditListingBookingSystemPanel.defaultProps = {
  rootClassName: null,
  className: null,
  listing: null,
};

const { bool, func, object, string } = PropTypes;

EditListingBookingSystemPanel.propTypes = {
  rootClassName: string,
  className: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingBookingSystemPanel;
