import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import classNames from 'classnames';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FormattedMessage, injectIntl, intlShape } from '../../../../util/reactIntl';
import { propTypes } from '../../../../util/types';
// import config from '../../config';
import { Button, FieldCheckbox, FieldRadioButton, FieldTextInput, Form } from '../../../../components'
import css from './EditListingBookingSystemForm.module.css';
import { bookingSystem } from '../../../../marketplace-custom-config';
import { compose } from 'redux';

const EditListingBookingSystemFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    render={formRenderProps => {
      const {
        disabled,
        ready,
        rootClassName,
        className,
        name,
        handleSubmit,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
        onPrevious,
        values,
        intl,
        form,
      } = formRenderProps;

      const otherRequiredMessage = intl.formatMessage({
        id: "EditListingBookingSystemForm.otherRequired",
      });
      
      const classes = classNames(rootClassName || css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = disabled || submitInProgress || (values?.bookingSystem == "other"&& !values.other);

      const { updateListingError, showListingsError } = fetchErrors || {};
      const errorMessage = updateListingError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingFeaturesForm.updateFailed" />
        </p>
      ) : null;

      const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingFeaturesForm.showListingFailed" />
        </p>
      ) : null;
 
      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessage}
          {errorMessageShowListing}
          {
            bookingSystem.map((e) => {
              return (
                <div className={css.offeredServices}>
                  <div className={css.serviceBlock}>
                    <FieldRadioButton id={e.key} name={'bookingSystem'} label={e.value} value={e.key} />
                    <img src={e.icon} />
                  </div>
                </div>

              )
            })
          }
          <div className={css.offeredServices}>
          <div className={css.serviceBlock}>
            <FieldTextInput
            id="other"
            name="other"
            label=""
            // validate={values?.bookingSystem == "other" ? composeValidators(required(otherRequiredMessage)) :""}
           />
          </div>
         </div>

          <div className={css.fixedBottomFooter}>
            <div className={css.fixedWidthContainer}>
              <Button className={css.cancelButton} type="button" onClick={() => form.reset()}>
                Cancel
              </Button>
              <div className={css.stepNumber}>Step 7 of 7</div>
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
                  SEND REQUEST
                </Button>
              </div>
            </div>
          </div>
        </Form>
      );
    }}
  />
);

EditListingBookingSystemFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  fetchErrors: null,
  // filterConfig: config.custom.filters,
};

EditListingBookingSystemFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  intl: intlShape.isRequired,
  name: string.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
  filterConfig: propTypes.filterConfig,
};

const EditListingBookingSystemForm = EditListingBookingSystemFormComponent;

export default  compose(injectIntl) (EditListingBookingSystemForm);

