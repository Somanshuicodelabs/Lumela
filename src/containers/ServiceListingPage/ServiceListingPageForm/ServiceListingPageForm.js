import React, { useState } from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Field, Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../../util/types';
import { maxLength, required, composeValidators } from '../../../util/validators';
import * as validators from '../../../util/validators';
import { Form, Button, FieldTextInput, NamedLink, AddImages, ValidationError, FieldSelect, FieldRadioButton, FieldCurrencyInput, AspectRatioWrapper } from '../../../components';
import css from './ServiceListingPageForm.module.css';
import IconCollection from '../../../components/IconCollection/IconCollection';
import IconCamera from '../../../components/IconCamera/IconCamera';
import { } from '../../../examples';
import appSettings from '../../../config/settings';
import { isUploadImageOverLimitError } from '../../../util/errors';
import { isEqual } from 'lodash';
import { FieldArray } from 'react-final-form-arrays';
// import { FieldAddImage } from '../../EditListingPage/EditListingWizard/EditListingPhotosPanel/EditListingPhotosForm';
import arrayMutators from 'final-form-arrays';
import ListingImage from '../../EditListingPage/EditListingWizard/EditListingPhotosPanel/ListingImage';
import { offers } from '../../../marketplace-custom-config';

const TITLE_MAX_LENGTH = 60;
const ACCEPT_IMAGES = 'image/*';

// const ImageUploadError = props => {
//     return props.uploadOverLimit ? (
//       <p className={css.error}>
//         <FormattedMessage id="EditListingPhotosForm.imageUploadFailed.uploadOverLimit" />
//       </p>
//     ) : props.uploadImageError ? (
//       <p className={css.error}>
//         <FormattedMessage id="EditListingPhotosForm.imageUploadFailed.uploadFailed" />
//       </p>
//     ) : null;
//   };
  
  // NOTE: PublishListingError and ShowListingsError are here since Photos panel is the last visible panel
  // before creating a new listing. If that order is changed, these should be changed too.
  // Create and show listing errors are shown above submit button
  const PublishListingError = props => {
    return props.error ? (
      <p className={css.error}>
        <FormattedMessage id="EditListingPhotosForm.publishListingFailed" />
      </p>
    ) : null;
  };
  
  const ShowListingsError = props => {
    return props.error ? (
      <p className={css.error}>
        <FormattedMessage id="EditListingPhotosForm.showListingFailed" />
      </p>
    ) : null;
  };

export const FieldAddImage = props => {
    const { formApi, onImageUploadHandler, aspectWidth = 1, aspectHeight = 1, ...rest } = props;
    return (
      <Field form={null} {...rest}>
        {fieldprops => {
          const { accept, input, label, disabled: fieldDisabled } = fieldprops;
          
          const { name, type } = input;
          const onChange = e => {
            const file = e.target.files[0];
            formApi.change(`addImage`, file);
            formApi.blur(`addImage`);
            onImageUploadHandler(file);
          };
          const inputProps = { accept, id: name, name, onChange, type };
          return (
            <div className={css.addImageWrapper}>
              <AspectRatioWrapper width={aspectWidth} height={aspectHeight}>
                {fieldDisabled ? null : <input {...inputProps} className={css.addImageInput} />}
                <label htmlFor={name} className={css.addImage}>
                  {label}
                </label>
              </AspectRatioWrapper>
            </div>
          );
        }}
      </Field>
    );
  };
  
  // Component that shows listing images from "images" field array
  const FieldListingImage = props => {
    
    const { name, intl, onRemoveImage, aspectWidth, aspectHeight, variantPrefix , category} = props;
    return (
      <Field name={name}>
        {fieldProps => {
          const { input } = fieldProps;
          const image = input.value;
          
          return image ? (
            <ListingImage
              image={image}
              key={image?.id?.uuid || image?.id}
              className={css.thumbnail}
              savedImageAltText={intl.formatMessage({
                id: 'EditListingPhotosForm.savedImageAltText',
              })}
              onRemoveImage={() => onRemoveImage(image?.id)}
              aspectWidth={aspectWidth}
              aspectHeight={aspectHeight}
              variantPrefix={variantPrefix}
            />
          ) : null;
        }}
      </Field>
    );
  };

const EditListingServiceFormComponent = props => {
    const { category = [] } = props;
    const [state, setState] = useState({ imageUploadRequested: false });
    const [submittedImages, setSubmittedImages] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState(offers.filter(itm => category.includes(itm.key)));

    const onImageUploadHandler = file => {
        const { listingImageConfig, onImageUpload } = props;
        if (file) {
            setState({ imageUploadRequested: true });

            onImageUpload({ id: `${file.name}_${Date.now()}`, file }, listingImageConfig)
                .then(() => {
                    setState({ imageUploadRequested: false });
                })
                .catch(() => {
                    setState({ imageUploadRequested: false });
                });
        }
    };
    return (
        <FinalForm
            {...props}
            mutators={{ ...arrayMutators }}
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
                    updated,
                    updateInProgress,
                    fetchErrors,
                    setResetForm,
                    onRemoveImage,
                    unitType,
                    onCreateDraftServiceListing,
                    config,
                    listingImageConfig,
                    touched,
                    images,
                } = formRenderProps;
                
                // const images = values.images;
                const { aspectWidth = 1, aspectHeight = 1, variantPrefix } = listingImageConfig;

                // const { publishListingError, showListingsError, updateListingError, uploadImageError } =
                //     fetchErrors || {};
                // const uploadOverLimit = isUploadImageOverLimitError(uploadImageError);

                // imgs can contain added images (with temp ids) and submitted images with uniq ids.
                
                const arrayOfImgIds = imgs => imgs?.map(i => (typeof i.id === 'string' ? i.imageId : i.id));
                const imageIdsFromProps = arrayOfImgIds(images);
                const imageIdsFromPreviousSubmit = arrayOfImgIds(submittedImages);
                
                const imageArrayHasSameImages = isEqual(imageIdsFromProps, imageIdsFromPreviousSubmit);
                const submittedOnce = submittedImages.length > 0;
                const pristineSinceLastSubmit = submittedOnce && imageArrayHasSameImages;

                const submitReady = (updated && pristineSinceLastSubmit) || ready;
                const submitInProgress = updateInProgress;
                // const submitDisabled =
                //     invalid || disabled || submitInProgress || state.imageUploadRequested || ready;
                // const imagesError = touched.images && errors?.images && errors.images[ARRAY_ERROR];

                

                const businessNRequiredMessage = intl.formatMessage({
                    id: 'EditListingDescriptionForm.titleRequired',
                });
                const titlePlaceholder = intl.formatMessage({
                    id: 'ServiceListingPageForm.titlePlaceholder',
                });
                const tagsPlaceholder = intl.formatMessage({
                    id: 'ServiceListingPageForm.tagsPlaceholder',
                });
                const shortDescriptionPlaceholder = intl.formatMessage({
                    id: 'ServiceListingPageForm.shortDescriptionPlaceholder',
                });
                const technicalNotePlaceholder = intl.formatMessage({
                    id: 'ServiceListingPageForm.technicalNotePlaceholder',
                });
                const maxLengthMessage = intl.formatMessage(
                    { id: 'EditListingDescriptionForm.maxLength' },
                    {
                        maxLength: TITLE_MAX_LENGTH,
                    }
                );

                const maxLength60Message = maxLength(maxLengthMessage, TITLE_MAX_LENGTH);
                const emailRequiredMessage = intl.formatMessage({
                    id: 'SignupForm.emailRequired',
                });
          

                // const { createListingDraftError,} = fetchErrors || {};
                // const errorMessageUpdateListing = updateListingError ? (
                //     <p className={css.error}>
                //         <FormattedMessage id="EditListingDescriptionForm.updateFailed" />
                //     </p>
                // ) : null;

                const imageRequiredMessage = intl.formatMessage({
                    id: 'EditListingPhotosForm.imageRequired',
                });

                // This error happens only on first tab (of EditListingWizard)
                // const errorMessageCreateListingDraft = createListingDraftError ? (
                //     <p className={css.error}>
                //         <FormattedMessage id="EditListingDescriptionForm.createListingDraftError" />
                //     </p>
                // ) : null;

                // const errorMessageShowListing = showListingsError ? (
                //     <p className={css.error}>
                //         <FormattedMessage id="EditListingDescriptionForm.showListingFailed" />
                //     </p>
                // ) : null;

               
                const noOfBookingLabel = intl.formatMessage({
                    id: 'ServiceListingPage.noOfBookingLabel',
                });
                const hrsLabel = intl.formatMessage({
                    id: 'ServiceListingPage.hrsLabel',
                });
                const minsLabel = intl.formatMessage({
                    id: 'ServiceListingPage.minsLabel',
                });
                const cancelationPolicyLabel = intl.formatMessage({
                    id: 'ServiceListingPage.cancelationPolicyLabel',
                });
                const monthsLabel = intl.formatMessage({
                    id: 'ServiceListingPage.monthsLabel',
                });
                const daysLabel = intl.formatMessage({
                    id: "ServiceListingPage.daysLabel",
                });
               

                const classes = classNames(css.root, className);

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

                return (
                    <Form className={classes} 
                    onSubmit={handleSubmit}
                    // onSubmit={e => {
                        
                    //     // setSubmittedImages(images);
                    //     handleSubmit(e);
                    // }}
                    >
                        {/* {errorMessageCreateListingDraft}
                        {errorMessageUpdateListing}
                        {errorMessageShowListing} */}
                        <div className={css.mainWrapper}>
                            <div className={css.content}>
                                <h3 className={css.formHeading}>
                                    <FormattedMessage id='ProductListingPage.serviceDetails' />
                                </h3>
                                <div className={css.productFormWrapper}>
                                    <div className={css.formLeftInput}>
                                        <FieldTextInput
                                            id="title"
                                            name="title"
                                            className={css.inputBox}
                                            type="text"
                                            label="title"
                                            placeholder={titlePlaceholder}
                                            // maxLength={TITLE_MAX_LENGTH}
                                            validate={composeValidators(required(businessNRequiredMessage), maxLength60Message)}
                                            required
                                        />
                                        <FieldCurrencyInput
                                            id={`price`}
                                            name="price"
                                            className={css.inputBox}
                                            // autoFocus={autoFocus}
                                            label={intl.formatMessage(
                                                { id: 'EditListingPricingForm.pricePerProduct' },
                                                { unitType }
                                            )}
                                            placeholder={intl.formatMessage({ id: 'EditListingPricingForm.priceInputPlaceholder' })}
                                            currencyConfig={appSettings.getCurrencyFormatting('AUD')}
                                        // validate={priceValidators}
                                        />
                                        <FieldSelect
                                            id="category"
                                            name="category"
                                            className={css.inputBox}
                                            label="category"
                                        >
                                            <option value="Select">Select</option>
                                            {categoryOptions.map((item) => <option value={item.key}>{item.value}</option>)}
                                        </FieldSelect>
                                        <div className={css.tagsInput}>
                                            <FieldTextInput
                                                id="tags"
                                                name="tags"
                                                className={css.inputBox}
                                                type="text"
                                                label="Tags"
                                                placeholder={tagsPlaceholder}
                                                //validate={composeValidators(required(titleRequiredMessage), maxLength60Message)}
                                                onKeyUp={event => {
                                                    event.preventDefault();
                                                    if (event.keyCode === 13 && event.target.value) {
                                                        event.preventDefault();
                                                        const tag = values.tag || [];

                                                        tag.push(event.target.value);
                                                        form.change('tag', tag);
                                                        form.change('tags', '');
                                                    }
                                                }}
                                                onMouseOut={event => {
                                                    event.preventDefault();
                                                    event.preventDefault();
                                                    const tag = values.tag || [];
                                                    if (event.target.value && event.target.value.length > 0) {
                                                        tag.push(event.target.value);
                                                        form.change('tag', tag);
                                                        form.change('tags', '');
                                                    }
                                                }}
                                            />
                                            <div className={css.formRow}>
                                                <div className={css.formFld}>
                                                    <div className={css.tagRow}>
                                                        {values.tag && values.tag.length
                                                            ? values.tag.map((hk, i) => (
                                                                <div className={css.tagWrap} key={hk + i}>
                                                                    <span className={css.tagBox}>{hk}</span>
                                                                    <span
                                                                        className={css.tagClose}
                                                                        onClick={() => {
                                                                            form.change('tag', values.tag.filter(h => h != hk));
                                                                        }}
                                                                    >
                                                                        <svg
                                                                            width="10"
                                                                            height="11"
                                                                            viewBox="0 0 10 11"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <path
                                                                                d="M9.05541 10.0554C8.83037 10.2804 8.52516 10.4069 8.20691 10.4069C7.88866 10.4069 7.58345 10.2804 7.35841 10.0554L4.70741 7.02541L2.05641 10.0544C1.94531 10.1673 1.81296 10.2571 1.66698 10.3187C1.52101 10.3802 1.36429 10.4122 1.20589 10.4128C1.04748 10.4135 0.890512 10.3827 0.744038 10.3224C0.597565 10.2621 0.464484 10.1734 0.352472 10.0613C0.24046 9.94934 0.151734 9.81626 0.091412 9.66978C0.0310898 9.52331 0.000364857 9.36634 0.00100988 9.20793C0.0016549 9.04953 0.0336569 8.89281 0.09517 8.74684C0.156683 8.60086 0.24649 8.46851 0.35941 8.35741L3.11741 5.20741L0.35841 2.05541C0.24549 1.94431 0.155683 1.81196 0.09417 1.66598C0.0326569 1.52001 0.000654968 1.36329 9.94895e-06 1.20489C-0.00063507 1.04648 0.0300898 0.889512 0.0904121 0.743038C0.150734 0.596565 0.23946 0.463484 0.351472 0.351472C0.463484 0.23946 0.596565 0.150734 0.743038 0.0904121C0.889512 0.0300898 1.04648 -0.00063507 1.20489 9.94895e-06C1.36329 0.000654968 1.52001 0.0326569 1.66598 0.09417C1.81196 0.155683 1.94431 0.24549 2.05541 0.35841L4.70741 3.38941L7.35841 0.35841C7.46951 0.24549 7.60186 0.155683 7.74784 0.09417C7.89382 0.0326569 8.05053 0.000654968 8.20893 9.94895e-06C8.36734 -0.00063507 8.52431 0.0300898 8.67078 0.0904121C8.81726 0.150734 8.95034 0.23946 9.06235 0.351472C9.17436 0.463484 9.26309 0.596565 9.32341 0.743038C9.38373 0.889512 9.41445 1.04648 9.41381 1.20489C9.41317 1.36329 9.38116 1.52001 9.31965 1.66598C9.25814 1.81196 9.16833 1.94431 9.05541 2.05541L6.29741 5.20741L9.05541 8.35741C9.16698 8.46886 9.25549 8.6012 9.31588 8.74688C9.37627 8.89256 9.40735 9.04871 9.40735 9.20641C9.40735 9.36411 9.37627 9.52026 9.31588 9.66594C9.25549 9.81162 9.16698 9.94396 9.05541 10.0554Z"
                                                                                fill="#353535"
                                                                            />
                                                                        </svg>
                                                                    </span>
                                                                </div>
                                                            ))
                                                            : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={css.formRightInput}>
                                        <div className={css.formLeftInput}>
                                            <FieldTextInput
                                                id="shortDescription"
                                                name="shortDescription"
                                                className={css.inputBox}
                                                type="textarea"
                                                label="short description"
                                                placeholder={shortDescriptionPlaceholder}
                                            />
                                            <FieldTextInput
                                                id="technicalNotes"
                                                name="technicalNotes"
                                                className={css.inputBox}
                                                type="textarea"
                                                label="Technical notes"
                                                placeholder={technicalNotePlaceholder}
                                            />

                                        </div>
                                        <div className={css.gallaryContainer}>
                                        <label htmlFor="images" className={css.photoLabel}>Photos</label>
                                        <div className={css.imagesGallaryGrid}>
                                            <AddImages
                                                className={classNames(
                                                    css.imagesField,
                                                    images.length == 1 && css.imagesField1,
                                                    images.length == 2 && css.imagesField2,
                                                    images.length == 3 && css.imagesField3,
                                                    images.length > 3 && css.imagesFieldBig
                                                  )}
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
                                                    disabled={state.imageUploadRequested}
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

                                        </div>
                                    </div>
                                        {/* {imagesError ? <div className={css.arrayError}>{imagesError}</div> : null}

                                        <ImageUploadError
                                            uploadOverLimit={uploadOverLimit}
                                            uploadImageError={uploadImageError}
                                        />

                                        <p className={css.tip}>
                                            <FormattedMessage id="EditListingPhotosForm.addImagesTip" />
                                        </p>

                                        <PublishListingError error={publishListingError} />
                                        <ShowListingsError error={showListingsError} /> */}
                                    </div>
                                </div>
                                <p><FormattedMessage id="ServiceListingPage.bottomText" /></p>
                            </div>
                            <div className={css.content}>
                                <h3 className={css.formHeading}>
                                    <FormattedMessage id='ServiceListingPage.bookingDetails' />
                                </h3>
                                <div className={css.stockContent}>
                                    <div className={css.stockLeft}>
                                        <div className={css.rowInput}>
                                            <div className={css.mainRowBox}>
                                                <p><FormattedMessage id="ServiceListingPage.bookingLength" /></p>
                                                <div className={css.radioRow}>
                                                    <FieldTextInput
                                                        id="hours"
                                                        name="hours"
                                                        type="number"
                                                        label={hrsLabel}
                                                        className={css.inputBox}
                                                    />
                                                    <FieldTextInput
                                                        id="mins"
                                                        name="mins"
                                                        type="number"
                                                        label={minsLabel}
                                                        className={css.inputBox}
                                                    />
                                                </div>
                                                <FieldSelect
                                                    id="cancelationPolicy"
                                                    name="cancelationPolicy"
                                                    className={css.inputBox}
                                                    label={cancelationPolicyLabel}
                                                >
                                                    <option value=''> When canncellation fees apply?</option>
                                                </FieldSelect>

                                                <FieldTextInput
                                                    id="noOfBooking"
                                                    name="noOfBooking"
                                                    type="number"
                                                    label={noOfBookingLabel}
                                                    className={css.inputBox}
                                                />
                                            </div>
                                            <div className={css.mainRowBox}>
                                                <p><FormattedMessage id="ServiceListingPage.bookable" /></p>
                                                <div className={css.radioRow}>
                                                    <FieldTextInput
                                                        id="months"
                                                        name="months"
                                                        type="number"
                                                        label={monthsLabel}
                                                        className={css.inputBox}
                                                    />
                                                    <FieldTextInput
                                                        id="days"
                                                        name="days"
                                                        type="number"
                                                        label={daysLabel}
                                                        className={css.inputBox}
                                                    />
                                                </div>
                                                <p><FormattedMessage id="ServiceListingPage.bookableAdvance" /></p>
                                                <div className={css.radioRow}>
                                                    <FieldTextInput
                                                        id="advanceMonths"
                                                        name="advanceMonths"
                                                        type="number"
                                                        label={monthsLabel}
                                                        className={css.inputBox}
                                                    />
                                                    <FieldTextInput
                                                        id="advanceDays"
                                                        name="advanceDays"
                                                        type="number"
                                                        label={daysLabel}
                                                        className={css.inputBox}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Button type="button" onClick={() => {
                                const {
                                    title,
                                    price,
                                    category,
                                    shortDescription,
                                    technicalNotes,
                                    hours,
                                    mins,
                                    cancelationPolicy,
                                    noOfBooking,
                                    months,
                                    days,
                                    advanceMonths,
                                    advanceDays,
                                    tag
                                } = values;

                                const updatedValues = {
                                    title: title,
                                    price,
                                    description: '',
                                    publicData: {
                                        category,
                                        shortDescription,
                                        technicalNotes,
                                        hours,
                                        mins,
                                        cancelationPolicy,
                                        noOfBooking,
                                        months,
                                        days,
                                        advanceMonths,
                                        advanceDays,
                                        listingType: 'service',
                                        tag
                                    },
                                }
                                onCreateDraftServiceListing(updatedValues, config);
                            }}><FormattedMessage id="ServiceListingPage.saveDraftButton" /></Button>
                            <Button type="submit"><FormattedMessage id="ServiceListingPage.addButton" /></Button>
                        </div>
                    </Form>
                );
            }}
        />
    )
};

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