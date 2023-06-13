import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../../../util/types';
import { maxLength, required, composeValidators } from '../../../../util/validators';
import * as validators from '../../../../util/validators';
import { Form, Button, FieldTextInput, NamedLink } from '../../../../components';
import css from './EditListingDescriptionForm.module.css';

const TITLE_MAX_LENGTH = 60;

const EditListingDescriptionFormComponent = props => (
  <FinalForm
    {...props}
    render={formRenderProps => {
      const {
        className,
        disabled,
        ready,
        handleSubmit,
        intl,
        form,
        values,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
        setResetForm,
        publicData,
      } = formRenderProps;

      const businessNameMessage = intl.formatMessage({
        id: 'EditListingDescriptionForm.businessName',
      });
      const businessNRequiredMessage = intl.formatMessage({
        id: 'EditListingDescriptionForm.businessnameRequired',
      });
      const abnRequiredMessage = intl.formatMessage({
        id: 'EditListingDescriptionForm.abnRequired',
      });
      const maxLengthMessage = intl.formatMessage(
        { id: 'EditListingDescriptionForm.maxLength' },
        {
          maxLength: TITLE_MAX_LENGTH,
        }
      );

      const PhoneMessage = intl.formatMessage({ id: 'EditListingDescriptionForm.Phone' });
      const EmailMessage = intl.formatMessage({ id: 'EditListingDescriptionForm.Email' });
      const WebsiteMessage = intl.formatMessage({ id: 'EditListingDescriptionForm.Website' });
      const InstagramMessage = intl.formatMessage({ id: 'EditListingDescriptionForm.Instagram' });
      const FacebookMessage = intl.formatMessage({ id: 'EditListingDescriptionForm.Facebook' });

      const maxLength60Message = maxLength(maxLengthMessage, TITLE_MAX_LENGTH);
      const emailRequiredMessage = intl.formatMessage({
        id: 'SignupForm.emailRequired',
      });
      const emailRequired = validators.required(emailRequiredMessage);
      const emailInvalidMessage = intl.formatMessage({
        id: 'SignupForm.emailInvalid',
      });
      const emailValid = validators.emailFormatValid(emailInvalidMessage);

      const { updateListingError, createListingDraftError, showListingsError } = fetchErrors || {};
      const errorMessageUpdateListing = updateListingError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingDescriptionForm.updateFailed" />
        </p>
      ) : null;

      // This error happens only on first tab (of EditListingWizard)
      const errorMessageCreateListingDraft = createListingDraftError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingDescriptionForm.createListingDraftError" />
        </p>
      ) : null;

      const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingDescriptionForm.showListingFailed" />
        </p>
      ) : null;

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;

      const containsSameValues =
        publicData &&
        publicData.businessName == values.businessName &&
        publicData.phone == values.phone &&
        publicData.email == values.email;

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessageCreateListingDraft}
          {errorMessageUpdateListing}
          {errorMessageShowListing}
          <FieldTextInput
            id="businessName"
            name="businessName"
            className={css.inputBox}
            type="text"
            label={businessNameMessage}
            // maxLength={TITLE_MAX_LENGTH}
            validate={composeValidators(required(businessNRequiredMessage), maxLength60Message)}
            autoFocus
            required
          />
          <FieldTextInput
            id="abn"
            name="abn"
            className={css.inputBox}
            label={PhoneMessage}
            validate={required(abnRequiredMessage)}
            />
          <FieldTextInput
            id="email"
            name="email"
            className={css.inputBox}
            type="email"
            label={EmailMessage}
            validate={validators.composeValidators(emailRequired, emailValid)}
            />
          <FieldTextInput
            id="website"
            name="website"
            className={css.inputBox}
            type="text"
            label={WebsiteMessage}
           />
          <FieldTextInput
            id="instagram"
            name="instagram"
            className={css.inputBox}
            type="text"
            label={InstagramMessage}
           />
          <FieldTextInput
            id="facebook"
            name="facebook"
            className={css.inputBox}
            type="text"
            label={FacebookMessage}
           />
          <div className={css.fixedBottomFooter}>
            <div className={css.fixedWidthContainer}>
              <NamedLink name="BusinessLandingPage"><Button className={css.cancelButton} type="button" onClick={() => form.reset()}>
                Cancel
              </Button></NamedLink>
              <span className={css.stepNumber}>Step 1 of 7</span>
              <Button
                className={classNames(css.submitButton, "disableButton")}
                type="submit"
                inProgress={submitInProgress}
                disabled={submitDisabled}
              // ready={submitReady}
              >
                {saveActionMsg}
              </Button>
            </div>
          </div>
        </Form>
      );
    }}
  />
);

EditListingDescriptionFormComponent.defaultProps = { className: null, fetchErrors: null };

EditListingDescriptionFormComponent.propTypes = {
  className: string,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    createListingDraftError: propTypes.error,
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
};

export default compose(injectIntl)(EditListingDescriptionFormComponent);
