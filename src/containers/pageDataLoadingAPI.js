/**
 * Export loadData calls from ducks modules of different containers
 */
 import { loadData as AuthenticationPageLoader } from './AuthenticationPage/AuthenticationPage.duck';
 import { loadData as LandingPageLoader } from './LandingPage/LandingPage.duck';
 import { loadData as BusinessLandingPageLoader } from './BusinessLandingPage/BusinessLandingPage.duck';
 import { loadData as AboutPagePageLoader } from './AboutPage/AboutPage.duck';
 import { setInitialValues as CheckoutPageInitialValues } from './CheckoutPage/CheckoutPage.duck';
 import { loadData as CMSPageLoader } from './CMSPage/CMSPage.duck';
 import { loadData as ContactDetailsPageLoader } from './ContactDetailsPage/ContactDetailsPage.duck';
 import { loadData as DashboardPageLoader } from './DashboardPage/DashboardPage.duck.js';
 import { loadData as EditListingPageLoader } from './EditListingPage/EditListingPage.duck';
 import { loadData as EmailVerificationPageLoader } from './EmailVerificationPage/EmailVerificationPage.duck';
 import { loadData as InboxPageLoader } from './InboxPage/InboxPage.duck';
 import { loadData as ListingPageLoader } from './ListingPage/ListingPage.duck';
 import { loadData as ManageListingsPageLoader } from './ManageListingsPage/ManageListingsPage.duck';
 import { loadData as ManageServiceListingsPageLoader} from'./ManageServiceListingsPage/ManageServiceListingsPage.duck'
 import { loadData as PaymentMethodsPageLoader } from './PaymentMethodsPage/PaymentMethodsPage.duck';
 import { loadData as ProfilePageLoader } from './ProfilePage/ProfilePage.duck';
 import { loadData as PrivacyPolicyPageLoader } from './PrivacyPolicyPage/PrivacyPolicyPage.duck';
 import { loadData as OrderPageLoader } from './OrderPage/OrderPage.duck.js';
 import { loadData as SearchPageLoader } from './SearchPage/SearchPage.duck';
 import { loadData as StripePayoutPageLoader } from './StripePayoutPage/StripePayoutPage.duck';
 import { loadData as TermsOfServicePageLoader } from './TermsOfServicePage/TermsOfServicePage.duck';
 import { loadData as ServiceListingPagePageLoader } from './ServiceListingPage/ServiceListingPage.duck';
 import { loadData as ProductListingPageLoader } from './ProductListingPage/ProductListingPage.duck';
 import {
   loadData as TransactionPageLoader,
   setInitialValues as TransactionPageInitialValues,
 } from './TransactionPage/TransactionPage.duck';
 
 const getPageDataLoadingAPI = () => {
   return {
     AuthenticationPage: {
       loadData: AuthenticationPageLoader,
     },
     LandingPage: {
       loadData: LandingPageLoader,
     },
     BusinessLandingPage: {
       loadData: BusinessLandingPageLoader,
     },
     AboutPage: {
       loadData: AboutPagePageLoader,
     },
     ServiceListingPage: {
      loadData: ServiceListingPagePageLoader,
    },
     CheckoutPage: {
       setInitialValues: CheckoutPageInitialValues,
     },
     CMSPage: {
       loadData: CMSPageLoader,
     },
     ContactDetailsPage: {
       loadData: ContactDetailsPageLoader,
     },
     EditListingPage: {
       loadData: EditListingPageLoader,
     },
     EmailVerificationPage: {
       loadData: EmailVerificationPageLoader,
     },
     InboxPage: {
       loadData: InboxPageLoader,
     },
     ListingPage: {
       loadData: ListingPageLoader,
     },
     DashboardPage: {
      loadData: DashboardPageLoader,
    },
    OrderPage: {
      loadData: OrderPageLoader,
    },
     ManageListingsPage: {
       loadData: ManageListingsPageLoader,
     },
     ManageServiceListingsPage: {
      loadData: ManageServiceListingsPageLoader,
    },
     PaymentMethodsPage: {
       loadData: PaymentMethodsPageLoader,
     },
     PrivacyPolicyPage: {
       loadData: PrivacyPolicyPageLoader,
     },
     ProfilePage: {
       loadData: ProfilePageLoader,
     },
     DashboardPage: {
       loadData: DashboardPageLoader,
     },
     OrderPage: {
       loadData: OrderPageLoader,
     },
     ProductListingPage: {
       loadData: ProductListingPageLoader,
     },

     SearchPage: {
       loadData: SearchPageLoader,
     },
     StripePayoutPage: {
       loadData: StripePayoutPageLoader,
     },
     TermsOfServicePage: {
       loadData: TermsOfServicePageLoader,
     },
     TransactionPage: {
       loadData: TransactionPageLoader,
       setInitialValues: TransactionPageInitialValues,
     },
   };
 };
 
 export default getPageDataLoadingAPI;
 