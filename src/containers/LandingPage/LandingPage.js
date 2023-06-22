import React, { useEffect, useState } from 'react';
import { bool, object } from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';

import { camelize } from '../../util/string';
import { propTypes } from '../../util/types';
import { intlShape } from '../../util/reactIntl';
import { withViewport } from '../../util/contextHelpers';

import { H1 } from '../PageBuilder/Primitives/Heading';
import FallbackPage, { fallbackSections } from './FallbackPage';
import PageBuilder, { SectionBuilder } from '../PageBuilder/PageBuilder';

import { ASSET_NAME } from './LandingPage.duck';
import { manageToggleDrawer } from '../../ducks/ui.duck';
import { getListingsById } from '../../ducks/marketplaceData.duck';
import { authenticationInProgress, logout, login, signup } from '../../ducks/auth.duck';

import css from './LandingPage.module.css';

// This "content-only" component can be used in modals etc.
const LandingPageContent = props => {
  const {
    inProgress,
    error,
    data,
    isDrawerOpen,
    authStep,
    redirectRoute,
    onManageToggleDrawer,
  } = props;

  if (inProgress) {
    return null;
  }
  // We don't want to add h1 heading twice to the HTML (SEO issue).
  // Modal's header is mapped as h2
  const hasContent = data => typeof data?.content === 'string';
  const exposeContentAsChildren = data => {
    return hasContent(data) ? { children: data.content } : {};
  };
  const CustomHeading1 = props => <H1 as="h2" {...props} />;

  const hasData = error === null && data;
  const sectionsData = hasData ? data : fallbackSections;

  return (
    <SectionBuilder
      {...sectionsData}
      isDrawerOpen={isDrawerOpen}
      authStep={authStep}
      redirectRoute={redirectRoute}
      onManageToggleDrawer={onManageToggleDrawer}
      options={{
        fieldComponents: {
          heading1: { component: CustomHeading1, pickValidProps: exposeContentAsChildren },
        },
        isInsideContainer: true,
      }}
    />
  );
};

// Presentational component for PrivacyPolicyPage
const LandingPageComponent = props => {
  const {
    pageAssetsData,
    inProgress,
    error,
    isDrawerOpen,
    authStep,
    onLogout,
    loginError,
    signupError,
    submitLogin,
    submitSignup,
    redirectRoute,
    authInProgress,
    onManageToggleDrawer,
    listings,
    history,
    isAuthenticated,
  } = props;

  const [scroll, setScroll] = useState(false);
  useEffect(() => {
    let isMounted = true;
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        if (isMounted) {
          setScroll(window.scrollY > 0);
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => {
        isMounted = false; // This is the cleanup for event listener
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const isHeaderSticky = scroll ? css.sticky : '';

  return (
    <PageBuilder
      pageAssetsData={pageAssetsData?.[camelize(ASSET_NAME)]?.data}
      inProgress={inProgress}
      error={error}
      options={{
        isDrawerOpen: isDrawerOpen,
        authStep: authStep,
        redirectRoute: redirectRoute,
        onManageToggleDrawer: onManageToggleDrawer,
        history: history,
        listings: listings,
        onLogout: onLogout,
        submitLogin: submitLogin,
        submitSignup: submitSignup,
        loginError: loginError,
        signupError: signupError,
        authInProgress: authInProgress,
      }}
      fallbackPage={<FallbackPage />}
      isLandingPage={true}
      isAuthenticated={isAuthenticated}
      isHeaderSticky={isHeaderSticky}
    />
  );
};

LandingPageComponent.propTypes = {
  pageAssetsData: object,
  inProgress: bool,
  error: propTypes.error,
  listings: [],
  history: object.isRequired,
  location: object.isRequired,
  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const { isDrawerOpen, authStep, redirectRoute } = state.ui;
  const { isAuthenticated, loginError, signupError } = state.auth;

  const { currentPageResultIds, landing_page_data_request,
    landing_page_data } = state.landingPageReducer;
  const pageListings = getListingsById(state, currentPageResultIds);
  const { pageAssetsData, inProgress, error } = state.hostedAssets || {};

  if (pageAssetsData?.[camelize(ASSET_NAME)]?.data?.sections) {
    let sectionsTemp = pageAssetsData?.[camelize(ASSET_NAME)]?.data?.sections;

    sectionsTemp.map(section => {
      if (section.sectionId === 'hero-landing') {
        section.additionalClass = css.landingHeroContainer;
        section.title.additionalClass = css.landingHeroTitle;
        section.description.additionalClass = css.landingHeroDescription;
        section.blocks.map(block => {
          block.additionalClass = css.landingHeroContent;
        });
      }
      if (section.sectionId === 'explore-lumela') {
        section.additionalClass = css.exploreHeadContainer;
        section.title.additionalClass = css.exploreTitle;
        section.description.additionalClass = css.exploreDescription;
        section.blocks.map(block => {
          block.additionalClass = css.exploreSliderBlock;
        });
      }
      if (section.sectionId === 'heard-about-this') {
        section.additionalClass = css.heardAboutContainer;
        section.blocks.map(block => {
          block.additionalClass = css.heardAboutContent;
        });
      }
      if (section.sectionId === 'business_section') {
        section.additionalClass = css.businessContainer;
      }
    });

    pageAssetsData[camelize(ASSET_NAME)].data.sections = sectionsTemp;
  }
  return {
    authInProgress: authenticationInProgress(state),
    pageAssetsData,
    inProgress,
    error,
    isDrawerOpen,
    authStep,
    redirectRoute,
    isAuthenticated,
    loginError,
    signupError,
    listings: pageListings,
    landing_page_data_request,
    landing_page_data,
  };
};

const mapDispatchToProps = dispatch => ({
  submitLogin: ({ email, password }) => dispatch(login(email, password)),
  submitSignup: params => dispatch(signup(params)),
  onLogout: historyPush => dispatch(logout(historyPush)),
  onManageToggleDrawer: (isDrawerOpen, authStep) =>
    dispatch(manageToggleDrawer(isDrawerOpen, authStep)),
});

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const LandingPagePage = compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl,
  withRouter,
  withViewport
)(LandingPageComponent);

const LANDING_PAGE_ASSET_NAME = ASSET_NAME;
export { LANDING_PAGE_ASSET_NAME, LandingPageComponent, LandingPageContent };

export default LandingPagePage;
