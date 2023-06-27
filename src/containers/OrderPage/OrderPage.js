import React from 'react';
import { bool, func } from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { ensureCurrentUser } from '../../util/data';
import { sendVerificationEmail } from '../../ducks/user.duck';
import {
  LayoutSideNavigation,
  LayoutWrapperMain,
  LayoutWrapperAccountSettingsSideNav,
  LayoutWrapperTopbar,
  LayoutWrapperFooter,
  Footer,
  Page,
  UserNav,
  TabNav,
  Logo,
} from '../../components';
import ContactDetailsForm from '../ContactDetailsPage/ContactDetailsForm/ContactDetailsForm';
import { TopbarContainer } from '../../containers';

import { isScrollingDisabled } from '../../ducks/ui.duck';
import {
  saveContactDetails,
  saveContactDetailsClear,
  resetPassword,
} from '../ContactDetailsPage/ContactDetailsPage.duck';
import css from './OrderPage.module.css';
import classNames from 'classnames';
// import IconOrders from '../../components/IconOrders/IconOrders';
// import IconBell from '../../components/IconBell/IconBell';
// Horizontal Tabs
// import Tabs, { TabPane } from 'rc-tabs';
// import '../../../node_modules/rc-tabs/assets/index.css';
import './react-tab.css';
// import IconCall from '../../components/IconCall/IconCall';
// import IconAt from '../../components/IconAt/IconAt';
// import upcomingBooking from '../../assets/blogTreatMent.png';
// import IconTick from '../../components/IconTick/IconTick';

export const OrderPageComponent = props => {
  const {
    saveEmailError,
    savePhoneNumberError,
    saveContactDetailsInProgress,
    currentUser,
    currentUserListing,
    contactDetailsChanged,
    onChange,
    scrollingDisabled,
    sendVerificationEmailInProgress,
    sendVerificationEmailError,
    onResendVerificationEmail,
    onSubmitContactDetails,
    onResetPassword,
    resetPasswordInProgress,
    resetPasswordError,
    intl,
    params,
  } = props;

  const user = ensureCurrentUser(currentUser);
  const currentEmail = user.attributes.email || '';
  const protectedData = user.attributes.profile.protectedData || {};
  const currentPhoneNumber = protectedData.phoneNumber || '';
  const contactInfoForm = user.id ? (
    <ContactDetailsForm
      className={css.form}
      initialValues={{ email: currentEmail, phoneNumber: currentPhoneNumber }}
      saveEmailError={saveEmailError}
      savePhoneNumberError={savePhoneNumberError}
      currentUser={currentUser}
      onResendVerificationEmail={onResendVerificationEmail}
      onResetPassword={onResetPassword}
      onSubmit={values => onSubmitContactDetails({ ...values, currentEmail, currentPhoneNumber })}
      onChange={onChange}
      inProgress={saveContactDetailsInProgress}
      ready={contactDetailsChanged}
      sendVerificationEmailInProgress={sendVerificationEmailInProgress}
      sendVerificationEmailError={sendVerificationEmailError}
      resetPasswordInProgress={resetPasswordInProgress}
      resetPasswordError={resetPasswordError}
    />
  ) : null;

  function callback(e) {
    console.log(e);
  }
  const title = intl.formatMessage({ id: 'DashboardPage.title' });
  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSideNavigation
        topbar={
          <>
            <TopbarContainer
              currentPage="OrderPage"
              desktopClassName={css.desktopTopbar}
              mobileClassName={css.mobileTopbar}
            />
            {/* <UserNav currentPage="OrderPage" /> */}
          </>
        }
        sideNav={null}
        useAccountSettingsNav
        currentPage="OrderPage"
        footer={<Footer />}
      >
        <LayoutWrapperMain>
          <div className={css.content}>
            <div className={css.head}>
              <h1 className={css.title}>
                <FormattedMessage id="OrderPage.heading" />
              </h1>
            </div>
            {/* <Tabs defaultActiveKey="1" onChange={callback}>
              <TabPane tab="All order" key="1">
                <div className={css.tabContent}>
                  <div className={css.upcomingBooking}>
                    <div className={css.bookingImg}>
                      <img src={upcomingBooking} alt="Upcoming booking image" />
                    </div>
                    <div className={css.bookingInfo}>
                      <div className={css.bookingInfoTop}>
                        <div className={css.bookingInfoHead}>
                          <h2 className={css.title}>Orli Company Co. </h2>
                          <span className={classNames(css.bookingStatus, css.pending)}>
                            Confirmation Pending
                          </span>
                        </div>
                        <p className={css.description}>
                          Lorem Ipsum is simply dummy text of the printing and typesetting industry.{' '}
                        </p>
                        <p className={css.location}>
                          <Logo format="bannerLocationIcon" />4/266 Campbell Parade Bondi NSW
                        </p>

                        <div className={css.contacts}>
                          <a href="tel:02 9489 9480">
                            <IconCall /> 02 9489 9480
                          </a>
                          <a href="mailto:example@mail.com">
                            <IconAt /> example@mail.com
                          </a>
                        </div>
                      </div>
                      <div className={css.bookingInfoBottom}>
                        <div className={css.bookingInfoBottomLeft}>
                          <span className={css.keywords}>Haircut - Women</span>
                          <span className={css.keywords}>Haircut - Women</span>
                        </div>
                        <div className={css.bookingInfoBottomRight}>
                          <p className={css.serviceTime}>1h 30 m</p>
                          <p className={css.serviceDate}>7.30 am,Mon 30 July </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={css.upcomingBooking}>
                    <div className={css.bookingImg}>
                      <img src={upcomingBooking} alt="Upcoming booking image" />
                    </div>
                    <div className={css.bookingInfo}>
                      <div className={css.bookingInfoTop}>
                        <div className={css.bookingInfoHead}>
                          <h2 className={css.title}>Orli Company Co. </h2>
                          <span className={classNames(css.bookingStatus, css.confirm)}>
                            Confirmed
                          </span>
                        </div>
                        <p className={css.description}>
                          Lorem Ipsum is simply dummy text of the printing and typesetting industry.{' '}
                        </p>
                        <p className={css.location}>
                          <Logo format="bannerLocationIcon" />4/266 Campbell Parade Bondi NSW
                        </p>

                        <div className={css.contacts}>
                          <a href="tel:02 9489 9480">
                            <IconCall /> 02 9489 9480
                          </a>
                          <a href="mailto:example@mail.com">
                            <IconAt /> example@mail.com
                          </a>
                        </div>
                      </div>
                      <div className={css.bookingInfoBottom}>
                        <div className={css.bookingInfoBottomLeft}>
                          <span className={css.keywords}>Haircut - Women</span>
                          <span className={css.keywords}>Haircut - Women</span>
                        </div>
                        <div className={css.bookingInfoBottomRight}>
                          <p className={css.serviceTime}>1h 30 m</p>
                          <p className={css.serviceDate}>7.30 am,Mon 30 July </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={css.upcomingBooking}>
                    <div className={css.bookingImg}>
                      <img src={upcomingBooking} alt="Upcoming booking image" />
                    </div>
                    <div className={css.bookingInfo}>
                      <div className={css.bookingInfoTop}>
                        <div className={css.bookingInfoHead}>
                          <h2 className={css.title}>Orli Company Co. </h2>
                          <span className={classNames(css.bookingStatus, css.complete)}>
                            <IconTick /> Complete
                          </span>
                        </div>
                        <p className={css.description}>
                          Lorem Ipsum is simply dummy text of the printing and typesetting industry.{' '}
                        </p>
                        <p className={css.location}>
                          <Logo format="bannerLocationIcon" />4/266 Campbell Parade Bondi NSW
                        </p>

                        <div className={css.contacts}>
                          <a href="tel:02 9489 9480">
                            <IconCall /> 02 9489 9480
                          </a>
                          <a href="mailto:example@mail.com">
                            <IconAt /> example@mail.com
                          </a>
                        </div>
                      </div>
                      <div className={css.bookingInfoBottom}>
                        <div className={css.bookingInfoBottomLeft}>
                          <span className={css.keywords}>Haircut - Women</span>
                          <span className={css.keywords}>Haircut - Women</span>
                        </div>
                        <div className={css.bookingInfoBottomRight}>
                          <p className={css.serviceTime}>1h 30 m</p>
                          <p className={css.serviceDate}>7.30 am,Mon 30 July </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPane>
              <TabPane tab="Confirm" key="2">
                <div className={css.tabContent}>
                  <div className={css.upcomingBooking}>
                    <div className={css.bookingImg}>
                      <img src={upcomingBooking} alt="Upcoming booking image" />
                    </div>
                    <div className={css.bookingInfo}>
                      <div className={css.bookingInfoTop}>
                        <div className={css.bookingInfoHead}>
                          <h2 className={css.title}>Orli Company Co. </h2>
                          <span className={classNames(css.bookingStatus, css.confirm)}>
                            Confirmed
                          </span>
                        </div>
                        <p className={css.description}>
                          Lorem Ipsum is simply dummy text of the printing and typesetting industry.{' '}
                        </p>
                        <p className={css.location}>
                          <Logo format="bannerLocationIcon" />4/266 Campbell Parade Bondi NSW
                        </p>

                        <div className={css.contacts}>
                          <a href="tel:02 9489 9480">
                            <IconCall /> 02 9489 9480
                          </a>
                          <a href="mailto:example@mail.com">
                            <IconAt /> example@mail.com
                          </a>
                        </div>
                      </div>
                      <div className={css.bookingInfoBottom}>
                        <div className={css.bookingInfoBottomLeft}>
                          <span className={css.keywords}>Haircut - Women</span>
                          <span className={css.keywords}>Haircut - Women</span>
                        </div>
                        <div className={css.bookingInfoBottomRight}>
                          <p className={css.serviceTime}>1h 30 m</p>
                          <p className={css.serviceDate}>7.30 am,Mon 30 July </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPane>
              <TabPane tab="Upcoming" key="3">
                <div className={css.tabContent}>
                  <div className={css.upcomingBooking}>
                    <div className={css.bookingImg}>
                      <img src={upcomingBooking} alt="Upcoming booking image" />
                    </div>
                    <div className={css.bookingInfo}>
                      <div className={css.bookingInfoTop}>
                        <div className={css.bookingInfoHead}>
                          <h2 className={css.title}>Orli Company Co. </h2>
                          <span className={classNames(css.bookingStatus, css.upcoming)}>
                            Upcoming
                          </span>
                        </div>
                        <p className={css.description}>
                          Lorem Ipsum is simply dummy text of the printing and typesetting industry.{' '}
                        </p>
                        <p className={css.location}>
                          <Logo format="bannerLocationIcon" />4/266 Campbell Parade Bondi NSW
                        </p>

                        <div className={css.contacts}>
                          <a href="tel:02 9489 9480">
                            <IconCall /> 02 9489 9480
                          </a>
                          <a href="mailto:example@mail.com">
                            <IconAt /> example@mail.com
                          </a>
                        </div>
                      </div>
                      <div className={css.bookingInfoBottom}>
                        <div className={css.bookingInfoBottomLeft}>
                          <span className={css.keywords}>Haircut - Women</span>
                          <span className={css.keywords}>Haircut - Women</span>
                        </div>
                        <div className={css.bookingInfoBottomRight}>
                          <p className={css.serviceTime}>1h 30 m</p>
                          <p className={css.serviceDate}>7.30 am,Mon 30 July </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPane>
              <TabPane tab="Cancel" key="4">
                <div className={css.tabContent}>
                  <div className={css.upcomingBooking}>
                    <div className={css.bookingImg}>
                      <img src={upcomingBooking} alt="Upcoming booking image" />
                    </div>
                    <div className={css.bookingInfo}>
                      <div className={css.bookingInfoTop}>
                        <div className={css.bookingInfoHead}>
                          <h2 className={css.title}>Orli Company Co. </h2>
                          <span className={classNames(css.bookingStatus, css.cancel)}>Cancel</span>
                        </div>
                        <p className={css.description}>
                          Lorem Ipsum is simply dummy text of the printing and typesetting industry.{' '}
                        </p>
                        <p className={css.location}>
                          <Logo format="bannerLocationIcon" />4/266 Campbell Parade Bondi NSW
                        </p>

                        <div className={css.contacts}>
                          <a href="tel:02 9489 9480">
                            <IconCall /> 02 9489 9480
                          </a>
                          <a href="mailto:example@mail.com">
                            <IconAt /> example@mail.com
                          </a>
                        </div>
                      </div>
                      <div className={css.bookingInfoBottom}>
                        <div className={css.bookingInfoBottomLeft}>
                          <span className={css.keywords}>Haircut - Women</span>
                          <span className={css.keywords}>Haircut - Women</span>
                        </div>
                        <div className={css.bookingInfoBottomRight}>
                          <p className={css.serviceTime}>1h 30 m</p>
                          <p className={css.serviceDate}>7.30 am,Mon 30 July </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPane>
              <TabPane tab="Completed" key="5">
                <div className={css.tabContent}>
                  <div className={css.upcomingBooking}>
                    <div className={css.bookingImg}>
                      <img src={upcomingBooking} alt="Upcoming booking image" />
                    </div>
                    <div className={css.bookingInfo}>
                      <div className={css.bookingInfoTop}>
                        <div className={css.bookingInfoHead}>
                          <h2 className={css.title}>Orli Company Co. </h2>
                          <span className={classNames(css.bookingStatus, css.complete)}>
                            <IconTick /> Complated
                          </span>
                        </div>
                        <p className={css.description}>
                          Lorem Ipsum is simply dummy text of the printing and typesetting industry.{' '}
                        </p>
                        <p className={css.location}>
                          <Logo format="bannerLocationIcon" />4/266 Campbell Parade Bondi NSW
                        </p>

                        <div className={css.contacts}>
                          <a href="tel:02 9489 9480">
                            <IconCall /> 02 9489 9480
                          </a>
                          <a href="mailto:example@mail.com">
                            <IconAt /> example@mail.com
                          </a>
                        </div>
                      </div>
                      <div className={css.bookingInfoBottom}>
                        <div className={css.bookingInfoBottomLeft}>
                          <span className={css.keywords}>Haircut - Women</span>
                          <span className={css.keywords}>Haircut - Women</span>
                        </div>
                        <div className={css.bookingInfoBottomRight}>
                          <p className={css.serviceTime}>1h 30 m</p>
                          <p className={css.serviceDate}>7.30 am,Mon 30 July </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPane>
            </Tabs> */}
          </div>
        </LayoutWrapperMain>
      </LayoutSideNavigation>
    </Page>
  );
};

OrderPageComponent.defaultProps = {
  saveEmailError: null,
  savePhoneNumberError: null,
  currentUser: null,
  sendVerificationEmailError: null,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

OrderPageComponent.propTypes = {
  saveEmailError: propTypes.error,
  savePhoneNumberError: propTypes.error,
  saveContactDetailsInProgress: bool.isRequired,
  currentUser: propTypes.currentUser,
  currentUserListing: propTypes.ownListing,
  contactDetailsChanged: bool.isRequired,
  onChange: func.isRequired,
  onSubmitContactDetails: func.isRequired,
  scrollingDisabled: bool.isRequired,
  sendVerificationEmailInProgress: bool.isRequired,
  sendVerificationEmailError: propTypes.error,
  onResendVerificationEmail: func.isRequired,
  resetPasswordInProgress: bool,
  resetPasswordError: propTypes.error,
  // params: shape({
  //   tab: string.isRequired,
  // }).isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  // Topbar needs user info.
  const {
    currentUser,
    currentUserListing,
    sendVerificationEmailInProgress,
    sendVerificationEmailError,
  } = state.user;
  const {
    saveEmailError,
    savePhoneNumberError,
    saveContactDetailsInProgress,
    contactDetailsChanged,
    resetPasswordInProgress,
    resetPasswordError,
  } = state.ContactDetailsPage;
  return {
    saveEmailError,
    savePhoneNumberError,
    saveContactDetailsInProgress,
    currentUser,
    currentUserListing,
    contactDetailsChanged,
    scrollingDisabled: isScrollingDisabled(state),
    sendVerificationEmailInProgress,
    sendVerificationEmailError,
    resetPasswordInProgress,
    resetPasswordError,
  };
};

const mapDispatchToProps = dispatch => ({
  onChange: () => dispatch(saveContactDetailsClear()),
  onResendVerificationEmail: () => dispatch(sendVerificationEmail()),
  onSubmitContactDetails: values => dispatch(saveContactDetails(values)),
  onResetPassword: values => dispatch(resetPassword(values)),
});

const OrderPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(OrderPageComponent);

export default OrderPage;
