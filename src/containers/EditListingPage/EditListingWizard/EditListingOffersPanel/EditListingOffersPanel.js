import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../../../util/reactIntl';
import { ensureListing } from '../../../../util/data';
import css from './EditListingOffersPanel.module.css';
import EditListingOffersForm from './EditListingOffersForm';

const FEATURES_NAME = 'yogaStyles';

const EditListingOffersPanel = props => {
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
  const { offers } = publicData || {};

  // const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = 
  // isPublished ? (
  //   <FormattedMessage
  //     id="EditListingFeaturesPanel.title"
  //     values={{
  //       listingTitle: (
  //         <ListingLink listing={listing}>
  //           <FormattedMessage id="EditListingFeaturesPanel.listingTitle" />
  //         </ListingLink>
  //       ),
  //     }}
  //   />
  // ) : (
    <FormattedMessage id="EditListingFeaturesPanel.createListingTitle" />
  // );

  const initialValues = { offers: offers ? offers.split(',') : [] };

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
          <h2>What do you offer?</h2>
          {/* <p>( you may select more than one)</p> */}

          <EditListingOffersForm
            className={css.form}
            onPrevious={onPrevious}
            name={FEATURES_NAME}
            initialValues={initialValues}
            onSubmit={values => {
              const { offers = [] } = values;
              const updatedValues = {
                publicData: { offers: offers.join(','), category: offers },
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

EditListingOffersPanel.defaultProps = {
  rootClassName: null,
  className: null,
  listing: null,
};

const { bool, func, object, string } = PropTypes;

EditListingOffersPanel.propTypes = {
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

export default EditListingOffersPanel;
