import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../../../util/reactIntl';
import { LISTING_STATE_DRAFT } from '../../../../util/types';
import { ensureOwnListing } from '../../../../util/data';
import EditListingSkinTonesForm from './EditListingSkinTonesForm';
import css from './EditListingSkinTonesPanel.module.css';

const EditListingSkinTonesPanel = props => {
  const {
    className,
    rootClassName,
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
  const currentListing = ensureOwnListing(listing);
  
  const { publicData } = currentListing.attributes;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = 
  // isPublished ? (
  //   <FormattedMessage
  //     id="EditListingPoliciesPanel.title"
  //     values={{ listingTitle: <ListingLink listing={listing} /> }}
  //   />
  // ) : (
    <FormattedMessage id="EditListingPoliciesPanel.createListingTitle" />
  // );
  const skinTones = publicData && publicData.skinTones;
  const initialValues = { skinTones };
  return (
    <div className={classes}>
     <p className={css.title}>{panelTitle}</p>
     <div className={css.editListingContainer}>
     <div className={css.editListingContent}>
          <h2>Which skin tones can you work on ?</h2>
          <EditListingSkinTonesForm
            className={css.form}
            initialValues={initialValues}
            onSubmit={values => {
              const { skinTones  } = values;

              const updatedValues = {
                publicData: {skinTones: Array.isArray(skinTones) ? skinTones : [skinTones] },
              };
              onSubmit(updatedValues);
            }}
            onChange={onChange}
            onPrevious={onPrevious}
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

const { func, object, string, bool } = PropTypes;

EditListingSkinTonesPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingSkinTonesPanel.propTypes = {
  className: string,
  rootClassName: string,

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

export default EditListingSkinTonesPanel;
