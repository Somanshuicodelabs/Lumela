import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../../../util/types';
import { Form, Button, FieldCheckbox, NamedLink } from '../../../../components';
import css from './EditListingHairTexturesForm.module.css';
import { hairTextures } from '../../../../marketplace-custom-config';

export const EditListingHairTexturesFormComponent = props => (
  <FinalForm
    {...props}
    render={formRenderProps => {
      const {
        className,
        disabled,
        ready,
        handleSubmit,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
        form,
        values,
        onPrevious,
      } = formRenderProps;

      const titleRequiredMessage = intl.formatMessage({ id: 'EditListingLocationForm.address' });
      const addressPlaceholderMessage = intl.formatMessage({
        id: 'EditListingLocationForm.addressPlaceholder',
      });
      const addressRequiredMessage = intl.formatMessage({
        id: 'EditListingLocationForm.addressRequired',
      });
      const addressNotRecognizedMessage = intl.formatMessage({
        id: 'EditListingLocationForm.addressNotRecognized',
      });

      const optionalText = intl.formatMessage({
        id: 'EditListingLocationForm.optionalText',
      });

      const buildingMessage = intl.formatMessage(
        { id: 'EditListingLocationForm.building' },
        { optionalText: optionalText }
      );
      const buildingPlaceholderMessage = intl.formatMessage({
        id: 'EditListingLocationForm.buildingPlaceholder',
      });

      const { updateListingError, showListingsError } = fetchErrors || {};
      const errorMessage = updateListingError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingLocationForm.updateFailed" />
        </p>
      ) : null;

      const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingLocationForm.showListingFailed" />
        </p>
      ) : null;

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress ||!(values.hairTextures&&values.hairTextures.length);
      // const options = findOptionsForSelectFilter('hairTextures', filterConfig);
      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessage}
          {errorMessageShowListing}
          {
            hairTextures.map((e) => {
              return (
                <div className={css.offeredServices}>
                  <div className={css.serviceBlock}>
                    <FieldCheckbox id={e.key} name={'hairTextures'} label={e.value} value={e.key} />
                    <img src={e.icon} />
                    <h6>{e.value}</h6>
                  </div>
                </div>

              )
            })
          }

          <div className={css.fixedBottomFooter}>
            <div className={css.fixedWidthContainer}>
              <NamedLink name="BusinessLandingPage"><Button className={css.cancelButton} type="button" onClick={() => form.reset()}>
                Cancel
              </Button></NamedLink>
              <span className={css.stepNumber}>Step 4 of 7</span>
              <div className={css.rightButtons}>
                <Button
                  className={css.borderButton}
                  type="button"
                  onClick={onPrevious}
                >
                  Previous
                </Button>
                <Button
                className={classNames(css.submitButton, "disableButton")}
                  type="submit"
                  inProgress={submitInProgress}
                  disabled={submitDisabled}
                  ready={submitReady}
                >
                  {saveActionMsg}
                </Button>
              </div>
            </div>
          </div>
        </Form>
      );
    }}
  />
);

EditListingHairTexturesFormComponent.defaultProps = {
  selectedPlace: null,
  fetchErrors: null,
};

EditListingHairTexturesFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  selectedPlace: propTypes.place,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
};

export default compose(injectIntl)(EditListingHairTexturesFormComponent);
