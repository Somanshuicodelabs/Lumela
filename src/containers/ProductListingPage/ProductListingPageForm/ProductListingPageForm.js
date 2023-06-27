import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Field, Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../../util/types';
import { maxLength, required, composeValidators } from '../../../util/validators';
import * as validators from '../../../util/validators';
import { Form, Button, FieldTextInput, NamedLink, AddImages, ValidationError, FieldSelect, FieldRadioButton } from '../../../components';
import css from './ProductListingPageForm.module.css';
import IconCollection from '../../../components/IconCollection/IconCollection';
import IconCamera from '../../../components/IconCamera/IconCamera';
import { } from '../../../examples';

const TITLE_MAX_LENGTH = 60;
const ACCEPT_IMAGES = 'image/*';

const EditListingProductFormComponent = props => (
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

            const allocateUniqueProduct = intl.formatMessage({
                id: 'ProductListingPage.allocateUniqueProduct',
            });
            const yesPleaseLabel = intl.formatMessage({
                id: 'ProductListingPage.yesPleaseLabel',
            });
            const noPleaseLabel = intl.formatMessage({
                id: 'ProductListingPage.noPleaseLabel',
            });
            const stockQuantityLabel = intl.formatMessage({
                id: 'ProductListingPage.stockQuantityLabel',
            });
            const maxNoLabel = intl.formatMessage({
                id: 'ProductListingPage.maxNoLabel',
            });
            const yesLabel = intl.formatMessage({
                id: 'ProductListingPage.yesLabel',
            });
            const noLabel = intl.formatMessage({
                id: 'ProductListingPage.noLabel',
            });
            const notAllowLabel = intl.formatMessage({
                id: 'ProductListingPage.notAllowLabel',
            });
            const allowLabel = intl.formatMessage({
                id: 'ProductListingPage.allowLabel',
            });
            const allowNotifyLabel = intl.formatMessage({
                id: 'ProductListingPage.allowNotifyLabel',
            });

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
                    <div className={css.mainWrapper}>
                        <div className={css.content}>
                            <h3 className={css.formHeading}>
                                <FormattedMessage id='ProductListingPage.productDetails' />
                            </h3>
                            <div className={css.productFormWrapper}>
                                <div className={css.formLeftInput}>
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
                                    <div className={css.rowInput}>
                                        <FieldTextInput
                                            id="size"
                                            name="size"
                                            className={css.inputBox}
                                            type="text"
                                            label="size"
                                            validate={validators.composeValidators(emailRequired, emailValid)}
                                        />
                                        <FieldTextInput
                                            id="color"
                                            name="color"
                                            className={css.inputBox}
                                            type="text"
                                            label="color"
                                            validate={validators.composeValidators(emailRequired, emailValid)}
                                        />
                                    </div>
                                    <FieldSelect
                                        id="category"
                                        name="category"
                                        className={css.inputBox}
                                        label="category"
                                    >
                                        <option disabled value="Select">Select</option>
                                        <option value="">Category for this product</option>
                                    </FieldSelect>
                                    <FieldTextInput
                                        id="sort description"
                                        name="sort description"
                                        className={css.inputBox}
                                        type="text"
                                        label="sort description"
                                        placeholder="sort description"
                                    />
                                    <FieldTextInput
                                        id="sort"
                                        name="sort"
                                        className={css.inputBox}
                                        type="text"
                                        label="add a sellers note for this description"
                                    />
                                    <FieldTextInput
                                        id="seller"
                                        name="seller"
                                        className={css.inputBox}
                                        type="text"
                                        label="Add a sellers note for this product "
                                    />
                                </div>
                                <div className={css.formRightInput}>
                                    <div className={css.costBox}>
                                        <FieldTextInput
                                            id="cost"
                                            name="cost"
                                            className={css.inputBox}
                                            type="text"
                                            label="Cost (AUD)"
                                        />
                                    </div>
                                    <div className={css.gallaryContainer}>
                                        <label htmlFor="images" className={css.photoLabel}>Photos</label>
                                        <div className={css.imagesGallaryGrid}>
                                            <AddImages
                                                className={css.imagesField}
                                                // className={classNames(
                                                //   
                                                //   images.length == 1 && css.imagesField1,
                                                //   images.length == 2 && css.imagesField2,
                                                //   images.length == 3 && css.imagesField3,
                                                //   images.length > 3 && css.imagesFieldBig
                                                // )}
                                                images={images}
                                                thumbnailClassName={css.thumbnail}
                                                savedImageAltText={intl.formatMessage({
                                                    id: 'EditListingPhotosForm.savedImageAltText',
                                                })}
                                                onRemoveImage={onRemoveImage}
                                            >
                                                <Field
                                                    id="addImage"
                                                    name="addImage"
                                                    accept={ACCEPT_IMAGES}
                                                    form={null}
                                                    label={chooseImageText}
                                                    type="file"
                                                    disabled={imageUploadRequested}
                                                >
                                                    {fieldprops => {
                                                        const { accept, input, label, disabled: fieldDisabled } = fieldprops;
                                                        const { name, type } = input;
                                                        const onChange = e => {
                                                            const file = e.target.files[0];
                                                            form.change(`addImage`, file);
                                                            form.blur(`addImage`);
                                                            onImageUploadHandler(file);
                                                        };
                                                        const inputProps = { accept, id: name, name, onChange, type };
                                                        return (
                                                            <div className={css.addImageWrapper}>
                                                                <div className={css.aspectRatioWrapper}>
                                                                    {fieldDisabled ? null : (
                                                                        <input {...inputProps} multiple className={css.addImageInput} />
                                                                    )}
                                                                    <label htmlFor={name} className={css.addImage}>
                                                                        {label}
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        );
                                                    }}
                                                </Field>
                                                <Field
                                                    component={props => {
                                                        const { input, meta } = props;
                                                        return (
                                                            <div className={css.imageRequiredWrapper}>
                                                                <input {...input} />
                                                                <ValidationError fieldMeta={meta} />
                                                            </div>
                                                        );
                                                    }}
                                                    name="images"
                                                    type="hidden"
                                                    validate={composeValidators(validators.nonEmptyArray(imageRequiredMessage))}
                                                />
                                            </AddImages>
                                            {images?.length == 0 ? (
                                                <>
                                                    <div className={css.imageBox}>
                                                        <IconCollection name="ADD_IMAGE_ICON" />
                                                    </div>
                                                    <div className={css.imageBox}>
                                                        <IconCollection name="ADD_IMAGE_ICON" />
                                                    </div>
                                                    <div className={css.imageBox}>
                                                        <IconCollection name="ADD_IMAGE_ICON" />
                                                    </div>
                                                </>
                                            ) : images?.length == 1 ? (
                                                <>
                                                    <div className={css.imageBox}>
                                                        <IconCollection name="ADD_IMAGE_ICON" />
                                                    </div>
                                                    <div className={css.imageBox}>
                                                        <IconCollection name="ADD_IMAGE_ICON" />
                                                    </div>
                                                </>
                                            ) : images?.length == 2 ? (
                                                <div className={css.imageBox}>
                                                    <IconCollection name="ADD_IMAGE_ICON" />
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className={css.tagsInput}>
                                        <FieldTextInput
                                            id="Tags"
                                            name="Tags"
                                            className={css.inputBox}
                                            type="text"
                                            label="Tags"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={css.content}>
                            <h3 className={css.formHeading}>
                                <FormattedMessage id='ProductListingPage.stockMangement' />
                            </h3>
                            <div className={css.stockContent}>
                                <div className={css.stockLeft}>
                                    <FieldTextInput
                                        id="sort"
                                        name="sort"
                                        className={css.inputBox}
                                        type="text"
                                        label={allocateUniqueProduct}
                                    />
                                    <div className={css.rowInput}>
                                        <div className={css.mainRowBox}>
                                            <h3 className={css.stockHeading}>
                                                <FormattedMessage id="ProductListingPage.lumelaStockManager" />
                                            </h3>
                                            <div className={css.radioLabelName}>
                                                <FormattedMessage id="ProductListingPage.wantHelpManageProduct" />
                                            </div>
                                            <div className={css.radioRow}>
                                                <FieldRadioButton
                                                    id="yes"
                                                    name="yes"
                                                    label={yesPleaseLabel}
                                                    value="yes"
                                                    className={css.radioButton}
                                                />
                                                <FieldRadioButton
                                                    id="no"
                                                    name="no"
                                                    label={noPleaseLabel}
                                                    value="no"
                                                    className={css.radioButton}
                                                />
                                            </div>
                                            <FieldTextInput
                                                id="stockQuantity"
                                                name="stockQuantity"
                                                className={css.inputBox}
                                                type="text"
                                                label={stockQuantityLabel}
                                            />
                                        </div>
                                        <div className={css.mainRowBox}>
                                            <h3 className={css.stockHeading}>
                                                <FormattedMessage id="ProductListingPage.orderLimits" />
                                            </h3>
                                            <div className={css.radioLabelName}>
                                                <FormattedMessage id="ProductListingPage.doYouWantPut" />
                                            </div>
                                            <div className={css.radioRow}>
                                                <FieldRadioButton
                                                    id="yes"
                                                    name="yes"
                                                    label={yesLabel}
                                                    value="yes"
                                                    className={css.radioButton}
                                                />
                                                <FieldRadioButton
                                                    id="no"
                                                    name="no"
                                                    label={noLabel}
                                                    value="no"
                                                    className={css.radioButton}
                                                />
                                            </div>
                                            <FieldTextInput
                                                id="maxNo"
                                                name="maxNo"
                                                className={css.inputBox}
                                                type="text"
                                                label={maxNoLabel}
                                            />
                                        </div>
                                    </div>
                                    <div className={css.backOrder}>
                                        <div className={css.radioLabelName}>
                                            <FormattedMessage id="ProductListingPage.allowBackorders" />
                                        </div>
                                        <div className={css.radioRowInput}>
                                            <FieldRadioButton
                                                id="notAllow"
                                                name="notAllow"
                                                label={notAllowLabel}
                                                value="notAllow"
                                                className={css.radioButton}
                                            />
                                            <FieldRadioButton
                                                id="allow"
                                                name="allow"
                                                label={allowLabel}
                                                value="allow"
                                                className={css.radioButton}
                                            />
                                            <FieldRadioButton
                                                id="allowNotify"
                                                name="allowNotify"
                                                label={allowNotifyLabel}
                                                value="allowNotify"
                                                className={css.radioButton}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
            );
        }}
    />
);

EditListingProductFormComponent.defaultProps = { className: null, fetchErrors: null };

EditListingProductFormComponent.propTypes = {
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

export default compose(injectIntl)(EditListingProductFormComponent);