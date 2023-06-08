/**
 *  TopbarMobileMenu prints the menu content for authenticated user or
 * shows login actions for those who are not authenticated.
 */
import React from 'react';
import { bool, func, number, string } from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import { ACCOUNT_SETTINGS_PAGES } from '../../routing/routeConfiguration';
import { propTypes } from '../../util/types';
import { ensureCurrentUser } from '../../util/data';
import {
  AvatarLarge,
  ExternalLink,
  IconSearch,
  IconSocialMediaFacebook,
  IconSocialMediaInstagram,
  IconSocialMediaTwitter,
  InlineTextButton,
  NamedLink,
  NotificationBadge,
  OwnListingLink,
} from '../../components';
import Collapsible from 'react-collapsible';
// import {
//   Accordion,
//   AccordionItem,
//   AccordionItemHeading,
//   AccordionItemButton,
//   AccordionItemPanel,
// } from 'react-accessible-accordion';

// Demo styles, see 'Styles' section below for some notes on use.
// import 'react-accessible-accordion/dist/fancy-example.css';
import css from './TopbarMobileMenu.module.css';
import './accordian.css';
import IconCollection from '../IconCollection/IconCollection';
import categoryImg1 from '../../assets/categoryImg1.png';
import categoryImg2 from '../../assets/categoryImg2.png';
import categoryImg3 from '../../assets/categoryImg3.png';
import categoryImg4 from '../../assets/categoryImg4.png';
import categoryImg5 from '../../assets/categoryImg5.png';
import categoryImg6 from '../../assets/categoryImg6.png';

// import config from '../../config';
import { twitterPageURL } from '../../util/urlHelpers';
import IconInstagram from '../IconInstagram/IconInstagram';
import { useConfiguration } from '../../context/configurationContext';

// const renderSocialMediaLinks = intl => {
//   const {
//     siteFacebookPage,
//     siteInstagramPage,
//     siteTwitterHandle,
//     siteYoutubePage,
//     siteLinkedInPage,
//   } = config;
//   const siteTwitterPage = twitterPageURL(siteTwitterHandle);

//   const goToFb = intl.formatMessage({ id: 'Footer.goToFacebook' });
//   const goToInsta = intl.formatMessage({ id: 'Footer.goToInstagram' });
//   const goToTwitter = intl.formatMessage({ id: 'Footer.goToTwitter' });

//   const fbLink = siteFacebookPage ? (
//     <ExternalLink key="linkToFacebook" href={siteFacebookPage} className={css.icon} title={goToFb}>
//       <IconSocialMediaFacebook />
//     </ExternalLink>
//   ) : null;

//   const twitterLink = siteTwitterPage ? (
//     <ExternalLink
//       key="linkToTwitter"
//       href={siteTwitterPage}
//       className={css.icon}
//       title={goToTwitter}
//     >
//       <IconSocialMediaTwitter />
//     </ExternalLink>
//   ) : null;

//   const youtubeLink = siteYoutubePage ? (
//     <ExternalLink
//       key="linkToYoutube"
//       href={siteTwitterPage}
//       className={css.icon}
//       title={goToTwitter}
//     >
//       <IconCollection name="YOUTUBE_LOGO" />
//     </ExternalLink>
//   ) : null;
//   const LinkedLink = siteLinkedInPage ? (
//     <ExternalLink
//       key="linkToLinked"
//       href={siteTwitterPage}
//       className={css.icon}
//       title={goToTwitter}
//     >
//       <IconCollection name="LinkedIn_LOGO" />
//     </ExternalLink>
//   ) : null;

//   const instragramLink = siteInstagramPage ? (
//     <ExternalLink
//       key="linkToInstagram"
//       href={siteInstagramPage}
//       className={css.icon}
//       title={goToInsta}
//     >
//       <IconSocialMediaInstagram />
//     </ExternalLink>
//   ) : null;
//   return [instragramLink, youtubeLink, fbLink, LinkedLink].filter(v => v != null);
// };
const TopbarMobileMenu = props => {
  const {
    isAuthenticated,
    currentPage,
    currentUserHasListings,
    currentUserListing,
    currentUserListingFetched,
    currentUser,
    notificationCount,
    onLogout,
    onClose,
    authStep,
    redirectRoute,
    isDrawerOpen,
    onManageToggleDrawer,
    intl,
  } = props;
  // const socialMediaLinks = renderSocialMediaLinks(intl);

  const user = ensureCurrentUser(currentUser);
  const config = useConfiguration();

  if (!isAuthenticated) {
    const signup = (
      <NamedLink name="SignupPage" className={css.signupLink}>
        <FormattedMessage id="TopbarMobileMenu.signupLink" />
      </NamedLink>
    );

    const login = (
      <NamedLink name="LoginPage" className={css.loginLink}>
        <FormattedMessage id="TopbarMobileMenu.loginLink" />
      </NamedLink>
    );

    const signupOrLogin = (
      <span className={css.authenticationLinks}>
        <FormattedMessage id="TopbarMobileMenu.signupOrLogin" values={{ signup, login }} />
      </span>
    );
    return (
      <div className={css.root}>
        <div className={css.mobileMenuHead}>
          <div
            onClick={() => {
              onClose();
            }}
            className={css.closeModal}
          >
            <IconCollection name="MOBILE_CLOSE_ICON" />
          </div>
          <div className={css.mobileMenuSearchbar}>
            <input type="text" placeholder="What can we help you find?" />
            <span className={css.searchIcon}>
              <IconSearch />
            </span>
          </div>
        </div>

        <div className={css.content}>
          <div className={css.collapsibleContainer}>
            <Collapsible
              trigger={
                <>
                  {' '}
                  <h1> Hair</h1>
                  <IconCollection name="MOBILE_ARROW_DOWN" />
                </>
              }
            >
              <div className={css.mobileMenuBlock}>
                <h2>Services</h2>
                <ul className={css.menuLinks}>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Hairdressers
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink
                      className={css.menuLink}
                      name="SearchPage"
                      to={{ search: 'Dreadlocks' }}
                      // search: `pub_categoryId=${cat.key}`,
                    >
                      Dreadlocks
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Braids
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Installs / Sew In / Wigs
                    </NamedLink>
                  </li>
                </ul>
              </div>{' '}
              <div className={css.mobileMenuBlock}>
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
              </div>
              <div className={css.viewAll}>
                <a href="#" className={css.seeMore}>
                  See all Hair
                </a>
              </div>
            </Collapsible>
            <Collapsible
              trigger={
                <>
                  {' '}
                  <h1> Mens</h1>
                  <IconCollection name="MOBILE_ARROW_DOWN" />
                </>
              }
            >
              <div className={css.mobileMenuBlock}>
                <h2>Services</h2>
                <ul className={css.menuLinks}>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Barber
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Grooming
                    </NamedLink>
                  </li>
                </ul>
              </div>{' '}
              <div className={css.mobileMenuBlock}>
                <h2>Products</h2>
                <ul className={css.menuLinks}>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Mens Hair Products
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Skin Care
                    </NamedLink>
                  </li>
                </ul>
              </div>
              <div className={css.viewAll}>
                <a href="#" className={css.seeMore}>
                  See all Men
                </a>
              </div>
            </Collapsible>
            <Collapsible
              trigger={
                <>
                  {' '}
                  <h1>Beauty</h1>
                  <IconCollection name="MOBILE_ARROW_DOWN" />
                </>
              }
            >
              <div className={css.mobileMenuBlock}>
                <h2>Services</h2>
                <ul className={css.menuLinks}>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Eyelashes
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Eyebrows
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Facials
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Nails
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Makeup
                    </NamedLink>
                  </li>
                </ul>
              </div>{' '}
              <div className={css.mobileMenuBlock}>
                <h2>Products</h2>
                <ul className={css.menuLinks}>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Skin Care
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Beauty
                    </NamedLink>
                  </li>
                </ul>
              </div>
              <div className={css.viewAll}>
                <a href="#" className={css.seeMore}>
                  See all Beauty Salons
                </a>
              </div>
            </Collapsible>
            <Collapsible
              trigger={
                <>
                  {' '}
                  <h1>Wellness</h1>
                  <IconCollection name="MOBILE_ARROW_DOWN" />
                </>
              }
            >
              <div className={css.mobileMenuBlock}>
                <h2>Services</h2>
                <ul className={css.menuLinks}>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Fitness
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Massage
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Therapy / Mental Health
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Nutrition
                    </NamedLink>
                  </li>
                </ul>
              </div>{' '}
              <div className={css.mobileMenuBlock}>
                <h2>Products</h2>
                <ul className={css.menuLinks}>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Health & Body
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Accessories
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Tools & Brushes
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Other
                    </NamedLink>
                  </li>
                </ul>
              </div>
              <div className={css.viewAll}>
                <a href="#" className={css.seeMore}>
                  See all Wellness Centres
                </a>
              </div>
            </Collapsible>
            <Collapsible
              trigger={
                <>
                  {' '}
                  <h1>Treatments</h1>
                  <IconCollection name="MOBILE_ARROW_DOWN" />
                </>
              }
            >
              <div className={css.mobileMenuBlock}>
                <h2>Services</h2>
                <ul className={css.menuLinks}>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Laser Clinics
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Facials
                    </NamedLink>
                  </li>
                </ul>
              </div>{' '}
              <div className={css.viewAll}>
                <a href="#" className={css.seeMore}>
                  See all Treatments
                </a>
              </div>
            </Collapsible>
            <Collapsible
              trigger={
                <>
                  {' '}
                  <h1>Shop</h1>
                  <IconCollection name="MOBILE_ARROW_DOWN" />
                </>
              }
            >
              <div className={css.mobileMenuBlock}>
                <h2>Services</h2>
                <ul className={css.menuLinks}>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Hair care
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Mens Hair care
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Apparel
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Accessories
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Shoes
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Self care
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Home & Decor
                    </NamedLink>
                  </li>
                </ul>
              </div>{' '}
              <div className={css.viewAll}>
                <a href="#" className={css.seeMore}>
                  See All Articles
                </a>
              </div>
            </Collapsible>
            <Collapsible
              trigger={
                <>
                  {' '}
                  <h1>Blog</h1>
                  <IconCollection name="MOBILE_ARROW_DOWN" />
                </>
              }
            >
              <div className={css.mobileMenuBlock}>
                <h2>Services</h2>
                <ul className={css.menuLinks}>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Mens
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Hair
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Beauty
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Wellness
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Treatments
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Guides
                    </NamedLink>
                  </li>
                  <li>
                    <NamedLink className={css.menuLink} name="SearchPage">
                      Food
                    </NamedLink>
                  </li>
                </ul>
              </div>{' '}
              <div className={css.viewAll}>
                <a href="#" className={css.seeMore}>
                  See All Articles
                </a>
              </div>
            </Collapsible>
          </div>
        </div>
        <div className={css.footer}>
          <div
            className={css.createNewListingLink}
            name="NewListingPage"
            onClick={() => [onClose(), onManageToggleDrawer(!isDrawerOpen, 'SIGNUP')]}
          >
            <FormattedMessage id="TopbarDesktop.signup" />
          </div>
          <div
            className={css.createNewListingLink}
            name="NewListingPage"
            onClick={() => [onClose(), onManageToggleDrawer(!isDrawerOpen, 'LOGIN')]}
          >
            <FormattedMessage id="TopbarDesktop.login" />
          </div>
        </div>
      </div>
    );
  }

  const notificationCountBadge =
    notificationCount > 0 ? (
      <NotificationBadge className={css.notificationBadge} count={notificationCount} />
    ) : null;

  const displayName = user.attributes.profile.firstName;
  const currentPageClass = page => {
    const isAccountSettingsPage =
      page === 'AccountSettingsPage' && ACCOUNT_SETTINGS_PAGES.includes(currentPage);
    return currentPage === page || isAccountSettingsPage ? css.currentPage : null;
  };

  return (
    <div className={css.root}>
      {/* <AvatarLarge className={css.avatar} user={currentUser} /> */}

      <div className={css.mobileMenuHead}>
        <div
          onClick={() => {
            onClose();
          }}
          className={css.closeModal}
        >
          <IconCollection name="MOBILE_CLOSE_ICON" />
        </div>
        <div className={css.mobileMenuSearchbar}>
          <input type="text" placeholder="What can we help you find?" />
          <span className={css.searchIcon}>
            <IconSearch />
          </span>
        </div>
      </div>
      <div className={css.content}>
        <div className={css.collapsibleContainer}>
          <Collapsible
            trigger={
              <>
                {' '}
                <div className={css.categoryHead}>
                  <div className={css.categoryHeadLeft}>
                    <div className={css.categoryImg}>
                      <img src={categoryImg1} alt="image" />
                    </div>
                    <h1> Hair</h1>
                  </div>
                  <div className={css.categoryHeadRight}>
                    <IconCollection name="MOBILE_ARROW_DOWN" />
                  </div>
                </div>
              </>
            }
          >
            <div className={css.mobileMenuBlock}>
              <ul className={css.menuLinks}>
                <li>
                  <NamedLink className={css.menuLink} name="SearchPage">
                    Hairdressers
                  </NamedLink>
                </li>
                <li>
                  <NamedLink
                    className={css.menuLink}
                    name="SearchPage"
                    to={{ search: 'Dreadlocks' }}
                    // search: `pub_categoryId=${cat.key}`,
                  >
                    Dreadlocks
                  </NamedLink>
                </li>
                <li>
                  <NamedLink className={css.menuLink} name="SearchPage">
                    Protective styes
                  </NamedLink>
                </li>
                <li>
                  <NamedLink className={css.menuLink} name="SearchPage">
                    Extensions / Wigs
                  </NamedLink>
                </li>
              </ul>
            </div>
          </Collapsible>
          <Collapsible
            trigger={
              <>
                {' '}
                <div className={css.categoryHead}>
                  <div className={css.categoryHeadLeft}>
                    <div className={css.categoryImg}>
                      <img src={categoryImg2} alt="image" />
                    </div>
                    <h1>Beauty</h1>
                  </div>
                  <div className={css.categoryHeadRight}>
                    <IconCollection name="MOBILE_ARROW_DOWN" />
                  </div>
                </div>
              </>
            }
          >
            <div className={css.mobileMenuBlock}>
              <ul className={css.menuLinks}>
                <li>
                  <NamedLink className={css.menuLink} name="SearchPage">
                    Eyelashes
                  </NamedLink>
                </li>
                <li>
                  <NamedLink className={css.menuLink} name="SearchPage">
                    Eyebrows
                  </NamedLink>
                </li>
                <li>
                  <NamedLink className={css.menuLink} name="SearchPage">
                    Facials
                  </NamedLink>
                </li>
                <li>
                  <NamedLink className={css.menuLink} name="SearchPage">
                    Nails
                  </NamedLink>
                </li>
                <li>
                  <NamedLink className={css.menuLink} name="SearchPage">
                    Makeup
                  </NamedLink>
                </li>
              </ul>
            </div>
          </Collapsible>
          <Collapsible
            trigger={
              <>
                {' '}
                <div className={css.categoryHead}>
                  <div className={css.categoryHeadLeft}>
                    <div className={css.categoryImg}>
                      <img src={categoryImg3} alt="image" />
                    </div>
                    <h1>Treatments</h1>
                  </div>
                  <div className={css.categoryHeadRight}>
                    <IconCollection name="MOBILE_ARROW_DOWN" />
                  </div>
                </div>
              </>
            }
          >
            <div className={css.mobileMenuBlock}>
              <ul className={css.menuLinks}>
                <li>
                  <NamedLink className={css.menuLink} name="SearchPage">
                    Laser Clinics
                  </NamedLink>
                </li>
                <li>
                  <NamedLink className={css.menuLink} name="SearchPage">
                    Facials
                  </NamedLink>
                </li>
              </ul>
            </div>
          </Collapsible>
          <Collapsible
            trigger={
              <>
                {' '}
                <div className={css.categoryHead}>
                  <div className={css.categoryHeadLeft}>
                    <div className={css.categoryImg}>
                      <img src={categoryImg4} alt="image" />
                    </div>
                    <h1>Wellness</h1>
                  </div>
                  <div className={css.categoryHeadRight}>
                    <IconCollection name="MOBILE_ARROW_DOWN" />
                  </div>
                </div>
              </>
            }
          >
            <div className={css.mobileMenuBlock}>
              <ul className={css.menuLinks}>
                <li>
                  <NamedLink className={css.menuLink} name="SearchPage">
                    Fitness
                  </NamedLink>
                </li>
                <li>
                  <NamedLink className={css.menuLink} name="SearchPage">
                    Massage
                  </NamedLink>
                </li>
                <li>
                  <NamedLink className={css.menuLink} name="SearchPage">
                    Therapy / Mental Health
                  </NamedLink>
                </li>
                <li>
                  <NamedLink className={css.menuLink} name="SearchPage">
                    Nutrition
                  </NamedLink>
                </li>
              </ul>
            </div>
          </Collapsible>

          <Collapsible
            trigger={
              <>
                {' '}
                <div className={css.categoryHead}>
                  <div className={css.categoryHeadLeft}>
                    <div className={css.categoryImg}>
                      <img src={categoryImg5} alt="image" />
                    </div>
                    <h1>Blog</h1>
                  </div>
                  <div className={css.categoryHeadRight}>
                    <IconCollection name="MOBILE_ARROW_DOWN" />
                  </div>
                </div>
              </>
            }
          >
            <div className={css.mobileMenuBlock}>
              <ul className={css.menuLinks}>
                <li>
                  <NamedLink className={css.menuLink} name="SearchPage">
                    Mens
                  </NamedLink>
                </li>
                <li>
                  <NamedLink className={css.menuLink} name="SearchPage">
                    Hair
                  </NamedLink>
                </li>
                <li>
                  <NamedLink className={css.menuLink} name="SearchPage">
                    Beauty
                  </NamedLink>
                </li>
                <li>
                  <NamedLink className={css.menuLink} name="SearchPage">
                    Wellness
                  </NamedLink>
                </li>
                <li>
                  <NamedLink className={css.menuLink} name="SearchPage">
                    Treatments
                  </NamedLink>
                </li>
                <li>
                  <NamedLink className={css.menuLink} name="SearchPage">
                    Guides
                  </NamedLink>
                </li>
                <li>
                  <NamedLink className={css.menuLink} name="SearchPage">
                    Food
                  </NamedLink>
                </li>
              </ul>
            </div>
          </Collapsible>
          <div className={css.imABusiness}>
            <NamedLink name="BusinessLandingPage">I'm a Business</NamedLink>
          </div>
          <Collapsible
            trigger={
              <>
                <div className={css.categoryHead}>
                  <div className={css.categoryHeadLeft}>
                    <div className={css.categoryImg}>
                      <img src={categoryImg6} alt="image" />
                    </div>
                    <h1>About us</h1>
                  </div>
                  <div className={css.categoryHeadRight}>
                    <IconCollection name="MOBILE_ARROW_DOWN" />
                  </div>
                </div>
              </>
            }
          >
            <div className={css.mobileMenuBlock}>
              <ul className={css.menuLinks}>
                <li>
                  <NamedLink name="BusinessLandingPage" className={css.menuLink}>
                    <FormattedMessage id="Footer.toFAQPage" />
                  </NamedLink>
                </li>
                <li>
                  <NamedLink name="BusinessLandingPage" className={css.menuLink}>
                    <FormattedMessage id="Footer.termsOfUse" />
                  </NamedLink>
                </li>
                <li>
                  <NamedLink name="BusinessLandingPage" className={css.menuLink}>
                    <FormattedMessage id="Footer.privacyPolicy" />
                  </NamedLink>
                </li>
                <li>
                  <NamedLink name="BusinessLandingPage" className={css.menuLink}>
                    <FormattedMessage id="Footer.toNearmePage" />
                  </NamedLink>
                </li>
                <li>
                  <NamedLink name="AboutPage" to={{ hash: '#contact' }} className={css.menuLink}>
                    <FormattedMessage id="Footer.toContactPage" />
                  </NamedLink>
                </li>
              </ul>
            </div>
          </Collapsible>
          <div className={css.followSection}>
            <p>Follow Us</p>

            <div className={css.socialMediaLinks}>
              <IconInstagram />
            </div>
          </div>
        </div>
        {/* <span className={css.greeting}>
          <FormattedMessage id="TopbarMobileMenu.greeting" values={{ displayName }} />
        </span>
        <InlineTextButton rootClassName={css.logoutButton} onClick={onLogout}>
          <FormattedMessage id="TopbarMobileMenu.logoutLink" />
        </InlineTextButton> */}
        {/* <NamedLink
          className={classNames(css.inbox, currentPageClass('InboxPage'))}
          name="InboxPage"
          params={{ tab: currentUserHasListings ? 'sales' : 'orders' }}
        >
          <FormattedMessage id="TopbarMobileMenu.inboxLink" />
          {notificationCountBadge}
        </NamedLink>
        <OwnListingLink
          listing={currentUserListing}
          listingFetched={currentUserListingFetched}
          className={css.navigationLink}
        />
        <NamedLink
          className={classNames(css.navigationLink, currentPageClass('ProfileSettingsPage'))}
          name="ProfileSettingsPage"
        >
          <FormattedMessage id="TopbarMobileMenu.profileSettingsLink" />
        </NamedLink>
        <NamedLink
          className={classNames(css.navigationLink, currentPageClass('AccountSettingsPage'))}
          name="AccountSettingsPage"
        >
          <FormattedMessage id="TopbarMobileMenu.accountSettingsLink" />
        </NamedLink> */}
      </div>
      {/* <div className={css.footer}>
        <NamedLink className={css.createNewListingLink} name="NewListingPage">
          <FormattedMessage id="TopbarMobileMenu.newListingLink" />
        </NamedLink>
      </div> */}
    </div>
  );
};

TopbarMobileMenu.defaultProps = {
  currentUser: null,
  notificationCount: 0,
  currentPage: null,
  currentUserListing: null,
  currentUserListingFetched: false,
};

TopbarMobileMenu.propTypes = {
  isAuthenticated: bool.isRequired,
  currentUserHasListings: bool.isRequired,
  currentUserListing: propTypes.ownListing,
  currentUserListingFetched: bool,
  currentUser: propTypes.currentUser,
  currentPage: string,
  notificationCount: number,
  onLogout: func.isRequired,
};

export default TopbarMobileMenu;
