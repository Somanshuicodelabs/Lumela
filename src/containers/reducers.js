/**
 * Export reducers from ducks modules of different containers (i.e. default export)
 * We are following Ducks module proposition:
 * https://github.com/erikras/ducks-modular-redux
*/
import CheckoutPage from './CheckoutPage/CheckoutPage.duck';
import ContactDetailsPage from './ContactDetailsPage/ContactDetailsPage.duck';
// import DashboardPage from './DashboardPage/DashboardPage.duck';
import EditListingPage from './EditListingPage/EditListingPage.duck';
import InboxPage from './InboxPage/InboxPage.duck';
import ListingPage from './ListingPage/ListingPage.duck';
import ManageListingsPage from './ManageListingsPage/ManageListingsPage.duck';
import PasswordChangePage from './PasswordChangePage/PasswordChangePage.duck';
import PasswordRecoveryPage from './PasswordRecoveryPage/PasswordRecoveryPage.duck';
import PasswordResetPage from './PasswordResetPage/PasswordResetPage.duck';
import PaymentMethodsPage from './PaymentMethodsPage/PaymentMethodsPage.duck';
import ProfilePage from './ProfilePage/ProfilePage.duck';
import ProfileSettingsPage from './ProfileSettingsPage/ProfileSettingsPage.duck';
// import OrderPage from './OrderPage/OrderPage.duck.js';
import SearchPage from './SearchPage/SearchPage.duck';
import StripePayoutPage from './StripePayoutPage/StripePayoutPage.duck';
import TransactionPage from './TransactionPage/TransactionPage.duck';
import landingPageReducer from './LandingPage/LandingPage.duck';
import ServiceListingPage from './ServiceListingPage/ServiceListingPage.duck';
import ManageServiceListingsPage from './ManageServiceListingsPage/ManageServiceListingsPage.duck';

export {
  CheckoutPage,
  ContactDetailsPage,
  // DashboardPage,
  EditListingPage,
  InboxPage,
  ListingPage,
  ManageListingsPage,
  PasswordChangePage,
  PasswordRecoveryPage,
  PasswordResetPage,
  PaymentMethodsPage,
  ProfilePage,
  ProfileSettingsPage,
  // OrderPage,
  SearchPage,
  StripePayoutPage,
  TransactionPage,
  landingPageReducer,
  ServiceListingPage,
  ManageServiceListingsPage
};
