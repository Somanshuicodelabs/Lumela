import React, { useState } from 'react';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Field, Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../../util/types';
import { maxLength, required, composeValidators } from '../../../util/validators';
import * as validators from '../../../util/validators';
import { Form, Button, FieldTextInput, NamedLink, AddImages, ValidationError, FieldSelect, FieldRadioButton, FieldCurrencyInput, Modal, FieldPhoneNumberInput } from '../../../components';
import css from './AdministratorFormPage.module.css';
import IconCollection from '../../../components/IconCollection/IconCollection';
import IconCamera from '../../../components/IconCamera/IconCamera';
import { } from '../../../examples';
import { types as sdkTypes } from '../../../util/sdkLoader';
import { formatMoney } from '../../../util/currency';
import appSettings from '../../../config/settings';
import { useConfiguration } from '../../../context/configurationContext';
import { isEqual } from 'lodash';
import { offers } from '../../../marketplace-custom-config'

const TITLE_MAX_LENGTH = 60;
const ACCEPT_IMAGES = 'image/*';

const ORDERLIMITYES = "yes"
const ORDERLIMITNO = "no"


const AdministratorFormPageComponent = props => {
    return (
        <FinalForm
            {...props}
            keepDirtyOnReinitialize={true}
            render={formRenderProps => {
                const {
                    className,
                    disabled,
                    ready,
                    handleSubmit,
                    handleValuesDraft,
                    handleValues,
                    intl,
                    form,
                    values,
                    invalid,
                    pristine,
                    saveActionMsg,
                    updated,
                    updateInProgress,
                    fetchErrors,
                    images,
                    autoFocus,
                    unitType,
                    onRemoveImage,
                    formId,
                    listingMinimumPriceSubUnits,
                    marketplaceCurrency
                } = formRenderProps;

                const { updateListingError, createListingDraftError, showListingsError } = fetchErrors || {};
                const errorMessageUpdateListing = updateListingError ? (
                    <p className={css.error}>
                        <FormattedMessage id="EditListingDescriptionForm.updateFailed" />
                    </p>
                ) : null;


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


                return (
                    <Form className={classes} onSubmit={e => {
                        setSubmittedImages(images);
                        handleValuesDraft()
                        handleSubmit(e);
                    }}>
                        {errorMessageCreateListingDraft}
                        {errorMessageUpdateListing}
                        {errorMessageShowListing}
                        <div className={css.mainWrapper}>
                            <div className={css.content}>
                                <h3 className={css.formHeading}>
                                    <FormattedMessage id='ProductListingPage.productDetails' />
                                </h3>
                                <div className={css.productFormWrapper}>
                                    <div className={css.formLeftInput}>
                                        <FieldTextInput
                                            id="name"
                                            name="name"
                                            className={css.inputBox}
                                            type="name"
                                            label="NAME"
                                            // maxLength={TITLE_MAX_LENGTH}
                                            // validate={composeValidators(required(businessNRequiredMessage), maxLength60Message)}
                                            autoFocus
                                        // required
                                        />
                                        <FieldTextInput
                                            id="url"
                                            name="url"
                                            className={css.inputBox}
                                            label="URL"
                                        // validate={required(abnRequiredMessage)}
                                        />
                                        <div className={css.rowInput}>
                                            <FieldTextInput
                                                id="email"
                                                name="email"
                                                className={css.inputBox}
                                                type="email"
                                                label="EMAIL"
                                            // validate={validators.composeValidators(emailRequired, emailValid)}
                                            />
                                            <FieldPhoneNumberInput
                                                id="phone"
                                                name="phone"
                                                className={css.inputBox}
                                                type="phone"
                                                label="PHONE"
                                            // validate={validators.composeValidators(emailRequired, emailValid)}
                                            />
                                            <FieldTextInput
                                                id="about"
                                                name="about"
                                                className={css.inputBox}
                                                type="about"
                                                label="ABOUT US"
                                            // validate={validators.composeValidators(emailRequired, emailValid)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <FormattedMessage id='ProductListingPage.productDetails' />

                                </div>
                            </div>
                        </div>
                    </Form>
                );
            }}
        />
    )
};

AdministratorFormPageComponent.defaultProps = { className: null, fetchErrors: null, listingMinimumPriceSubUnits: 0, formId: 'EditListingPricingAndStockForm' };

AdministratorFormPageComponent.propTypes = {
    formId: string,
    className: string,
    intl: intlShape.isRequired,
    marketplaceCurrency: string.isRequired,
    onRemoveListingImage: func.isRequired,
    listingMinimumPriceSubUnits: number,
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

export default compose(injectIntl)(AdministratorFormPageComponent);