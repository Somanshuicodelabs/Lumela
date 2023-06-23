import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Field, Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../../util/types';
import { maxLength, required, composeValidators } from '../../../util/validators';
import * as validators from '../../../util/validators';
import { Form, Button, FieldTextInput, NamedLink, AddImages, ValidationError } from '../../../components';
import css from './ServiceListingPageForm.module.css';
import IconCollection from '../../../components/IconCollection/IconCollection';
import IconCamera from '../../../components/IconCamera/IconCamera';

const TITLE_MAX_LENGTH = 60;
const ACCEPT_IMAGES = 'image/*';

const EditListingServiceFormComponent = props => (
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
                imageUploadRequested,
                updated,
                updateInProgress,
                fetchErrors,
                setResetForm,
                images,
                publicData,
                onRemoveImage
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

            const imageRequiredMessage = intl.formatMessage({
                id: 'EditListingPhotosForm.imageRequired',
            });

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

            const chooseImageText = (
                <span className={css.chooseImageText}>
                    <IconCamera />
                    <span className={css.chooseImage}>
                        <FormattedMessage id="EditListingPhotosForm.chooseImage" />
                    </span>
                    {/* <span className={css.imageTypes}>
            <FormattedMessage id="EditListingPhotosForm.imageTypes" />
          </span> */}
                </span>
            );

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
                    <div>
                        <FieldTextInput
                            id="title"
                            name="title"
                            className={css.inputBox}
                            type="text"
                            label="title"
                            // maxLength={TITLE_MAX_LENGTH}
                            validate={composeValidators(required(businessNRequiredMessage), maxLength60Message)}
                            autoFocus
                            required
                        />
                        <FieldTextInput
                            id="brand"
                            name="brand"
                            className={css.inputBox}
                            label="brand"
                            validate={required(abnRequiredMessage)}
                        />
                        <FieldTextInput
                            id="color"
                            name="color"
                            className={css.inputBox}
                            type="text"
                            label="color"
                            validate={validators.composeValidators(emailRequired, emailValid)}
                        />
                        <FieldTextInput
                            id="size"
                            name="size"
                            className={css.inputBox}
                            type="text"
                            label="size"
                            validate={validators.composeValidators(emailRequired, emailValid)}
                        />
                        <FieldTextInput
                            id="category"
                            name="category"
                            className={css.inputBox}
                            type="text"
                            label="category"
                        />
                        <FieldTextInput
                            id="instagram"
                            name="instagram"
                            className={css.inputBox}
                            type="text"
                            label={InstagramMessage}
                        />
                        <FieldTextInput
                            id="sort description"
                            name="sort description"
                            className={css.inputBox}
                            type="text"
                            label="sort description"
                        />
                        <FieldTextInput
                            id="sort"
                            name="sort"
                            className={css.inputBox}
                            type="text"
                            label="add a sellers note for this description"
                        />
                        <FieldTextInput
                            id="cost"
                            name="cost"
                            className={css.inputBox}
                            type="text"
                            label="cost"
                        />
                        <FieldTextInput
                            id="Photos"
                            name="Photos"
                            className={css.inputBox}
                            type="text"
                            label="Photos"
                        />
                        <FieldTextInput
                            id="Tags"
                            name="Tags"
                            className={css.inputBox}
                            type="text"
                            label="Tags"
                        />
                    </div>
                    <div>
                        <FieldTextInput
                            id="Photos"
                            name="Photos"
                            className={css.inputBox}
                            type="text"
                            label="Photos"
                        />
                        <FieldTextInput
                            id="Tags"
                            name="Tags"
                            className={css.inputBox}
                            type="text"
                            label="Tags"
                        />
                    </div>
                </Form>
            );
        }}
    />
);

EditListingServiceFormComponent.defaultProps = { className: null, fetchErrors: null };

EditListingServiceFormComponent.propTypes = {
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

export default compose(injectIntl)(EditListingServiceFormComponent);