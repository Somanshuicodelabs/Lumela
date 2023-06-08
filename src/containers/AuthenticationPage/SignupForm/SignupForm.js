import React from 'react';
import { bool, node } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import classNames from 'classnames';

import { FormattedMessage, injectIntl, intlShape } from '../../../util/reactIntl';
import * as validators from '../../../util/validators';
import { Form,
         PrimaryButton, 
         FieldTextInput,
         LocationAutocompleteInput 
       } from '../../../components';

import css from './SignupForm.module.css';

const KEY_CODE_ENTER = 13;
const identity = v => v;
const SignupFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    render={fieldRenderProps => {
      const {
        rootClassName,
        className,
        formId,
        handleSubmit,
        inProgress,
        invalid,
        intl,
        termsAndConditions,
        isMobile,
        desktopInputRoot,
      } = fieldRenderProps;

      // email
      const emailRequired = validators.required(
        intl.formatMessage({
          id: 'SignupForm.emailRequired',
        })
      );
      const emailValid = validators.emailFormatValid(
        intl.formatMessage({
          id: 'SignupForm.emailInvalid',
        })
      );

      // password
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


      const classes = classNames(rootClassName || css.root, className);
      const submitInProgress = inProgress;
      const submitDisabled = invalid || submitInProgress;
      const desktopInputRootClass = desktopInputRoot || css.desktopInputRoot;

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          <div>
            <FieldTextInput
              type="email"
              id={formId ? `${formId}.email` : 'email'}
              name="email"
              autoComplete="email"
              label={intl.formatMessage({
                id: 'SignupForm.emailLabel',
              })}
              placeholder={intl.formatMessage({
                id: 'SignupForm.emailPlaceholder',
              })}
              validate={validators.composeValidators(emailRequired, emailValid)}
            />
            <div className={css.name}>
              <FieldTextInput
                className={css.firstNameRoot}
                type="text"
                id={formId ? `${formId}.fname` : 'fname'}
                name="fname"
                autoComplete="given-name"
                label={intl.formatMessage({
                  id: 'SignupForm.firstNameLabel',
                })}
                placeholder={intl.formatMessage({
                  id: 'SignupForm.firstNamePlaceholder',
                })}
                validate={validators.required(
                  intl.formatMessage({
                    id: 'SignupForm.firstNameRequired',
                  })
                )}
              />
              <FieldTextInput
                className={css.lastNameRoot}
                type="text"
                id={formId ? `${formId}.lname` : 'lname'}
                name="lname"
                autoComplete="family-name"
                label={intl.formatMessage({
                  id: 'SignupForm.lastNameLabel',
                })}
                placeholder={intl.formatMessage({
                  id: 'SignupForm.lastNamePlaceholder',
                })}
                validate={validators.required(
                  intl.formatMessage({
                    id: 'SignupForm.lastNameRequired',
                  })
                )}
              />
            </div>
            <FieldTextInput
              className={css.password}
              type="password"
              id={formId ? `${formId}.password` : 'password'}
              name="password"
              autoComplete="new-password"
              label={intl.formatMessage({
                id: 'SignupForm.passwordLabel',
              })}
              placeholder={intl.formatMessage({
                id: 'SignupForm.passwordPlaceholder',
              })}
              validate={passwordValidators}
            />
            <FieldTextInput
              className={css.password}
              type="password"
              id={formId ? `${formId}.confirm-password` : 'confirm-password'}
              name="confirm-password"
              autoComplete="new-password"
              label={confirmpasswordLabel}
              placeholder={passwordPlaceholder}
              validate={passwordValidators}
            />
          </div>
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

          <div className={css.bottomWrapper}>
            {termsAndConditions}
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

SignupFormComponent.propTypes = {
  inProgress: bool,
  termsAndConditions: node.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const SignupForm = compose(injectIntl)(SignupFormComponent);
SignupForm.displayName = 'SignupForm';

export default SignupForm;
