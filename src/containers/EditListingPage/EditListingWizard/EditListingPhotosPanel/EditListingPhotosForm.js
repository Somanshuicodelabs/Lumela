import React, { useState } from 'react';
import { bool, func, object, shape, string } from 'prop-types';
import { compose } from 'redux';
import { ARRAY_ERROR } from 'final-form';
import { Form as FinalForm, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';

// Import configs and util modules
import { FormattedMessage, intlShape, injectIntl } from '../../../../util/reactIntl';
import { propTypes } from '../../../../util/types';
import { nonEmptyArray, composeValidators } from '../../../../util/validators';
import { isUploadImageOverLimitError } from '../../../../util/errors';

// Import shared components
import { Button, Form, AspectRatioWrapper, NamedLink, FieldTextInput, AddImages, ValidationError, IconEdit, ImageFromFile } from '../../../../components';

// Import modules from this directory
import ListingImage from './ListingImage';
import css from './EditListingPhotosForm.module.css';
import IconCamera from '../../../../components/IconCamera/IconCamera';
import IconCollection from '../../../../components/IconCollection/IconCollection';

const ACCEPT_IMAGES = 'image/*';

const ImageUploadError = props => {
  return props.uploadOverLimit ? (
    <p className={css.error}>
      <FormattedMessage id="EditListingPhotosForm.imageUploadFailed.uploadOverLimit" />
    </p>
  ) : props.uploadImageError ? (
    <p className={css.error}>
      <FormattedMessage id="EditListingPhotosForm.imageUploadFailed.uploadFailed" />
    </p>
  ) : null;
};

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

// Field component that uses file-input to allow user to select images.
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
  const { name, intl, onRemoveImage, aspectWidth, aspectHeight, variantPrefix } = props;
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

export const EditListingPhotosFormComponent = props => {
  const [state, setState] = useState({ imageUploadRequested: false });
  const [submittedImages, setSubmittedImages] = useState([]);

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
          form,
          className,
          fetchErrors,
          handleSubmit,
          onPrevious,
          images,
          intl,
          invalid,
          onRemoveImage,
          imageUploadRequested,
          disabled,
          ready,
          saveActionMsg,
          updated,
          updateInProgress,
          mainImageUploadRequested,
          touched,
          errors,
          mainImage,
          values,
          publicData,
          listingImageConfig,
        } = formRenderProps;


        const uploadingOverlay = mainImageUploadRequested ? (
          <div className={css.uploadingImageOverlay}>
            <IconSpinner />
          </div>
        ) : null;

        const { businessName, email } = publicData || {};


        const { aspectWidth = 1, aspectHeight = 1, variantPrefix } = listingImageConfig;

        const { publishListingError, showListingsError, updateListingError, uploadImageError } =
          fetchErrors || {};
        const uploadOverLimit = isUploadImageOverLimitError(uploadImageError);

        // imgs can contain added images (with temp ids) and submitted images with uniq ids.
        const arrayOfImgIds = imgs => imgs.map(i => (typeof i.id === 'string' ? i.imageId : i.id));
        const imageIdsFromProps = arrayOfImgIds(images);
        const imageIdsFromPreviousSubmit = arrayOfImgIds(submittedImages);
        const imageArrayHasSameImages = isEqual(imageIdsFromProps, imageIdsFromPreviousSubmit);
        const submittedOnce = submittedImages.length > 0;
        const pristineSinceLastSubmit = submittedOnce && imageArrayHasSameImages;
        const imageRequiredMessage = intl.formatMessage({
          id: 'EditListingPhotosForm.imageRequired',
        });



        const submitReady = (updated && pristineSinceLastSubmit) || ready;
        const submitInProgress = updateInProgress;
        const submitDisabled =
          invalid || disabled || submitInProgress || imageUploadRequested || state.imageUploadRequested || ready;
        const imagesError = touched.images && errors?.images && errors.images[ARRAY_ERROR];

        const classes = classNames(css.root, className);
        const fileExists = !!(mainImage && mainImage.file);
        const fileUploadInProgress = mainImageUploadRequested && fileExists;
        const delayAfterUpload = mainImage && mainImage.imageId;

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
        let uploadImageFailed = null;
        const chooseAvatarLabel =
          mainImage &&
            ((mainImage.id && mainImage.id.uuid) || mainImage.imageId || fileUploadInProgress) ? (
            <div className={css.avatarContainer}>
              {mainImage.imageId ? imageFromFile : avatarComponent}
              <div className={css.changeAvatar}>
                {/* <FormattedMessage id="ProfileSettingsForm.changeAvatar" /> */}
                <IconEdit />
              </div>
            </div>
          ) : (
            <div className={css.avatarPlaceholder}>
              <IconCamera />
              <div className={css.avatarPlaceholderText}>
                <FormattedMessage id="EditListingPhotosForm.addYourMainPicture" />
              </div>
              {/* <div className={css.avatarPlaceholderTextMobile}>
                  <FormattedMessage id="EditListingPhotosForm.addYourMainPictureMobile" />
                </div> */}
            </div>
          );

        if (uploadOverLimit) {
          uploadImageFailed = (
            <p className={css.error}>
              <FormattedMessage id="EditListingPhotosForm.imageUploadFailed.uploadOverLimit" />
            </p>
          );
        } else if (uploadImageError) {
          uploadImageFailed = (
            <p className={css.error}>
              <FormattedMessage id="EditListingPhotosForm.imageUploadFailed.uploadFailed" />
            </p>
          );
        }

        const hasUploadError = !!uploadImageError && !mainImageUploadRequested;

        const errorClasses = classNames({ [css.avatarUploadError]: hasUploadError });

        const imageFromFile = !fileUploadInProgress ? (
          <ImageFromFile
            id={mainImage.id}
            className={errorClasses}
            rootClassName={css.uploadingImage}
            aspectRatioClassName={css.squareAspectRatio}
            file={mainImage.file}
          >
            {uploadingOverlay}
          </ImageFromFile>
        ) : null;
        return (
          <Form
            className={classes}
            onSubmit={e => {
              setSubmittedImages(images);
              handleSubmit(e);
            }}
          >
            {updateListingError ? (
              <p className={css.error}>
                <FormattedMessage id="EditListingPhotosForm.updateFailed" />
              </p>
            ) : null}

            <div className={css.sectionContainer}>
              <FieldArray
                name="images"
                validate={composeValidators(
                  nonEmptyArray(
                    intl.formatMessage({
                      id: 'EditListingPhotosForm.imageRequired',
                    })
                  )
                )}
              >
                {({ fields }) =>
                  fields.map((name, index) => (
                    <FieldListingImage
                      key={name}
                      name={name}
                      onRemoveImage={imageId => {
                        fields.remove(index);
                        onRemoveImage(imageId);
                      }}
                      intl={intl}
                      aspectWidth={aspectWidth}
                      aspectHeight={aspectHeight}
                      variantPrefix={variantPrefix}
                    />
                  ))
                }
              </FieldArray>
              <Field
                accept={ACCEPT_IMAGES}
                id="mainImage"
                name="mainImage"
                label={chooseAvatarLabel}
                type="file"
                form={null}
                uploadImageError={uploadImageError}
                disabled={fileUploadInProgress}
              >
                {fieldProps => {
                  const { accept, id, input, label, disabled, uploadImageError } = fieldProps;
                  const { name, type } = input;
                  const onChange = e => {
                    const file = e.target.files[0];
                    console.log('file :>> ', file);
                    form.change(`mainImage`, file);
                    form.blur(`mainImage`);
                    if (file != null) {
                      const tempId = `${file.name}_${Date.now()}`;
                      onImageUploadHandler(file, 'main');
                    }
                  };

                  let error = null;

                  if (isUploadImageOverLimitError(uploadImageError)) {
                    error = (
                      <div className={css.error}>
                        <FormattedMessage id="ProfileSettingsForm.imageUploadFailedFileTooLarge" />
                      </div>
                    );
                  } else if (uploadImageError) {
                    error = (
                      <div className={css.error}>
                        <FormattedMessage id="ProfileSettingsForm.imageUploadFailed" />
                      </div>
                    );
                  }

                  return (
                    <div className={css.uploadAvatarWrapper}>
                      <label className={classNames(css.label, css.mainPhotoLabel)} htmlFor={id}>
                        {label}
                      </label>
                      <input
                        accept={accept}
                        id={id}
                        name={name}
                        className={css.uploadAvatarInput}
                        disabled={disabled}
                        onChange={onChange}
                        type={type}
                      />
                      {error}
                    </div>
                  );
                }}
              </Field>
            </div>

            {/* <FieldAddImage
                id="mainImage"
                name="mainImage"
                accept={ACCEPT_IMAGES}
                label={
                  <span className={css.chooseImageText}>
                    <span className={css.chooseImage}>
                      <FormattedMessage id="EditListingPhotosForm.chooseImage" />
                    </span>
                    <span className={css.imageTypes}>
                      <FormattedMessage id="EditListingPhotosForm.imageTypes" />
                    </span>
                  </span>
                }
                type="file"
                disabled={state.imageUploadRequested}
                formApi={form}
                onImageUploadHandler={onImageUploadHandler}
                aspectWidth={aspectWidth}
                aspectHeight={aspectHeight}
              />

              
            </div>

            {imagesError ? <div className={css.arrayError}>{imagesError}</div> : null} */}

            {/* <ImageUploadError
              uploadOverLimit={uploadOverLimit}
              uploadImageError={uploadImageError}
            />

            <p className={css.tip}>
              <FormattedMessage id="EditListingPhotosForm.addImagesTip" />
            </p> */}

            {/* <PublishListingError error={publishListingError} />
            <ShowListingsError error={showListingsError} /> */}

            {/* <Button
              className={css.submitButton}
              type="submit"
              inProgress={submitInProgress}
              disabled={submitDisabled}
              ready={submitReady}
            >
              {saveActionMsg}
            </Button> */}
            {uploadImageFailed}
            <div className={css.hairByContents}>
              <h3>
                <FormattedMessage id="EditListingPhotosForm.text" /> {businessName}
              </h3>
              <p className={css.hairByEmail}>{email}</p>
            </div>

            <div className={css.hairByContents}>
              <h3>
                <FormattedMessage id="EditListingPhotosForm.text" /> {businessName}
              </h3>
              <p className={css.hairByEmail}>{email}</p>
            </div>

            <div className={css.locationDescription}>
              {/* <LocationAutocompleteInputField
                  rootClassName={css.locationAddress}
                  inputClassName={css.locationAutocompleteInput}
                  iconClassName={css.locationAutocompleteInputIcon}
                  predictionsClassName={css.predictionsRoot}
                  validClassName={css.validLocation}
                  name="location"
                  label={'Location'}
                  placeholder={''}
                  useDefaultPredictions={false}
                  format={identity}
                  valueFromForm={values.location}
                  validate={composeValidators(
                    autocompleteSearchRequired(addressRequiredMessage),
                    autocompletePlaceSelected(addressNotRecognizedMessage)
                  )}
                  isEditlistingLocationFld={true}
                /> */}

              {/* <div className={css.canDo}>
                  <label htmlFor="canDo">Can Do</label>
                  <div className={css.offeredServices}>
                    {canDo.map((e, i) => (
                      <div className={css.serviceBlock} key={e.key + i}>
                        {values.canDo && values.canDo.map((f, i) => e.key == f)}

                        <FieldCheckbox
                          isEditListingCando={true}
                          label={e.value}
                          id={e.key}
                          name={'canDo'}
                          value={e.key}
                        />
                      </div>
                    ))}
                  </div>
                </div> */}

              <FieldTextInput
                className={css.building}
                type="textarea"
                name="description"
                id="description"
                label={'Description'}
                placeholder={''}
              />
              <div className={css.gallaryContainer}>
                <label htmlFor="images">Gallery Photos</label>
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
                      validate={composeValidators(nonEmptyArray(imageRequiredMessage))}
                    />
                  </AddImages>
                  {images.length == 0 ? (
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
                  ) : images.length == 1 ? (
                    <>
                      <div className={css.imageBox}>
                        <IconCollection name="ADD_IMAGE_ICON" />
                      </div>
                      <div className={css.imageBox}>
                        <IconCollection name="ADD_IMAGE_ICON" />
                      </div>
                    </>
                  ) : images.length == 2 ? (
                    <div className={css.imageBox}>
                      <IconCollection name="ADD_IMAGE_ICON" />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className={css.fixedBottomFooter}>
              <div className={css.fixedWidthContainer}>
                <NamedLink name="BusinessLandingPage">
                  <Button className={css.cancelButton} type="button" onClick={() => form.reset()}>
                    Cancel
                  </Button>
                </NamedLink>
                <span className={css.stepNumber}>Step 2 of 7</span>
                <div className={css.rightButtons}>
                  <Button className={css.borderButton} type="button" onClick={onPrevious}>
                    Previous
                  </Button>
                  <Button
                    className={classNames(css.submitButton, 'disableButton')}
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
};

EditListingPhotosFormComponent.defaultProps = { fetchErrors: null };

EditListingPhotosFormComponent.propTypes = {
  fetchErrors: shape({
    publishListingError: propTypes.error,
    showListingsError: propTypes.error,
    uploadImageError: propTypes.error,
    updateListingError: propTypes.error,
  }),
  intl: intlShape.isRequired,
  onImageUpload: func.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  onRemoveImage: func.isRequired,
  listingImageConfig: object.isRequired,
};

export default compose(injectIntl)(EditListingPhotosFormComponent);