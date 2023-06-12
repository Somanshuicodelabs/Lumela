import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../../../util/reactIntl';
import { LISTING_STATE_DRAFT } from '../../../../util/types';
import { ensureOwnListing } from '../../../../util/data';
import EditListingHairTexturesForm from './EditListingHairTexturesForm';

import css from './EditListingHairTexturesPanel.module.css';

class EditListingHairTexturesPanel extends Component {
   render() {
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
    } = this.props;

    const classes = classNames(rootClassName || css.root, className);
    const currentListing = ensureOwnListing(listing);
    const { publicData } = currentListing.attributes;

    const isPublished =
      currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
    const panelTitle = 
    // isPublished ? (
    //   <FormattedMessage
    //     id="EditListingLocationPanel.title"
    //     values={{
    //       listingTitle: (
    //         <ListingLink listing={listing}>
    //           <FormattedMessage id="EditListingLocationPanel.listingTitle" />
    //         </ListingLink>
    //       ),
    //     }}
    //   />
    // ) : (
      <FormattedMessage id="EditListingFeaturesPanel.createListingTitle" />
    // );
    const hairTextures = publicData && publicData.hairTextures;
    const initialValues = { hairTextures };

    return (
      <div className={classes}>
        <p className={css.title}>{panelTitle}</p>
        <div className={css.editListingContainer}>
          {/* <div className={css.sectionHeader}>
            <p className={css.processWrap}>PROGRESS (4/5)</p>
            <div className={css.progressDiv}>
              <span className={css.progress}>&nbsp;</span>
            </div>
          </div> */}
          <div className={css.editListingContent}>
            <h2>Which hair textures do you cater to?</h2>

            <EditListingHairTexturesForm
              className={css.form}
              initialValues={initialValues}
              onPrevious={onPrevious}
              onSubmit={values => {
                const { hairTextures = [] } = values;
  
                const updatedValues = {
                  publicData: { hairTextures },
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
  }
}

const { func, object, string, bool } = PropTypes;

EditListingHairTexturesPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingHairTexturesPanel.propTypes = {
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

export default EditListingHairTexturesPanel;
