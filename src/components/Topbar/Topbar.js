import React, { Component } from 'react';
import { array, arrayOf, bool, func, number, object, shape, string } from 'prop-types';
import pickBy from 'lodash/pickBy';
import classNames from 'classnames';

import appSettings from '../../config/settings';
import { useConfiguration } from '../../context/configurationContext';
import { useRouteConfiguration } from '../../context/routeConfigurationContext';

import { FormattedMessage, intlShape, useIntl } from '../../util/reactIntl';
import { isMainSearchTypeKeywords, isOriginInUse } from '../../util/search';
import { withViewport } from '../../util/uiHelpers';
import { parse, stringify } from '../../util/urlHelpers';
import { createResourceLocatorString, pathByRouteName } from '../../util/routes';
import { propTypes } from '../../util/types';
import {
  Button,
  LimitedAccessBanner,
  LinkedLogo,
  Modal,
  ModalMissingInformation,
  NamedLink,
  Menu,
  MenuLabel,
  MenuContent,
  MenuItem,
} from '../../components';
import IconBag from '../IconBag/IconBag';
import IconBin from '../IconBin/IconBin';
import IconCollection from '../IconCollection/IconCollection';
import MenuIcon from './MenuIcon';
import SearchIcon from './SearchIcon';
import TopbarSearchForm from './TopbarSearchForm/TopbarSearchForm';
import TopbarMobileMenu from './TopbarMobileMenu/TopbarMobileMenu';
import TopbarDesktop from './TopbarDesktop/TopbarDesktop';
// import cartImg from '../../assets/fonts'


import css from './Topbar.module.css';

const MAX_MOBILE_SCREEN_WIDTH = 768;

const redirectToURLWithModalState = (props, modalStateParam) => {
  const { history, location } = props;
  const { pathname, search, state } = location;
  const searchString = `?${stringify({ [modalStateParam]: 'open', ...parse(search) })}`;
  history.push(`${pathname}${searchString}`, state);
};

const redirectToURLWithoutModalState = (props, modalStateParam) => {
  const { history, location } = props;
  const { pathname, search, state } = location;
  const queryParams = pickBy(parse(search), (v, k) => {
    return k !== modalStateParam;
  });
  const stringified = stringify(queryParams);
  const searchString = stringified ? `?${stringified}` : '';
  history.push(`${pathname}${searchString}`, state);
};

const GenericError = props => {
  const { show } = props;
  const classes = classNames(css.genericError, {
    [css.genericErrorVisible]: show,
  });
  return (
    <div className={classes}>
      <div className={css.genericErrorContent}>
        <p className={css.genericErrorText}>
          <FormattedMessage id="Topbar.genericError" />
        </p>
      </div>
    </div>
  );
};

GenericError.propTypes = {
  show: bool.isRequired,
};

class TopbarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { modalIsOpen: false };
    this.isMobileAccountOpen = this.isMobileAccountOpen.bind(this);
    this.handleMobileAccountClose = this.handleMobileAccountClose.bind(this);
    this.handleMobileMenuOpen = this.handleMobileMenuOpen.bind(this);
    this.handleMobileMenuClose = this.handleMobileMenuClose.bind(this);
    this.handleMobileSearchOpen = this.handleMobileSearchOpen.bind(this);
    this.handleMobileSearchClose = this.handleMobileSearchClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleMobileMenuOpen() {
    redirectToURLWithModalState(this.props, 'mobilemenu');
  }

  handleMobileMenuClose() {
    redirectToURLWithoutModalState(this.props, 'mobilemenu');
  }

  isMobileAccountOpen() {
    this.setState({ modalIsOpen: !this.state.modalIsOpen });
  }

  handleMobileAccountClose() {
    redirectToURLWithoutModalState(this.props, 'mobileAccount');
  }

  handleMobileSearchOpen() {
    redirectToURLWithModalState(this.props, 'mobilesearch');
  }

  handleMobileSearchClose() {
    redirectToURLWithoutModalState(this.props, 'mobilesearch');
  }

  handleSubmit(values) {
    const { currentSearchParams } = this.props;
    const { history, config, routeConfiguration } = this.props;

    const topbarSearchParams = () => {
      if (isMainSearchTypeKeywords(config)) {
        return { keywords: values?.keywords };
      }
      // topbar search defaults to 'location' search
      const { search, selectedPlace } = values?.location;
      const { origin, bounds } = selectedPlace;
      const originMaybe = isOriginInUse(config) ? { origin } : {};

      return {
        ...originMaybe,
        address: search,
        bounds,
      };
    };
    const searchParams = {
      ...currentSearchParams,
      ...topbarSearchParams(),
    };
    history.push(createResourceLocatorString('SearchPage', routeConfiguration, {}, searchParams));
  }

  handleLogout() {
    const { onLogout, history, routeConfiguration } = this.props;
    onLogout().then(() => {
      const path = pathByRouteName('LandingPage', routeConfiguration);

      // In production we ensure that data is really lost,
      // but in development mode we use stored values for debugging
      if (appSettings.dev) {
        history?.push(path);
      } else if (typeof window !== 'undefined') {
        window.location = path;
      }

      console.log('logged out'); // eslint-disable-line
    });
  }

  render() {
    const {
      className,
      rootClassName,
      desktopClassName,
      mobileRootClassName,
      mobileClassName,
      isAuthenticated,
      authScopes,
      authInProgress,
      currentUser,
      currentUserHasListings,
      currentUserListing,
      currentUserListingFetched,
      currentUserHasOrders,
      currentPage,
      notificationCount,
      viewport,
      intl,
      location,
      authStep,
      redirectRoute,
      isDrawerOpen,
      onManageToggleDrawer,
      onManageDisableScrolling,
      onResendVerificationEmail,
      sendVerificationEmailInProgress,
      sendVerificationEmailError,
      showGenericError,
      config,
      isLandingPage,
      isHeaderSticky,
      pathname,
      loginError,
      signupError,
      submitLogin,
      submitSignup,
    } = this.props;
    
    


    const { mobilemenu, mobilesearch, keywords, address, origin, bounds } = parse(location?.search, {
      latlng: ['origin'],
      latlngBounds: ['bounds'],
    });

    const notificationDot = notificationCount > 0 ? <div className={css.notificationDot} /> : null;

    const isMobileLayout = viewport.width < MAX_MOBILE_SCREEN_WIDTH;
    const isMobileMenuOpen = isMobileLayout && mobilemenu === 'open';
    const isMobileSearchOpen = isMobileLayout && mobilesearch === 'open';

    const mobileMenu = (
      <TopbarMobileMenu
        onManageDisableScrolling={onManageDisableScrolling}
        onClose={this.handleMobileMenuClose}
        isAuthenticated={isAuthenticated}
        currentUserHasListings={currentUserHasListings}
        currentUserListing={currentUserListing}
        currentUserListingFetched={currentUserListingFetched}
        currentUser={currentUser}
        onLogout={this.handleLogout}
        notificationCount={notificationCount}
        currentPage={currentPage}
        authStep={authStep}
        redirectRoute={redirectRoute}
        isDrawerOpen={isDrawerOpen}
        onManageToggleDrawer={onManageToggleDrawer}
      />
    );

    const topbarSearcInitialValues = () => {
      if (isMainSearchTypeKeywords(config)) {
        return { keywords };
      }

      // Only render current search if full place object is available in the URL params
      const locationFieldsPresent = isOriginInUse(config)
        ? address && origin && bounds
        : address && bounds;
      return {
        location: locationFieldsPresent
          ? {
            search: address,
            selectedPlace: { address, origin, bounds },
          }
          : null,
      };
    };
    const initialSearchFormValues = topbarSearcInitialValues();

    const classes = classNames(
      rootClassName || css.root,
      className,
      isLandingPage ? css.landingPageHeader : null,
      isHeaderSticky
    );

    const cart = (
      <Menu className={css.menuDropdown}>
        <MenuLabel className={css.profileMenuLabel} isOpenClassName={css.profileMenuIsOpen}>
          <IconBag />
        </MenuLabel>
        <MenuContent className={css.cartMenuContent}>
          <MenuItem key="cart">
            <div className={css.currentUserDetails}>
              <h2>Cart (2) </h2>
            </div>
          </MenuItem>
          <MenuItem key="Profile">
            <NamedLink className={css.dropdownLink} name="ProfileSettingsPage">
              <div className={css.cartItem}>
                {/* <div className={css.cartItemImg}>
                  <img src={cartImg} alt="cart image" />
                </div> */}
                <div className={css.cartItemInfo}>
                  <div className={css.serviceDetails}>
                    <div className={css.serviceTime}>
                      <h2>Haircut - Women</h2>
                      <p>
                        <span className={css.time}>45 m</span>{' '}
                        <span className={css.date}>7.30 pm,Mon 30 July </span>
                      </p>
                    </div>
                    <div className={css.servicePrice}>$50</div>
                  </div>
                  <div className={css.serviceAddress}>
                    <div className={css.serviceAddressLeft}>
                      <h2>Strands Salon</h2>
                      <p>
                        <span className={css.time}>102,Example Street,New Delhi</span>
                      </p>
                    </div>
                    <div className={css.serviceAddressRight}>
                      <IconBin />
                    </div>
                  </div>
                </div>
              </div>
            </NamedLink>
          </MenuItem>
          <MenuItem key="profile2">
            <NamedLink className={css.dropdownLink} name="ProfileSettingsPage">
              <div className={css.cartItem}>
                {/* <div className={css.cartItemImg}>
                  <img src={cartImg} alt="cart image" />
                </div> */}
                <div className={css.cartItemInfo}>
                  <div className={css.serviceDetails}>
                    <div className={css.serviceTime}>
                      <h2>Haircut - Women</h2>
                      <p>
                        <span className={css.time}>45 m</span>{' '}
                        <span className={css.date}>7.30 pm,Mon 30 July </span>
                      </p>
                    </div>
                    <div className={css.servicePrice}>$50</div>
                  </div>
                  <div className={css.serviceAddress}>
                    <div className={css.serviceAddressLeft}>
                      <h2>Strands Salon</h2>
                      <p>
                        <span className={css.time}>102,Example Street,New Delhi</span>
                      </p>
                    </div>
                    <div className={css.serviceAddressRight}>
                      <IconBin />
                    </div>
                  </div>
                </div>
              </div>
            </NamedLink>
          </MenuItem>
          <MenuItem key="profile3">
            <NamedLink className={css.dropdownLink} name="ProfileSettingsPage">
              <div className={css.cartItem}>
                {/* <div className={css.cartItemImg}>
                  <img src={cartImg} alt="cart image" />
                </div> */}
                <div className={css.cartItemInfo}>
                  <div className={css.serviceDetails}>
                    <div className={css.serviceTime}>
                      <h2>Haircut - Women</h2>
                      <p>
                        <span className={css.time}>45 m</span>{' '}
                        <span className={css.date}>7.30 pm,Mon 30 July </span>
                      </p>
                    </div>
                    <div className={css.servicePrice}>$50</div>
                  </div>
                  <div className={css.serviceAddress}>
                    <div className={css.serviceAddressLeft}>
                      <h2>Strands Salon</h2>
                      <p>
                        <span className={css.time}>102,Example Street,New Delhi</span>
                      </p>
                    </div>
                    <div className={css.serviceAddressRight}>
                      <IconBin />
                    </div>
                  </div>
                </div>
              </div>
            </NamedLink>
          </MenuItem>
          <MenuItem key="profile4">
            <NamedLink className={css.dropdownLink} name="ProfileSettingsPage">
              <div className={css.cartItem}>
                {/* <div className={css.cartItemImg}>
                  <img src={cartImg} alt="cart image" />
                </div> */}
                <div className={css.cartItemInfo}>
                  <div className={css.serviceDetails}>
                    <div className={css.serviceTime}>
                      <h2>Haircut - Women</h2>
                      <p>
                        <span className={css.time}>45 m</span>{' '}
                        <span className={css.date}>7.30 pm,Mon 30 July </span>
                      </p>
                    </div>
                    <div className={css.servicePrice}>$50</div>
                  </div>
                  <div className={css.serviceAddress}>
                    <div className={css.serviceAddressLeft}>
                      <h2>Strands Salon</h2>
                      <p>
                        <span className={css.time}>102,Example Street,New Delhi</span>
                      </p>
                    </div>
                    <div className={css.serviceAddressRight}>
                      <IconBin />
                    </div>
                  </div>
                </div>
              </div>
            </NamedLink>
          </MenuItem>
          <MenuItem key="profile5">
            <NamedLink className={css.dropdownLink} name="ProfileSettingsPage">
              <div className={css.cartItem}>
                {/* <div className={css.cartItemImg}>
                  <img src={cartImg} alt="cart image" />
                </div> */}
                <div className={css.cartItemInfo}>
                  <div className={css.serviceDetails}>
                    <div className={css.serviceTime}>
                      <h2>Haircut - Women</h2>
                      <p>
                        <span className={css.time}>45 m</span>{' '}
                        <span className={css.date}>7.30 pm,Mon 30 July </span>
                      </p>
                    </div>
                    <div className={css.servicePrice}>$50</div>
                  </div>
                  <div className={css.serviceAddress}>
                    <div className={css.serviceAddressLeft}>
                      <h2>Strands Salon</h2>
                      <p>
                        <span className={css.time}>102,Example Street,New Delhi</span>
                      </p>
                    </div>
                    <div className={css.serviceAddressRight}>
                      <IconBin />
                    </div>
                  </div>
                </div>
              </div>
            </NamedLink>
          </MenuItem>
          <MenuItem key="profile6">
            <NamedLink className={css.dropdownLink} name="ProfileSettingsPage">
              <div className={css.cartItem}>
                {/* <div className={css.cartItemImg}>
                  <img src={cartImg} alt="cart image" />
                </div> */}
                <div className={css.cartItemInfo}>
                  <div className={css.serviceDetails}>
                    <div className={css.serviceTime}>
                      <h2>Haircut - Women</h2>
                      <p>
                        <span className={css.time}>45 m</span>{' '}
                        <span className={css.date}>7.30 pm,Mon 30 July </span>
                      </p>
                    </div>
                    <div className={css.servicePrice}>$50</div>
                  </div>
                  <div className={css.serviceAddress}>
                    <div className={css.serviceAddressLeft}>
                      <h2>Strands Salon</h2>
                      <p>
                        <span className={css.time}>102,Example Street,New Delhi</span>
                      </p>
                    </div>
                    <div className={css.serviceAddressRight}>
                      <IconBin />
                    </div>
                  </div>
                </div>
              </div>
            </NamedLink>
          </MenuItem>
          <MenuItem key="profile7">
            <div className={css.totalPay}>
              <div className={css.leftSec}>
                <h2>Total Pay</h2>
                <h2>$180</h2>
              </div>
              <div className={css.rightSec}>
                <button className={css.blueBtn}>Proceed</button>
              </div>
            </div>
          </MenuItem>
        </MenuContent>
      </Menu>
    );

    return (
      <div className={classes}>
        <LimitedAccessBanner
          isAuthenticated={isAuthenticated}
          authScopes={authScopes}
          currentUser={currentUser}
          onLogout={this.handleLogout}
          currentPage={currentPage}
        />
        <div className={classNames(mobileRootClassName || css.container, mobileClassName)}>
          {/* <div className={css.mobileLogoDiv}>
              <NamedLink
                className={css.home}
                name="BusinessLandingPage"
                title={intl.formatMessage({ id: 'Topbar.logoIcon' })}
              >
                <span className={css.logoLink} name="BusinessLandingPage">
                <IconCollection name="TOPBAR_LOGO"/>
                </span>
              </NamedLink>
            </div> */}

          <div className={css.mobileMenuContent}>
            <Button
              rootClassName={css.menu}
              onClick={this.handleMobileMenuOpen}
              title={intl.formatMessage({ id: 'Topbar.menuIcon' })}
            >
              <MenuIcon className={css.menuIcon} />
              {notificationDot}
            </Button>
            <NamedLink name="LoginPage" className={css.logoMobileLink}>
              <IconCollection name="MOBILE_NAV_LOGO" />
            </NamedLink>
            <div className={css.searchBoxWrapper}>
              <div className={css.searchforAny}>
                <IconCollection name="MOBILE_NAV_SEARCH" />
                <input type="text" placeholder="Search" />
              </div>
            </div>
            {isAuthenticated ? (
              <div className={css.rightMenuLinks} onClick={this.isMobileAccountOpen}>
                <IconCollection name="MOBILE_NAV_PROFILE" />
              </div>
            ) : null}
          </div>
        </div>
        <div className={css.desktop}>
          <TopbarDesktop
            onManageDisableScrolling={onManageDisableScrolling}
            isOpen={this.state.modalIsOpen}
            onClose={this.isMobileAccountOpen}
            className={desktopClassName}
            currentUserHasListings={currentUserHasListings}
            currentUserListing={currentUserListing}
            currentUserListingFetched={currentUserListingFetched}
            currentUser={currentUser}
            currentPage={currentPage}
            initialSearchFormValues={initialSearchFormValues}
            intl={intl}
            isAuthenticated={isAuthenticated}
            notificationCount={notificationCount}
            onLogout={this.handleLogout}
            onSearchSubmit={this.handleSubmit}
            authStep={authStep}
            redirectRoute={redirectRoute}
            isDrawerOpen={isDrawerOpen}
            onManageToggleDrawer={onManageToggleDrawer}
            pathname={pathname}
            appConfig={config}
            loginError={loginError}
            signupError={signupError}
            submitLogin={submitLogin}
            submitSignup={submitSignup}
          />
        </div>
        <Modal
          id="TopbarMobileMenu"
          isOpen={isMobileMenuOpen}
          onClose={this.handleMobileMenuClose}
          usePortal
          onManageDisableScrolling={() => { }}
          isMobileMenuModal={true}
        >
          {authInProgress ? null : mobileMenu}
        </Modal>
        <Modal
          id="TopbarMobileSearch"
          containerClassName={css.modalContainer}
          isOpen={isMobileSearchOpen}
          onClose={this.handleMobileSearchClose}
          usePortal
          onManageDisableScrolling={() => { }}
        >
          <div className={css.searchContainer}>
            <TopbarSearchForm
              onSubmit={this.handleSubmit}
              initialValues={initialSearchFormValues}
              appConfig={config}
              isMobile
            />
            <p className={css.mobileHelp}>
              <FormattedMessage id="Topbar.mobileSearchHelp" />
            </p>
          </div>
        </Modal>
        {/* <ModalMissingInformation
            id="MissingInformationReminder"
            containerClassName={css.missingInformationModal}
            currentUser={currentUser}
            currentUserHasListings={currentUserHasListings}
            currentUserHasOrders={currentUserHasOrders}
            location={location}
            onManageDisableScrolling={onManageDisableScrolling}
            onResendVerificationEmail={onResendVerificationEmail}
            sendVerificationEmailInProgress={sendVerificationEmailInProgress}
            sendVerificationEmailError={sendVerificationEmailError}
          /> */}

        <GenericError show={showGenericError} />
      </div>
    );
  }
}

TopbarComponent.defaultProps = {
  className: null,
  rootClassName: null,
  desktopClassName: null,
  mobileRootClassName: null,
  mobileClassName: null,
  notificationCount: 0,
  currentUser: null,
  currentUserHasOrders: null,
  currentPage: null,
  sendVerificationEmailError: null,
  authScopes: [],
};

TopbarComponent.propTypes = {
  className: string,
  rootClassName: string,
  desktopClassName: string,
  mobileRootClassName: string,
  mobileClassName: string,
  isAuthenticated: bool.isRequired,
  authScopes: array,
  authInProgress: bool.isRequired,
  currentUser: propTypes.currentUser,
  currentUserHasListings: bool.isRequired,
  currentUserHasOrders: bool,
  currentPage: string,
  notificationCount: number,
  onLogout: func.isRequired,
  onManageDisableScrolling: func.isRequired,
  onResendVerificationEmail: func.isRequired,
  sendVerificationEmailInProgress: bool.isRequired,
  sendVerificationEmailError: propTypes.error,
  showGenericError: bool.isRequired,

  // These are passed from Page to keep Topbar rendering aware of location changes
  history: shape({
    push: func.isRequired,
  }).isRequired,
  location: shape({
    search: string.isRequired,
  }).isRequired,

  // from withViewport
  viewport: shape({
    width: number.isRequired,
    height: number.isRequired,
  }).isRequired,

  // from useIntl
  intl: intlShape.isRequired,

  // from useConfiguration
  config: object.isRequired,

  // from useRouteConfiguration
  routeConfiguration: arrayOf(propTypes.route).isRequired,
};

const EnhancedTopbar = props => {
  const config = useConfiguration();
  const routeConfiguration = useRouteConfiguration();
  const intl = useIntl();
  return (
    <TopbarComponent
      config={config}
      routeConfiguration={routeConfiguration}
      intl={intl}
      {...props}
    />
  );
};

const Topbar = withViewport(EnhancedTopbar);
Topbar.displayName = 'Topbar';

export default Topbar;
