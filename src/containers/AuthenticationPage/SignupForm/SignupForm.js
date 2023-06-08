import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from '../../../util/reactIntl';
import { Field, Form as FinalForm } from 'react-final-form';
import classNames from 'classnames';
import * as validators from '../../../util/validators';
import { Form, PrimaryButton, FieldTextInput, LocationAutocompleteInput } from '../../../components';

import css from './SignupForm.module.css';

const KEY_CODE_ENTER = 13;
const identity = v => v;

const SignupFormComponent = props => (
  <FinalForm
    {...props}
    render={fieldRenderProps => {
      const {
        rootClassName,
        className,
        formId,
        handleSubmit,
        inProgress,
        invalid,
        intl,
        onOpenTermsOfService,
        isMobile,
        desktopInputRoot,
        initialSearchFormValues,
      } = fieldRenderProps;

      // email
      const emailLabel = intl.formatMessage({
        id: 'SignupForm.emailLabel',
      });
      const emailPlaceholder = intl.formatMessage({
        id: 'SignupForm.emailPlaceholder',
      });
      const emailRequiredMessage = intl.formatMessage({
        id: 'SignupForm.emailRequired',
      });
      const emailRequired = validators.required(emailRequiredMessage);
      const emailInvalidMessage = intl.formatMessage({
        id: 'SignupForm.emailInvalid',
      });
      const emailValid = validators.emailFormatValid(emailInvalidMessage);

      //address

      const locationLabel = intl.formatMessage({
        id: 'SignupForm.locationLabel',
      });
      const locationRequiredMessage = intl.formatMessage({
        id: 'SignupForm.locationRequired',
      });
      const locationRequired = validators.required(locationRequiredMessage);
      // const emailInvalidMessage = intl.formatMessage({
      //   id: 'SignupForm.emailInvalid',
      // });
      const addressValid = validators.emailFormatValid(emailInvalidMessage);

      // password
      const passwordLabel = intl.formatMessage({
        id: 'SignupForm.passwordLabel',
      });
      const confirmPasswordLabel = intl.formatMessage({
        id: 'SignupForm.confirmPasswordLabel',
      });

      const passwordPlaceholder = intl.formatMessage({
        id: 'SignupForm.passwordPlaceholder',
      });
      const passwordRequiredMessage = intl.formatMessage({
        id: 'SignupForm.passwordRequired',
      });
      const passwordMinLengthMessage = intl.formatMessage(
        {
          id: 'SignupForm.passwordTooShort',
        },
        {
          minLength: validators.PASSWORD_MIN_LENGTH,
        }
      );
      const passwordMaxLengthMessage = intl.formatMessage(
        {
          id: 'SignupForm.passwordTooLong',
        },
        {
          maxLength: validators.PASSWORD_MAX_LENGTH,
        }
      );
      const passwordMinLength = validators.minLength(
        passwordMinLengthMessage,
        validators.PASSWORD_MIN_LENGTH
      );
      const passwordMaxLength = validators.maxLength(
        passwordMaxLengthMessage,
        validators.PASSWORD_MAX_LENGTH
      );
      const passwordRequired = validators.requiredStringNoTrim(passwordRequiredMessage);
      const passwordValidators = validators.composeValidators(
        passwordRequired,
        passwordMinLength,
        passwordMaxLength
      );

      // firstName
      const firstNameLabel = intl.formatMessage({
        id: 'SignupForm.firstNameLabel',
      });
      const firstNamePlaceholder = intl.formatMessage({
        id: 'SignupForm.firstNamePlaceholder',
      });
      const firstNameRequiredMessage = intl.formatMessage({
        id: 'SignupForm.firstNameRequired',
      });
      const firstNameRequired = validators.required(firstNameRequiredMessage);

      // lastName
      const lastNameLabel = intl.formatMessage({
        id: 'SignupForm.lastNameLabel',
      });
      const lastNamePlaceholder = intl.formatMessage({
        id: 'SignupForm.lastNamePlaceholder',
      });
      const lastNameRequiredMessage = intl.formatMessage({
        id: 'SignupForm.lastNameRequired',
      });
      const lastNameRequired = validators.required(lastNameRequiredMessage);

      const classes = classNames(rootClassName || css.root, className);
      const submitInProgress = inProgress;
      const submitDisabled = invalid || submitInProgress;

      const handleTermsKeyUp = e => {
        // Allow click action with keyboard like with normal links
        if (e.keyCode === KEY_CODE_ENTER) {
          onOpenTermsOfService();
        }
      };
      const termsLink = (
        <span
          className={css.termsLink}
          onClick={onOpenTermsOfService}
          role="button"
          tabIndex="0"
          onKeyUp={handleTermsKeyUp}
        >
          <FormattedMessage id="SignupForm.termsAndConditionsLinkText" />
        </span>
      );

      const desktopInputRootClass = desktopInputRoot || css.desktopInputRoot;

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          <div className={css.authFormFields}>
            <FieldTextInput
              className={css.firstNameRoot}
              type="text"
              id={formId ? `${formId}.fname` : 'fname'}
              name="fname"
              autoComplete="given-name"
              label={firstNameLabel}
              // placeholder={firstNamePlaceholder}
              validate={firstNameRequired}
            />
            <FieldTextInput
              className={css.lastNameRoot}
              type="text"
              id={formId ? `${formId}.lname` : 'lname'}
              name="lname"
              autoComplete="family-name"
              label={lastNameLabel}
              // placeholder={lastNamePlaceholder}
              validate={lastNameRequired}
            />
            <FieldTextInput
              type="email"
              id={formId ? `${formId}.email` : 'email'}
              name="email"
              autoComplete="email"
              label={emailLabel}
              // placeholder={emailPlaceholder}
              validate={validators.composeValidators(emailRequired, emailValid)}
            />
            <FieldTextInput
              className={css.password}
              type="password"
              id={formId ? `${formId}.password` : 'password'}
              name="password"
              autoComplete="new-password"
              label={passwordLabel}
              placeholder={passwordPlaceholder}
              validate={passwordValidators}
            />
            <FieldTextInput
              className={css.password}
              type="password"
              id={formId ? `${formId}.confirm-password` : 'confirm-password'}
              name="confirm-password"
              autoComplete="new-password"
              label={confirmPasswordLabel}
              placeholder={passwordPlaceholder}
              validate={passwordValidators}
            />
            {/* <FieldTextInput
              type="location"
              id={formId ? `${formId}.location` : 'location'}
              name="location"
              autoComplete="location"
              label={locationLabel}
              // placeholder={emailPlaceholder}
              validate={locationRequired}
            /> */}
            <div className={css.locationfld}>
              <label htmlFor="location">{locationLabel}</label>

              <Field
                name="location"
                format={identity}
                render={({ input, meta }) => {
                  const { onChange, ...restInput } = input;

                  // Merge the standard onChange function with custom behaviur. A better solution would
                  // be to use the FormSpy component from Final Form and pass this.onChange to the
                  // onChange prop but that breaks due to insufficient subscription handling.
                  // See: https://github.com/final-form/react-final-form/issues/159
                  const searchOnChange = value => {
                    onChange(value);
                    onChange(value);
                  };

                  let searchInput = { ...restInput, onChange: searchOnChange };
                  return (
                    <LocationAutocompleteInput
                      className={isMobile ? css.mobileInputRoot : desktopInputRootClass}
                      iconClassName={isMobile ? css.mobileIcon : css.desktopIcon}
                      inputClassName={isMobile ? css.mobileInput : css.desktopInput}
                      predictionsClassName={
                        isMobile ? css.mobilePredictions : css.desktopPredictions
                      }
                      predictionsAttributionClassName={
                        isMobile ? css.mobilePredictionsAttribution : null
                      }
                      placeholder={intl.formatMessage({ id: 'TopbarSearchForm.placeholder' })}
                      closeOnBlur={!isMobile}
                      inputRef={node => {
                        searchInput = node;
                      }}
                      useDefaultPredictions={false}
                      input={searchInput}
                      meta={meta}
                      isSignupLocation={true}
                    />
                  );
                }}
              />
            </div>
          </div>

          <div className={css.bottomWrapper}>
            {/* <p className={css.bottomWrapperText}>
              <span className={css.termsText}>
                <FormattedMessage
                  id="SignupForm.termsAndConditionsAcceptText"
                  values={{ termsLink }}
                />
              </span>
            </p> */}
            <PrimaryButton type="submit" inProgress={submitInProgress} disabled={submitDisabled}>
              <FormattedMessage id="SignupForm.signUp" />
            </PrimaryButton>
          </div>
        </Form>
      );
    }}
  />
);

SignupFormComponent.defaultProps = { inProgress: false };

const { bool, func } = PropTypes;

SignupFormComponent.propTypes = {
  inProgress: bool,

  onOpenTermsOfService: func.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const SignupForm = compose(injectIntl)(SignupFormComponent);
SignupForm.displayName = 'SignupForm';

export default SignupForm;
