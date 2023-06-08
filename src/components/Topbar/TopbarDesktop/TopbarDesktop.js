import React, { useState, useEffect } from 'react';
import { bool, func, object, number, string } from 'prop-types';
import classNames from 'classnames';

import { FormattedMessage, intlShape } from '../../../util/reactIntl';
import { ACCOUNT_SETTINGS_PAGES } from '../../../routing/routeConfiguration';
import { propTypes } from '../../../util/types';
import {
  Avatar,
  InlineTextButton,
  LinkedLogo,
  Menu,
  MenuLabel,
  MenuContent,
  MenuItem,
  NamedLink,
  ListingLink,
  OwnListingLink,
  Modal,
  Page,
} from '../../../components';

import TopbarSearchForm from '../TopbarSearchForm/TopbarSearchForm';
import hair from './assets/hair.png';
import hairProduct from './assets/hair-products.png';
import men from './assets/men.png';
import beautySalon from './assets/beauty-salon.png';
import beautyProduct from './assets/beauty-products.png';
import menProduct from './assets/men-product.png';
import wellness from './assets/wellness.png';
import clinic from './assets/clinic.png';
import treatments from './assets/treatments.png';
import treatmentArticles from './assets/treatment-article.png';
import newIn from './assets/new-in.png';
import shopLifestyle from './assets/shop-lifestyle.png';
import latestArticle from './assets/latest-article.png';
import menArticle from './assets/men-article.png';
// import AuthenticationPage from '../../../containers/AuthenticationPage/AuthenticationPage';
import IconRightArrow from '../../IconRightArrow/IconRightArrow';
import IconBag from '../../IconBag/IconBag';
import IconBin from '../../IconBin/IconBin';

import IconAppointment from '../../IconAppointment/IconAppointment';
import IconMyOrders from '../../IconMyOrders/IconMyOrders';
import IconForm from '../../IconForm/IconForm';
import IconHelp from '../../IconHelp/IconHelp';
import IconLogOff from '../../IconLogOff/IconLogOff';

import IconHeartFilled from '../../IconHeartFilled/IconHeartFilled';
import IconUserProfile from '../../IconUserProfile/IconUserProfile';
import IconPaymentMethod from '../../IconPaymentMethod/IconPaymentMethod';
import IconCollection from '../../IconCollection/IconCollection';
import {OutsideClickHandler} from '../../../components';
import Drawer from 'react-modern-drawer';
// import '../../styles/react-modern-drawer.css';

import css from './TopbarDesktop.module.css';

const TopbarDesktop = props => {
  const {
    className,
    appConfig,
    currentUser,
    currentPage,
    rootClassName,
    currentUserHasListings,
    currentUserListing,
    currentUserListingFetched,
    notificationCount,
    intl,
    isAuthenticated,
    onLogout,
    onSearchSubmit,
    initialSearchFormValues,
    authStep,
    redirectRoute,
    isDrawerOpen,
    onManageToggleDrawer,
    onClose,
    isOpen,
    pathname,
    onManageDisableScrolling,
  } = props;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      onClose();
    }
  }, [isAuthenticated]);

  const currentUserListingPresent = isAuthenticated && currentUserListing ? true : false;

  const MAX_MOBILE_SCREEN_WIDTH = 768;
  const MAX_TAB_SCREEN_WIDTH = 992;
  const isMobileLayout =
    typeof window !== 'undefined' && window.innerWidth < MAX_MOBILE_SCREEN_WIDTH;
  const isTabeLayout = typeof window !== 'undefined' && window.innerWidth < MAX_TAB_SCREEN_WIDTH;

  const marketplaceName = appConfig.marketplaceName;
  const authenticatedOnClientSide = mounted && isAuthenticated;
  const isAuthenticatedOrJustHydrated = isAuthenticated || !mounted;

  const classes = classNames(rootClassName || css.root, className);

  const search = (
    <TopbarSearchForm
      className={css.searchLink}
      desktopInputRoot={css.topbarSearchWithLeftPadding}
      onSubmit={onSearchSubmit}
      initialValues={initialSearchFormValues}
      appConfig={appConfig}
    />
  );

  const openDrawer = () => {
    typeof window !== 'undefined' &&
      window.location.search &&
      !isAuthenticated &&
      onManageToggleDrawer(isDrawerOpen, 'SIGNUP');
  };

  useEffect(() => {
    openDrawer();
  }, []);

  const notificationDot = notificationCount > 0 ? <div className={css.notificationDot} /> : null;

  const inboxLink = authenticatedOnClientSide ? (
    <NamedLink
      className={css.inboxLink}
      name="InboxPage"
      params={{ tab: currentUserHasListings ? 'sales' : 'orders' }}
    >
      <span className={css.inbox}>
        <FormattedMessage id="TopbarDesktop.inbox" />
        {notificationDot}
      </span>
    </NamedLink>
  ) : null;

  const currentPageClass = page => {
    const isAccountSettingsPage =
      page === 'AccountSettingsPage' && ACCOUNT_SETTINGS_PAGES.includes(currentPage);
    return currentPage === page || isAccountSettingsPage ? css.currentPage : null;
  };

  const { firstName, lastName } = (currentUser && currentUser.attributes.profile) || {};

  const profileMenuContent = authenticatedOnClientSide
    ? (
      <div className={css.profileMenuContent}>
        <div className={css.authHeader}>
          <h1>
            <IconCollection name="PROFILE_ICON" />
            <span>
              Welcome {firstName} {lastName}
            </span>
          </h1>
          <span className={css.closeIcon} onClick={onClose}>
            &times;
          </span>
        </div>
        <div key="Profile">
          <div className={css.currentUserDetails}>
            {/* {
              isAuthenticated ? <h2>{firstName}{" "}{lastName}</h2> : null
            } */}
            <p>Be sure to validate your email address*</p>
            <IconCollection name="PROFILE_PICTURE" />
          </div>
        </div>
        <div key="StoreManager">
          {currentUserListingPresent ? (
            <NamedLink className={css.dropdownLink} name="BusinessLandingPage">
              Store Manager
            </NamedLink>
          ) : null}
        </div>
        <div key="">
          <NamedLink className={css.dropdownLink} name="BusinessLandingPage">
            PERSONAL DETAILS
          </NamedLink>
        </div>
        <div key="Order">
          <NamedLink className={css.dropdownLink} name="BusinessLandingPage">
            PAYMENT METHODS
          </NamedLink>
        </div>
        <div key="Message">
          <NamedLink className={css.dropdownLink} name="BusinessLandingPage">
            ORDERS
          </NamedLink>
        </div>
        <div key="Message">
          <NamedLink className={css.dropdownLink} name="BusinessLandingPage">
            APPOINTMENTS
          </NamedLink>
        </div>
        {/* <div key="Message">
        <NamedLink className={css.dropdownLink} name="ProfileSettingsPage">
          My Forms
        </NamedLink>
      </div> */}
        <div key="Message">
          <NamedLink className={css.dropdownLink} name="BusinessLandingPage">
            Liked Items
          </NamedLink>
        </div>
        <div key="Message">
          <NamedLink className={css.dropdownLink} name="BusinessLandingPage">
            GET HELP
          </NamedLink>
        </div>
        <div key="logout">
          <InlineTextButton rootClassName={css.logoutButton} onClick={onLogout}>
            <FormattedMessage id="TopbarDesktop.logout" />
          </InlineTextButton>
        </div>
        {/* <MenuItem key="EditListingPage">
          <OwnListingLink
            listing={currentUserListing}
            listingFetched={currentUserListingFetched}
            className={css.yourListingsLink}
          >
            <div>
              {currentUserListing ? (
                <FormattedMessage id="TopbarDesktop.editYourListingLink" />
              ) : (
                <FormattedMessage id="TopbarDesktop.addYourListingLink" />
              )}
            </div>
          </OwnListingLink>
        </MenuItem> */}
        {/* 
        <MenuItem key="ProfileSettingsPage">
          <NamedLink
            className={classNames(css.profileSettingsLink, currentPageClass('ProfileSettingsPage'))}
            name="ProfileSettingsPage"
          >
            <FormattedMessage id="TopbarDesktop.profileSettingsLink" />
          </NamedLink>
        </MenuItem>
        <MenuItem key="AccountSettingsPage">
          <NamedLink
            className={classNames(css.yourListingsLink, currentPageClass('AccountSettingsPage'))}
            name="AccountSettingsPage"
          >
            <FormattedMessage id="TopbarDesktop.accountSettingsLink" />
          </NamedLink>
        </MenuItem> */}
        <div className={css.startWithUs}>
          <NamedLink name="ProfileSettingsPage">
            <IconCollection name="YOUR_BUSINESS" />
          </NamedLink>
        </div>
      </div>
    ) : null;

  const mobileProfileMenuContent = (
    <div className={css.profileMenuContent}>
      <div className={css.mobileMenuHead}>
        <span className={css.closeIcon} onClick={onClose}>
          &times;
        </span>
        <div className={css.userProfile}>
          <img src={beautySalon} alt="userimage" />
        </div>
      </div>
      <div className={css.content}>
        {currentUserListingPresent ? (
          <NamedLink key="StoreManager" className={css.dropdownLink} name="BusinessLandingPage">
            <IconDashboard /> Store Manager
          </NamedLink>
        ) : null}
        <NamedLink key="" className={css.dropdownLink} name="BusinessLandingPage">
          <IconUserProfile /> Personal details
        </NamedLink>
        <NamedLink key="Order" className={css.dropdownLink} name="BusinessLandingPage">
          <IconPaymentMethod /> Payment methods
        </NamedLink>
        <NamedLink key="Message" className={css.dropdownLink} name="BusinessLandingPage">
          <IconHeartFilled />
          Liked
        </NamedLink>
        <NamedLink key="Message" className={css.dropdownLink} name="BusinessLandingPage">
          <IconAppointment /> Appointments
        </NamedLink>
        <NamedLink key="Message" className={css.dropdownLink} name="BusinessLandingPage">
          <IconMyOrders /> Orders
        </NamedLink>
        <NamedLink key="Message" className={css.dropdownLink} name="BusinessLandingPage">
          <IconForm /> My forms
        </NamedLink>
        <NamedLink key="Message" className={css.dropdownLink} name="BusinessLandingPage">
          <IconHelp /> GET HELP
        </NamedLink>
        <InlineTextButton key="logout" className={css.dropdownLink} onClick={onLogout}>
          <IconLogOff /> <FormattedMessage id="TopbarDesktop.logout" />
        </InlineTextButton>
        <div className={css.startWithUs}>
          <NamedLink name="ProfileSettingsPage">
            <IconCollection name="YOUR_BUSINESS" />
          </NamedLink>
        </div>
      </div>
    </div>
  );

  const profileMenu = isAuthenticated ? (
    <div>
      <div
        onClick={() => onManageToggleDrawer(!isDrawerOpen, 'SIDE-MENU')}
        className={css.profileMenuLabel}
        isOpenClassName={css.profileMenuIsOpen}
      >
        {/* <Avatar className={css.avatar} user={currentUser} disableProfileLink /> */}
        <IconUser user={currentUser} disableProfileLink />
      </div>
      <Drawer
        open={authStep == 'SIDE-MENU'}
        onClose={() => onManageToggleDrawer(!isDrawerOpen, null)}
        direction="right"
        className="bla bla bla"
      >
        {profileMenuContent}
      </Drawer>
    </div>
  ) : null;

  const cart = authenticatedOnClientSide ? (
    <Menu className={css.menuDropdown}>
      <MenuLabel className={css.profileMenuLabel} isOpenClassName={css.profileMenuIsOpen}>
        <IconBag />
      </MenuLabel>
      <MenuContent className={css.cartMenuContent}>
        <MenuItem key="Cart">
          <div className={css.currentUserDetails}>
            <h2>Cart (2) </h2>
          </div>
        </MenuItem>
        <MenuItem key="Profile1">
          <NamedLink className={css.dropdownLink} name="ProfileSettingsPage">
            <div className={css.cartItem}>
              <div className={css.cartItemImg}>
                <img src={cartImg} alt="cart image" />
              </div>
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
        <MenuItem key="Profile2">
          <NamedLink className={css.dropdownLink} name="ProfileSettingsPage">
            <div className={css.cartItem}>
              <div className={css.cartItemImg}>
                <img src={cartImg} alt="cart image" />
              </div>
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
        <MenuItem key="Profile3">
          <NamedLink className={css.dropdownLink} name="ProfileSettingsPage">
            <div className={css.cartItem}>
              <div className={css.cartItemImg}>
                <img src={cartImg} alt="cart image" />
              </div>
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
        <MenuItem key="Profile4">
          <NamedLink className={css.dropdownLink} name="ProfileSettingsPage">
            <div className={css.cartItem}>
              <div className={css.cartItemImg}>
                <img src={cartImg} alt="cart image" />
              </div>
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
        <MenuItem key="Profile5">
          <NamedLink className={css.dropdownLink} name="ProfileSettingsPage">
            <div className={css.cartItem}>
              <div className={css.cartItemImg}>
                <img src={cartImg} alt="cart image" />
              </div>
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
        <MenuItem key="Profile6">
          <NamedLink className={css.dropdownLink} name="ProfileSettingsPage">
            <div className={css.cartItem}>
              <div className={css.cartItemImg}>
                <img src={cartImg} alt="cart image" />
              </div>
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
        <MenuItem key="Profile7">
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
  ) : null;

  const signupLink = isAuthenticatedOrJustHydrated ? null : (
    <NamedLink name="SignupPage" className={css.signupLink}>
      <FormattedMessage id="TopbarDesktop.signup" />
    </NamedLink>
  );

  const loginLink = isAuthenticatedOrJustHydrated ? null : (
    <span onClick={() => onManageToggleDrawer(isDrawerOpen, 'LOGIN')} className={css.loginLink}>
      <FormattedMessage id="TopbarDesktop.login" />
    </span>
  );
  const businessLink = !isAuthenticated ? null : (
    <>
      {pathname === '/business-landing-page' ? null : (
        <span className={css.loginLink}>
          <NamedLink name="BusinessLandingPage">
            <FormattedMessage id="TopbarDesktop.business" />
          </NamedLink>
        </span>
      )}
    </>
  );

  const listingLink =
    authenticatedOnClientSide && currentUserListingFetched && currentUserListing ? (
      <ListingLink
        className={css.createListingLink}
        listing={currentUserListing}
        children={<FormattedMessage id="TopbarDesktop.viewListing" />}
      />
    ) : null;

  const createListingLink =
    isAuthenticatedOrJustHydrated && !(currentUserListingFetched && !currentUserListing) ? null : (
      <NamedLink className={css.createListingLink} name="NewListingPage">
        <FormattedMessage id="TopbarDesktop.createListing" />
      </NamedLink>
    );
  const [activeId, setActiveId] = useState(0);

  const values = [
    {
      id: 1,
      tabTitle: 'Hair',
      linkName: 'HairPage',
    },
    {
      id: 2,
      tabTitle: 'Men',
      linkName: 'MensPage',
    },
    {
      id: 3,
      tabTitle: 'Beauty',
      linkName: 'BeautyPage',
    },
    // {
    //   id: 4,
    //   tabTitle: 'Wellness',
    //   linkName: 'WellnessPage',
    // },
    {
      id: 5,
      tabTitle: 'Treatments',
      linkName: 'TreatmentsPage',
    },
    // {
    //   id: 6,
    //   tabTitle: 'Shop',
    //   linkName: 'SlopPage',
    // },
    {
      id: 7,
      tabTitle: 'Blog',
      linkName: 'BlogPage',
    },
  ];
  function onSelect({ key }) {
    console.log(`${key} selected`);
  }

  function onVisibleChange(visible) {
    console.log(visible);
  }
  const customStyle = {
    width: '100%',
    display: 'initial',
  };


  return (
    <>
      <nav className={classes}>
        <div className={classNames(css.fixedWidthHeader, activeId && css.headerBorder)}>
          <div className={classNames(css.headerContainer)}>
            <div className={css.leftContent}>
              <NamedLink className={css.logoLink} name="LandingPage">
                <IconCollection name="TOPBAR_LOGO" />
              </NamedLink>
              <div className={css.centerNav}>
                {values.map(val => (
                  <a
                    key={val.id}
                    href="#"
                    onClick={() => setActiveId(val.id)}
                    className={classNames(
                      css.createListingLink,
                      activeId == val.id ? css.active : null
                    )}
                  >
                    <span>{val.tabTitle}</span>
                  </a>
                ))}

                <div className={css.topSearch}>
                  {/* <span className={css.searchIcon} onClick={() => setShowSearch(!showSearch)}>
                    <IconCollection name="SEARCH_ICON" />
                  </span> */}
                  <a href="/s" className={css.searchIcon}>
                    <IconCollection name="SEARCH_ICON" />
                  </a>
                  {/* {showSearch && <input type="text" placeholder="Search" />} */}
                </div>
              </div>
            </div>
            <div className={css.loginWrapper}>
              {!authenticatedOnClientSide ? loginLink : null}
              {businessLink}

              {profileMenu}
              {/* {listingLink} */}
              {/* {inboxLink} */}
              {/* <span className={css.messages}>
                <IconMessage /> <span className={css.badge}>2</span>
              </span> */}
              {/* <IconNotification /> */}

              {authenticatedOnClientSide ? (
                <div className={css.divider}>&nbsp;</div>
              ) : (
                <div className={css.divider}>&nbsp;</div>
              )}
              {cart}
              {/* {profileMenu} */}
            </div>
          </div>
        </div>

        {/* mega menu */}
        <OutsideClickHandler onOutsideClick={() => setActiveId(0)} customStyle={customStyle}>
          <div
            className={classNames(
              css.megaMenuContainer,
              activeId == 1 ||
                activeId == 2 ||
                activeId == 3 ||
                activeId == 4 ||
                activeId == 5 ||
                activeId == 6 ||
                activeId == 7
                ? css.borderTop
                : null
            )}
          >
            <div className={css.fixedWidthContainer}>
              {activeId == 1 ? (
                <>
                  <div className={css.megaMenuContent}>
                    <div className={css.megaMenuLeft}>
                      <div className={css.megaMenuLinks}>
                        <h2>Services</h2>
                        <ul className={css.menuLinks}>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Hairdressers
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink
                              className={css.menuLink}
                              name="BusinessLandingPage"
                              to={{ search: 'Dreadlocks' }}
                              // search: `pub_categoryId=${cat.key}`,
                            >
                              Dreadlocks
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Braids
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Installs / Sew In / Wigs
                            </NamedLink>
                          </li>
                        </ul>
                      </div>
                      {/* <div className={css.megaMenuLinks}>
                        <h2>Products</h2>
                        <ul className={css.menuLinks}>
                          <li>
                            <NamedLink className={css.menuLink} name="SearchPage">
                              Hair Extensions
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink
                              className={css.menuLink}
                              name="SearchPage"
                              to={{ search: 'Dreadlocks' }}
                              // search: `pub_categoryId=${cat.key}`,
                            >
                              Hair Care
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="SearchPage">
                              Accessories
                            </NamedLink>
                          </li>
                        </ul>
                      </div> */}
                    </div>
                    <div className={css.megaMenuRight}>
                      <div className={css.exploreCategories}>
                        <div className={css.exploreWrapper}>
                          <div className={css.exploreBlock}>
                            <div className={`${css.borderDiv} ${css.yellowBorder} `}>
                              <div className={css.exploreImg}>
                                <img
                                  style={{
                                    objectFit: 'cover',
                                  }}
                                  src={hair}
                                  alt="Hair saloon"
                                  width={217}
                                  height={181}
                                />
                                <NamedLink name="BusinessLandingPage">
                                  <span>Explore Hair Salons</span>
                                </NamedLink>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className={css.exploreWrapper}>
                          <div className={css.exploreBlock}>
                            <div className={`${css.borderDiv} ${css.brownBorder} `}>
                              <div className={css.exploreImg}>
                                <img
                                  style={{
                                    objectFit: 'cover',
                                  }}
                                  src={hairProduct}
                                  alt="Hair saloon"
                                  width={217}
                                  height={181}
                                />
                                 <NamedLink name="SearchPage">
                                <span>Shop Hair Products</span>
                                 </NamedLink>
                              </div>
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                  <div className={css.viewAll}>
                    <NamedLink name="ComingSoon" className={css.seeMore}>
                      See all Hair <IconRightArrow />
                    </NamedLink>
                  </div>
                </>
              ) : activeId == 2 ? (
                <>
                  <div className={css.megaMenuContent}>
                    <div className={css.megaMenuLeft}>
                      <div className={css.megaMenuLinks}>
                        <h2>Services</h2>
                        <ul className={css.menuLinks}>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Barber
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Grooming
                            </NamedLink>
                          </li>
                        </ul>
                      </div>
                      {/* <div className={css.megaMenuLinks}>
                        <h2>Products</h2>
                        <ul className={css.menuLinks}>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Mens Hair Products
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Skin Care
                            </NamedLink>
                          </li>
                        </ul>
                      </div> */}
                    </div>
                    {/* <div className={css.megaMenuRight}>
                      <div className={css.exploreCategories}>
                        <div className={css.exploreWrapper}>
                          <h2>Explore Barbers</h2>
                          <div className={css.exploreBlock}>
                            <div className={classNames(css.borderDiv, css.brownBorder)}>
                              <div className={css.exploreImg}>
                                <img src={hairSaloon} alt="Hair saloon" />
                              </div>
                            </div>
                            <div className={css.exploreInfo}>
                              <p>Find more than 2000 + hair salons</p>
                              <a href="#" className={css.exploreNow}>
                                Explore now
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
                    <div className={css.megaMenuRight}>
                      <div className={css.exploreCategories}>
                        <div className={css.exploreWrapper}>
                          <div className={css.exploreBlock}>
                            <div className={`${css.borderDiv} ${css.greyBorder} `}>
                              <div className={css.exploreImg}>
                                <img
                                  style={{
                                    objectFit: 'cover',
                                  }}
                                  src={men}
                                  alt="Hair saloon"
                                  width={217}
                                  height={181}
                                />
                                <NamedLink name="BusinessLandingPage">
                                  <span>Explore Barbers</span>
                                </NamedLink>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className={css.exploreWrapper}>
                          <div className={css.exploreBlock}>
                            <div className={`${css.borderDiv} ${css.blueBorder} `}>
                              <div className={css.exploreImg}>
                                <img
                                  src={menProduct}
                                  style={{
                                    objectFit: 'cover',
                                  }}
                                  alt="Hair saloon"
                                  width={217}
                                  height={181}
                                />
                                 <NamedLink name="BusinessLandingPage">

                                <span>Shop Mens</span>
                                 </NamedLink>
                              </div>
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                  <div className={css.viewAll}>
                    <a href="ComingSoon" className={css.seeMore}>
                      See all Men <IconRightArrow />
                    </a>
                  </div>
                </>
              ) : activeId == 3 ? (
                <>
                  <div className={css.megaMenuContent}>
                    <div className={css.megaMenuLeft}>
                      <div className={css.megaMenuLinks}>
                        <h2>Services</h2>
                        <ul className={css.menuLinks}>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Eyelashes
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Eyebrows
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Facials
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Nails
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Makeup
                            </NamedLink>
                          </li>
                        </ul>
                      </div>
                      {/* <div className={css.megaMenuLinks}>
                        <h2>Products</h2>
                        <ul className={css.menuLinks}>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Skin Care
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Beauty
                            </NamedLink>
                          </li>
                        </ul>
                      </div> */}
                    </div>
                    <div className={css.megaMenuRight}>
                      <div className={css.exploreCategories}>
                        <div className={css.exploreWrapper}>
                          <div className={css.exploreBlock}>
                            <div className={`${css.borderDiv} ${css.pinkBorder} `}>
                              <div className={css.exploreImg}>
                                <img
                                  style={{
                                    objectFit: 'cover',
                                  }}
                                  src={beautySalon}
                                  alt="Hair saloon"
                                  width={217}
                                  height={181}
                                />
                                <NamedLink name="BusinessLandingPage">
                                  <span>Explore Beauty Salons</span>
                                </NamedLink>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className={css.exploreWrapper}>
                          <div className={css.exploreBlock}>
                            <div className={`${css.borderDiv} ${css.yellowBorder} `}>
                              <div className={css.exploreImg}>
                                <img
                                  style={{
                                    objectFit: 'cover',
                                  }}
                                  src={beautyProduct}
                                  alt="Hair saloon"
                                  width={217}
                                  height={181}
                                />
                                 <NamedLink name="BusinessLandingPage">

                                <span>Shop Beauty Products</span>
                                 </NamedLink>
                              </div>
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                  <div className={css.viewAll}>
                    <a href="ComingSoon" className={css.seeMore}>
                      See all Beauty Salons <IconRightArrow />
                    </a>
                  </div>
                </>
              ) : activeId == 4 ? (
                <>
                  <div className={css.megaMenuContent}>
                    <div className={css.megaMenuLeft}>
                      <div className={css.megaMenuLinks}>
                        <h2>Services</h2>
                        <ul className={css.menuLinks}>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Fitness
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Massage
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Therapy / Mental Health
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Nutrition
                            </NamedLink>
                          </li>
                        </ul>
                      </div>
                      {/* <div className={css.megaMenuLinks}>
                        <h2>Products</h2>
                        <ul className={css.menuLinks}>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Health & Body
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Accessories
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Tools & Brushes
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Other
                            </NamedLink>
                          </li>
                        </ul>
                      </div> */}
                    </div>
                    <div className={css.megaMenuRight}>
                      <div className={css.exploreCategories}>
                        <div className={css.exploreWrapper}>
                          <div className={css.exploreBlock}>
                            <div className={`${css.borderDiv} ${css.pinkBorder} `}>
                              <div className={css.exploreImg}>
                                <img
                                  style={{
                                    objectFit: 'cover',
                                  }}
                                  src={clinic}
                                  alt="Hair saloon"
                                  width={217}
                                  height={181}
                                />
                                <NamedLink name="BusinessLandingPage">
                                  <span>Explore Clinics</span>
                                </NamedLink>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className={css.exploreWrapper}>
                          <div className={css.exploreBlock}>
                            <div className={`${css.borderDiv} ${css.blueBorder} `}>
                              <div className={css.exploreImg}>
                                <img
                                  style={{
                                    objectFit: 'cover',
                                  }}
                                  src={wellness}
                                  alt="Hair saloon"
                                  width={217}
                                  height={181}
                                />
                                 <NamedLink name="BusinessLandingPage">

                                <span>Shop Wellness</span>
                                 </NamedLink>
                              </div>
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                  <div className={css.viewAll}>
                    <a href="ComingSoon" className={css.seeMore}>
                      See all Wellness Centres <IconRightArrow />
                    </a>
                  </div>
                </>
              ) : activeId == 5 ? (
                <>
                  <div className={css.megaMenuContent}>
                    <div className={css.megaMenuLeft}>
                      <div className={css.megaMenuLinks}>
                        <h2>Services</h2>
                        <ul className={css.menuLinks}>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Laser Clinics
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Facials
                            </NamedLink>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className={css.megaMenuRight}>
                      <div className={css.exploreCategories}>
                        <div className={css.exploreWrapper}>
                          <div className={css.exploreBlock}>
                            <div className={`${css.borderDiv} ${css.pinkBorder} `}>
                              <div className={css.exploreImg}>
                                <img
                                  style={{
                                    objectFit: 'cover',
                                  }}
                                  src={treatments}
                                  alt="Hair saloon"
                                  width={217}
                                  height={181}
                                />
                                <NamedLink name="BusinessLandingPage">
                                  <span>Explore Treatments</span>
                                </NamedLink>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={css.exploreWrapper}>
                          <div className={css.exploreBlock}>
                            <div className={`${css.borderDiv} ${css.yellowBorder} `}>
                              <div className={css.exploreImg}>
                                <img
                                  style={{
                                    objectFit: 'cover',
                                  }}
                                  src={treatmentArticles}
                                  alt="Hair saloon"
                                  width={217}
                                  height={181}
                                />
                                <NamedLink name="BusinessLandingPage">
                                  <span>Treatment Articles</span>
                                </NamedLink>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={css.viewAll}>
                    <a href="ComingSoon" className={css.seeMore}>
                      See all Treatments
                    </a>
                  </div>
                </>
              ) : activeId == 6 ? (
                <>
                  <div className={css.megaMenuContent}>
                    <div className={css.megaMenuLeft}>
                      <div className={css.megaMenuLinks}>
                        <h2>Services</h2>
                        <ul className={css.menuLinks}>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Hair care
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Mens Hair care
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Apparel
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Accessories
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Shoes
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Self care
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Home & Decor
                            </NamedLink>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className={css.megaMenuRight}>
                      <div className={css.exploreCategories}>
                        <div className={css.exploreWrapper}>
                          <div className={css.exploreBlock}>
                            <div className={`${css.borderDiv} ${css.yellowBorder} `}>
                              <div className={css.exploreImg}>
                                <img
                                  style={{
                                    objectFit: 'cover',
                                  }}
                                  src={newIn}
                                  alt="Hair saloon"
                                  width={217}
                                  height={181}
                                />
                                <NamedLink name="BusinessLandingPage">
                                  <span>NEW IN</span>
                                </NamedLink>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className={css.exploreWrapper}>
                          <div className={css.exploreBlock}>
                            <div className={`${css.borderDiv} ${css.blueBorder} `}>
                              <div className={css.exploreImg}>
                                <img
                                  style={{
                                    objectFit: 'cover',
                                  }}
                                  src={shopLifestyle}
                                  alt="Hair saloon"
                                  width={217}
                                  height={181}
                                />
                                 <NamedLink name="BusinessLandingPage">

                                <span>Shop Lifestyle</span>
                                 </NamedLink>
                              </div>
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                  <div className={css.viewAll}>
                    <a href="ComingSoon" className={css.seeMore}>
                      See All Articles <IconRightArrow />
                    </a>
                  </div>
                </>
              ) : activeId == 7 ? (
                <>
                  <div className={css.megaMenuContent}>
                    <div className={css.megaMenuLeft}>
                      <div className={css.megaMenuLinks}>
                        <h2>Topics</h2>
                        <ul className={css.menuLinks}>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Mens
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Hair
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Beauty
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Wellness
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Treatments
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Guides
                            </NamedLink>
                          </li>
                          <li>
                            <NamedLink className={css.menuLink} name="BusinessLandingPage">
                              Food
                            </NamedLink>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className={css.megaMenuRight}>
                      <div className={css.exploreCategories}>
                        <div className={css.exploreWrapper}>
                          <div className={css.exploreBlock}>
                            <div className={`${css.borderDiv} ${css.yellowBorder} `}>
                              <div className={css.exploreImg}>
                                <img
                                  style={{
                                    objectFit: 'cover',
                                  }}
                                  src={latestArticle}
                                  alt="Hair saloon"
                                  width={217}
                                  height={181}
                                />
                                <NamedLink name="BusinessLandingPage">
                                  <span>Latest Articles</span>
                                </NamedLink>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={css.exploreWrapper}>
                          <div className={css.exploreBlock}>
                            <div className={`${css.borderDiv} ${css.blueBorder} `}>
                              <div className={css.exploreImg}>
                                <img
                                  style={{
                                    objectFit: 'cover',
                                  }}
                                  src={menArticle}
                                  alt="Hair saloon"
                                  width={217}
                                  height={181}
                                />
                                <NamedLink name="BusinessLandingPage">
                                  <span>Mens Articles</span>
                                </NamedLink>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={css.viewAll}>
                    <a href="https://lumela-blog.onrender.com/" className={css.seeMore}>
                      See All Articles <IconRightArrow />
                    </a>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </OutsideClickHandler>
      </nav>

      {/* <AuthenticationPage
        // authStep={authStep}
        // redirectRoute={redirectRoute}
        // isDrawerOpen={isDrawerOpen}
        // onManageToggleDrawer={onManageToggleDrawer}
      /> */}
      <Modal
        id="TopbarMobileMenu"
        isOpen={isOpen && isAuthenticated && isTabeLayout}
        onClose={onClose}
        usePortal
        // onManageDisableScrolling={onManageDisableScrolling}
        isMobileMenuModal={true}
      >
        {mobileProfileMenuContent}
      </Modal>
    </>
  );
};

TopbarDesktop.defaultProps = {
  rootClassName: null,
  className: null,
  currentUser: null,
  currentPage: null,
  notificationCount: 0,
  initialSearchFormValues: {},
  appConfig: null,
};

TopbarDesktop.propTypes = {
  rootClassName: string,
  className: string,
  currentUserHasListings: bool.isRequired,
  currentUser: propTypes.currentUser,
  currentPage: string,
  isAuthenticated: bool.isRequired,
  onLogout: func.isRequired,
  notificationCount: number,
  onSearchSubmit: func.isRequired,
  initialSearchFormValues: object,
  intl: intlShape.isRequired,
  appConfig: object,
};

export default TopbarDesktop;
