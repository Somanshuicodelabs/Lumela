import React from 'react';
import { bool, object } from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { camelize } from '../../util/string';
import { propTypes } from '../../util/types';
import { intlShape } from '../../util/reactIntl';

import { H1 } from '../PageBuilder/Primitives/Heading';
import PageBuilder, { SectionBuilder } from '../PageBuilder/PageBuilder';

import FallbackPage, { fallbackSections } from './FallbackPage';
import { ASSET_NAME } from './BusinessLandingPage.duck';
import { manageToggleDrawer } from '../../ducks/ui.duck';
import { login, logout, signup } from '../../ducks/auth.duck';

// This "content-only" component can be used in modals etc.
const BusinessLandingContent = props => {
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
  const CustomHeading1 = props => <H1 as="h2" {...props}  />;

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
const BusinessLandingPageComponent = props => {
  const { pageAssetsData,
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
    isAuthenticated,} = props;
    console.log(submitLogin,"props1");
    
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
      isAuthenticated={isAuthenticated}
      
      fallbackPage={<FallbackPage />}
    />
  );
};

BusinessLandingPageComponent.propTypes = {
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
  const { pageAssetsData, inProgress, error } = state.hostedAssets || {};
  // console.log(isDrawerOpen, authStep, redirectRoute,"isDrawerOpen, authStep, redirectRoute");
  return { pageAssetsData, inProgress, error, isDrawerOpen, authStep, redirectRoute, loginError , isAuthenticated, signupError};
};

const mapDispatchToProps = dispatch => ({
  submitLogin: ({ email, password }) => dispatch(login(email, password)),
  submitSignup: params => dispatch(signup(params)),
  onLogout: historyPush => dispatch(logout(historyPush)),
  onManageToggleDrawer: (isDrawerOpen, authStep) => dispatch(manageToggleDrawer(isDrawerOpen, authStep)),
});

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const BusinessLandingPage = compose(connect(mapStateToProps, mapDispatchToProps))(BusinessLandingPageComponent);

const BUSINESS_LANDING_ASSET_NAME = ASSET_NAME;
export { BUSINESS_LANDING_ASSET_NAME, BusinessLandingPageComponent, BusinessLandingContent };

export default BusinessLandingPage;
