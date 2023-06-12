import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import classNames from 'classnames';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FormattedMessage } from '../../../../util/reactIntl';
import { propTypes } from '../../../../util/types';
import { Button, FieldCheckbox, FieldTextInput, Form, NamedLink } from '../../../../components'
import css from './EditListingOffersForm.module.css';
// import { offers } from '../../marketplace-custom-config';

const EditListingOffersFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    keepDirtyOnReinitialize={true}
    render={formRenderProps => {
      const {
        disabled,
        ready,
        rootClassName,
        className,
        handleSubmit,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
        onPrevious,
        values,
        form
      } = formRenderProps;

      const classes = classNames(rootClassName || css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = disabled || submitInProgress || !(values.offers && values.offers.length) || values.offers.includes("other") && !values.otherOfferType?.length ;

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
          <div className={css.offerList}>
            {offers.map((e) =>
              <div className={css.offeredServices}>
                <div className={css.serviceBlock}>
                  {values.offers && values.offers.map((f, i) => e.key == f ? <p className={css.numberCount}>{i + 1} </p> : null)}
                  <img src={e.icon} />
                  <h6>{e.value}</h6>
                  <FieldCheckbox id={e.key} name={'offers'} value={e.key} />
                </div>
              </div>)}
          </div>
          <div className={css.otherInput}>
            <FieldTextInput id="otherOfferType" name="otherOfferType" label={"Other (please type below)"} />
          </div>
          <div className={css.fixedBottomFooter}>
            <div className={css.fixedWidthContainer}>
              <NamedLink name="BusinessLandingPage"><Button className={css.cancelButton} type="button" onClick={() => form.reset()}>
                Cancel
              </Button></NamedLink>
              <span className={css.stepNumber}>Step 3 of 7</span>
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

EditListingOffersFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  fetchErrors: null,
  // filterConfig: config.custom.filters,
};

EditListingOffersFormComponent.propTypes = {
  rootClassName: string,
  className: string,
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

const EditListingOffersForm = EditListingOffersFormComponent;

export default EditListingOffersForm;
