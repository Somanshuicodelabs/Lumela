import React, { useState } from 'react';
import { bool, func, object, shape, string } from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { useConfiguration } from '../../context/configurationContext';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { ensureCurrentUser } from '../../util/data';
import { isScrollingDisabled } from '../../ducks/ui.duck';
import profileImg from '../../assets/profile.png';

import { H3, Page, UserNav, Footer, NamedLink, LayoutSingleColumn, Modal, LayoutSideNavigation , LayoutWrapperTopbar,LayoutWrapperAccountSettingsSideNav,LayoutWrapperMain, PrimaryButton ,LayoutWrapperFooter} from '../../components';

import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';

import ProfileSettingsForm from './ProfileSettingsForm/ProfileSettingsForm';

import { updateProfile, uploadImage } from './ProfileSettingsPage.duck';
import css from './ProfileSettingsPage.module.css';

const onImageUploadHandler = (values, fn) => {
  const { id, imageId, file } = values;
  if (file) {
    fn({ id, imageId, file });
  }
};

export const ProfileSettingsPageComponent = props => {
  const config = useConfiguration();
  const {
    currentUser,
    image,
    onImageUpload,
    onUpdateProfile,
    scrollingDisabled,
    updateInProgress,
    updateProfileError,
    uploadImageError,
    uploadInProgress,
    intl,
    passwordChanged,
    changePasswordError,
    resetPasswordInProgress,
    resetPasswordError,
    onSubmitChangePassword,
    onChange,
    // onManageDisableScrolling,
    onResetPassword,
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = values => {
    const { firstName, lastName, bio: rawBio, phoneNumber, fullName, emailAddress } = values;

    // Ensure that the optional bio is a string
    const bio = rawBio || '';

    const profile = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fullName: firstName.trim(),
      bio,
      emailAddress,
      protectedData: {
        phoneNumber: phoneNumber,
      },
    };
    const uploadedImage = props.image;

    // Update profileImage only if file system has been accessed
    const updatedValues =
      uploadedImage && uploadedImage.imageId && uploadedImage.file
        ? { ...profile, profileImageId: uploadedImage.imageId }
        : profile;

    onUpdateProfile(updatedValues);
  };

  const user = ensureCurrentUser(currentUser);
  const { firstName,
    lastName,
    bio,
    protectedData,
    fullName,
    emailAddress, } = user.attributes.profile;
  const profileImageId = user.profileImage ? user.profileImage.id : null;
  const profileImage = image || { imageId: profileImageId };

  const profileSettingsForm = user.id ? (

    <Modal
      id="ProfileEditModal"
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      isProfileSettingsModal={true}
      isChangePassword={isModalOpen == 'changepassword' ? true : null}
      usePortal
      TitleName={
        isModalOpen == 'changepassword' ? (
          <FormattedMessage id="ProfilePage.changePassword" />
        ) : (
          false
        )
      }
      // contentClassName={css.modalContent}
      // onManageDisableScrolling={onManageDisableScrolling}
    >
      {isModalOpen == 'editform' ? (
        <ProfileSettingsForm
          className={css.form}
          currentUser={currentUser}
          initialValues={{ firstName, lastName, bio, profileImage: user.profileImage }}
          profileImage={profileImage}
          onImageUpload={e => onImageUploadHandler(e, onImageUpload)}
          uploadInProgress={uploadInProgress}
          updateInProgress={updateInProgress}
          uploadImageError={uploadImageError}
          updateProfileError={updateProfileError}
          onSubmit={handleSubmit}
          marketplaceName={config.marketplaceName}
        />)
        : isModalOpen == "changepassword" ? (
          <PasswordChangeForm
            className={css.passwordChange}
            changePasswordError={changePasswordError}
            currentUser={currentUser}
            onSubmit={onSubmitChangePassword}
            onChange={onChange}
            onResetPassword={onResetPassword}
            resetPasswordInProgress={resetPasswordInProgress}
            resetPasswordError={resetPasswordError}
            inProgress={changePasswordInProgress}
            ready={passwordChanged}
          />)
          : isModalOpen == "addressupdate" ? (
            <AddressUpdateForm
              className={css.passwordChange}
              changePasswordError={changePasswordError}
              currentUser={currentUser}
              onSubmit={onSubmitChangePassword}
              onChange={onChange}
              onResetPassword={onResetPassword}
              resetPasswordInProgress={resetPasswordInProgress}
              resetPasswordError={resetPasswordError}
              inProgress={changePasswordInProgress}
              ready={passwordChanged}
            />
          ) : null
      }
    </Modal>

  ) : null;

  const title = intl.formatMessage({ id: 'ProfileSettingsPage.title' });

  return (
    <Page className={css.root} title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSideNavigation>
        <LayoutWrapperTopbar
          className={classNames(scroll ? css.stickyNavbar : null, css.topbarHeader)}
        >
          <TopbarContainer
            currentPage="ProfileSettingsPage"
          // desktopClassName={css.desktopTopbar}
          // mobileClassName={css.mobileTopbar}
          />
          {/* <UserNav selectedPageName="ProfileSettingsPage" listing={currentUserListing} /> */}
        </LayoutWrapperTopbar>
        <LayoutWrapperAccountSettingsSideNav currentTab="ProfileSettingsPage" />
        <LayoutWrapperMain className={css.layoutWrappermain}>
          <div className={css.content}>
            {/* <FormattedMessage id="ProfileSettingsPage.heading" /> */}
            <div className={css.profileSettingWrap}>
              <div className={css.profileMainForm}>
                <div className={css.profileImage}>
                  <img src={profileImg} />
                </div>
                <div className={css.profileFormDetails}>
                  <h3>John Deo</h3>
                  <div className={css.detailWrapBox}>
                    <div className={css.profileHeadingDetails}>
                      Email : <span>example@mail.com</span>
                    </div>
                    <div className={css.profileVeryfyActionDetails}>Verify</div>
                  </div>
                  <div className={css.detailWrapBox}>
                    <div className={css.profileHeadingDetails}>
                      Mobile : <span> To be update</span>
                    </div>
                    <div className={css.profileUpdateActionDetails}>Update</div>
                  </div>
                  <div className={css.detailWrapBox}>
                    <div
                      className={css.passwordChangeLink}
                      onClick={() => this.setState({ isModalOpen: 'changepassword' })}
                    >
                      <span>
                        <svg
                          width="18"
                          height="20"
                          viewBox="0 0 18 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.8 8.8H15.1V3.2C15.1 1.4325 13.6675 0 11.9 0H5.7C3.9325 0 2.5 1.4325 2.5 3.2V8.8H0.8C0.3575 8.8 0 9.1575 0 9.6V19.2C0 19.6425 0.3575 20 0.8 20H16.8C17.2425 20 17.6 19.6425 17.6 19.2V9.6C17.6 9.1575 17.2425 8.8 16.8 8.8ZM9.5 14.725V16.05C9.5 16.16 9.41 16.25 9.3 16.25H8.3C8.19 16.25 8.1 16.16 8.1 16.05V14.725C7.89363 14.5768 7.7396 14.367 7.66007 14.1257C7.58055 13.8845 7.57963 13.6242 7.65745 13.3823C7.73528 13.1405 7.88783 12.9296 8.09314 12.78C8.29846 12.6304 8.54595 12.5498 8.8 12.5498C9.05405 12.5498 9.30154 12.6304 9.50686 12.78C9.71217 12.9296 9.86473 13.1405 9.94255 13.3823C10.0204 13.6242 10.0195 13.8845 9.93993 14.1257C9.8604 14.367 9.70637 14.5768 9.5 14.725ZM13.3 8.8H4.3V3.2C4.3 2.4275 4.9275 1.8 5.7 1.8H11.9C12.6725 1.8 13.3 2.4275 13.3 3.2V8.8Z"
                            fill="#308B97"
                          />
                        </svg>
                      </span>
                      <FormattedMessage id="ProfilePage.changePassword" />
                    </div>
                    <div className={css.editButtonLink}>
                      <PrimaryButton
                        type="submit"
                        onClick={() => this.setState({ isModalOpen: 'editform' })}
                      >
                        <FormattedMessage id="ListingPage.editButtonProfileLink" />
                      </PrimaryButton>
                    </div>
                  </div>
                </div>
              </div>
              <div className={css.addressUpdateWrap}>
                <div className={css.addressHeading}>
                  <span>
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M31.5852 16.5184L17.1869 0.506767C16.5805 -0.168922 15.4159 -0.168922 14.8095 0.506767L0.411128 16.5184C0.203881 16.7483 0.0678459 17.0335 0.0195627 17.3394C-0.0287206 17.6452 0.0128286 17.9586 0.139158 18.2412C0.39513 18.8192 0.967866 19.1907 1.5998 19.1907H4.79944V30.3988C4.79944 30.8235 4.96799 31.2308 5.26801 31.531C5.56804 31.8313 5.97496 32 6.39926 32H11.1987C11.623 32 12.0299 31.8313 12.33 31.531C12.63 31.2308 12.7985 30.8235 12.7985 30.3988V23.9942H19.1978V30.3988C19.1978 30.8235 19.3664 31.2308 19.6664 31.531C19.9664 31.8313 20.3734 32 20.7976 32H25.5971C26.0214 32 26.4283 31.8313 26.7284 31.531C27.0284 31.2308 27.1969 30.8235 27.1969 30.3988V19.1907H30.3966C30.7064 19.192 31.0099 19.1031 31.2701 18.9348C31.5303 18.7664 31.736 18.5259 31.862 18.2427C31.988 17.9594 32.0289 17.6455 31.9798 17.3393C31.9307 17.0332 31.7936 16.7479 31.5852 16.5184Z"
                        fill="#121212"
                      />
                    </svg>
                  </span>
                  <FormattedMessage id="ProfilePage.updateAddress" />
                </div>
                <div className={css.updatedAddress}>
                  <div className={css.blankAddress}>
                    <span className={css.noAddressFound}>No Address Found</span>
                    <span
                      className={css.updateAddressLink}
                      onClick={() => this.setState({ isModalOpen: 'addressupdate' })}
                    >
                      Update Address
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {profileSettingsForm}
        </LayoutWrapperMain>
        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSideNavigation>
    </Page>
  );
};

ProfileSettingsPageComponent.defaultProps = {
  currentUser: null,
  uploadImageError: null,
  updateProfileError: null,
  image: null,
  config: null,
  onManageDisableScrolling: null,
  changePasswordError: null,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

ProfileSettingsPageComponent.propTypes = {
  currentUser: propTypes.currentUser,
  currentUserListing: propTypes.ownListing,
  image: shape({
    id: string,
    imageId: propTypes.uuid,
    file: object,
    uploadedImage: propTypes.image,
  }),
  onImageUpload: func.isRequired,
  onUpdateProfile: func.isRequired,
  scrollingDisabled: bool.isRequired,
  updateInProgress: bool.isRequired,
  updateProfileError: propTypes.error,
  uploadImageError: propTypes.error,
  uploadInProgress: bool.isRequired,
  passwordChanged: bool.isRequired,
  onChange: func.isRequired,
  resetPasswordError: propTypes.error,
  changePasswordInProgress: bool.isRequired,
  uploadInProgress: bool.isRequired,
  onManageDisableScrolling: func,

  // from useConfiguration()
  config: object,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const { currentUser, currentUserListing } = state.user;
  const {
    image,
    uploadImageError,
    uploadInProgress,
    updateInProgress,
    updateProfileError,
    changePasswordError,
    changePasswordInProgress,
    passwordChanged,
    resetPasswordInProgress,
    resetPasswordError,
  } = state.ProfileSettingsPage;
  return {
    currentUser,
    image,
    scrollingDisabled: isScrollingDisabled(state),
    updateInProgress,
    updateProfileError,
    uploadImageError,
    uploadInProgress,
    changePasswordError,
    changePasswordInProgress,
    currentUser,
    passwordChanged,
    resetPasswordInProgress,
    resetPasswordError,
  };
};

const mapDispatchToProps = dispatch => ({
  onImageUpload: data => dispatch(uploadImage(data)),
  onUpdateProfile: data => dispatch(updateProfile(data)),
  onManageDisableScrolling: (componentId, disableScrolling) =>
    dispatch(manageDisableScrolling(componentId, disableScrolling)),
  onChange: () => dispatch(changePasswordClear()),
  onSubmitChangePassword: values => dispatch(changePassword(values)),
  onResetPassword: values => dispatch(resetPassword(values)),
});

const ProfileSettingsPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(ProfileSettingsPageComponent);

export default ProfileSettingsPage;
