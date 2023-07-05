import React, { useState } from 'react';
import { bool, func, object, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../../../util/reactIntl';
import { ensureOwnListing } from '../../../../util/data';
// import { findOptionsForSelectFilter } from '../../util/search';
import { LISTING_STATE_DRAFT } from '../../../../util/types';
// import { ListingLink } from '../../components';
import EditListingDescriptionForm from './EditListingDescriptionForm';
// import config from '../../config';

import css from './EditListingDescriptionPanel.module.css';

const EditListingDescriptionPanel = props => {
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
  } = props;

  const [resetForm, setResetForm] = useState(false);
  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const { publicData = {} } = currentListing.attributes;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = 
  // isPublished ? (
  //   <FormattedMessage
  //     id="EditListingDescriptionPanel.title"
  //     values={{
  //       listingTitle: (
  //         <ListingLink listing={listing}>
  //           <FormattedMessage id="EditListingDescriptionPanel.listingTitle" />
  //         </ListingLink>
  //       ),
  //     }}
  //   />
  // ) : (
    <FormattedMessage id="EditListingPartnerProfilePanel.createListingTitle" />
  // );

  // const certificateOptions = findOptionsForSelectFilter('certificate', config.custom.filters);
  return (
    <div className={classes}>
      <p className={css.title}>{panelTitle}</p>
      <div className={css.editListingContainer}>
        {/* <div className={css.sectionHeader}>
          <p className={css.processWrap}>PROGRESS (1/5)</p>
          <div className={css.progressDiv}>&nbsp;</div>
        </div> */}
        <div className={css.editListingContent}>
        <h2><FormattedMessage id="EditListingDescription.heading" /> </h2>

          <EditListingDescriptionForm
            className={css.form}
            initialValues={
              resetForm
                ? {}
                : {
                    businessName: publicData?.businessName,
                    email: publicData?.email,
                    abn: publicData?.abn,
                    website: publicData?.website,
                    instagram: publicData?.instagram,
                    facebook: publicData?.facebook,
                  }
            }
            saveActionMsg={submitButtonText}
            setResetForm={() => setResetForm(true)}
            onSubmit={values => {
              const { businessName, email, abn, website, instagram, facebook } = values;
              
              onSubmit({
                title: businessName.trim(),
                description: '',
                publicData: {
                  businessName: businessName.trim(),
                  email,
                  abn,
                  website,
                  instagram,
                  facebook,
                  listingType: 'editListing'
                },
              });
            }}
            onChange={onChange}
            disabled={disabled}
            ready={ready}
            updated={panelUpdated}
            updateInProgress={updateInProgress}
            fetchErrors={errors}
            publicData={publicData}
          />
        </div>
      </div>
    </div>
  );
};

EditListingDescriptionPanel.defaultProps = {
  className: null,
  rootClassName: null,
  errors: null,
  listing: null,
};

EditListingDescriptionPanel.propTypes = {
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

export default EditListingDescriptionPanel;
