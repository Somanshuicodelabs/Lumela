import React from 'react';
import { string } from 'prop-types';
import classNames from 'classnames';

import { useConfiguration } from '../../context/configurationContext';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { twitterPageURL } from '../../util/urlHelpers';
import {
  IconSocialMediaFacebook,
  IconSocialMediaInstagram,
  IconSocialMediaTwitter,
  Logo,
  ExternalLink,
  NamedLink,
} from '../../components';

import css from './Footer.module.css';
import IconCollection from '../IconCollection/IconCollection';

const renderSocialMediaLinks = (intl, config) => {
  const { siteFacebookPage, siteInstagramPage, siteTwitterHandle } = config;
  const siteTwitterPage = twitterPageURL(siteTwitterHandle);

  const goToFb = intl.formatMessage({ id: 'Footer.goToFacebook' });
  const goToInsta = intl.formatMessage({ id: 'Footer.goToInstagram' });
  const goToTwitter = intl.formatMessage({ id: 'Footer.goToTwitter' });

  const fbLink = siteFacebookPage ? (
    <ExternalLink key="linkToFacebook" href={siteFacebookPage} className={css.icon} title={goToFb}>
      <IconSocialMediaFacebook />
    </ExternalLink>
  ) : null;

  const twitterLink = siteTwitterPage ? (
    <ExternalLink
      key="linkToTwitter"
      href={siteTwitterPage}
      className={css.icon}
      title={goToTwitter}
    >
      <IconSocialMediaTwitter />
    </ExternalLink>
  ) : null;

  const instragramLink = siteInstagramPage ? (
    <ExternalLink
      key="linkToInstagram"
      href={siteInstagramPage}
      className={css.icon}
      title={goToInsta}
    >
      <IconSocialMediaInstagram />
    </ExternalLink>
  ) : null;
  return [fbLink, twitterLink, instragramLink].filter(v => v != null);
};

const Footer = props => {
  const config = useConfiguration();
  const { rootClassName, className, intl } = props;
  const socialMediaLinks = renderSocialMediaLinks(intl, config);
  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
      <div className={css.fixedWidthContainer}>
        <div className={css.footerContentWrapper}>
          <div className={css.footerContent}>
            <div className={css.footerLinks}>
              <div className={css.links}>
                <NamedLink className={css.logoLink} name="BusinessLandingPage">
                  <IconCollection name="FOOTER_LOGO" />
                </NamedLink>
                <div className={css.otherLinks}>
                  <NamedLink name="AboutPage" className={css.link}>
                    <FormattedMessage id="Footer.toAboutPage" />
                  </NamedLink>
                  <NamedLink name="BusinessLandingPage" className={css.link}>
                    <FormattedMessage id="Footer.toFAQPage" />
                  </NamedLink>
                  <NamedLink name="AboutPage" className={css.link}>
                    <FormattedMessage id="Footer.toBlogPage" />
                  </NamedLink>
                  <NamedLink name="BusinessLandingPage" className={css.link}>
                    <FormattedMessage id="Footer.termsOfUse" />
                  </NamedLink>
                  <NamedLink name="BusinessLandingPage" className={css.link}>
                    <FormattedMessage id="Footer.privacyPolicy" />
                  </NamedLink>
                  <NamedLink name="BusinessLandingPage" className={css.link}>
                    <FormattedMessage id="Footer.toNearmePage" />
                  </NamedLink>
                  <NamedLink name="AboutPage" to={{ hash: '#contact' }} className={css.link}>
                    <FormattedMessage id="Footer.toContactPage" />
                  </NamedLink>
                </div>
              </div>
              <span className={css.border}>&nbsp;</span>
            </div>
            <div className={css.footerLinks}>
              <p>
                <FormattedMessage id="Footer.contactUs" />
              </p>
              <div className={css.socialLinks}>
                <div className={css.socialMediaLinks}>{socialMediaLinks}</div>
                <NamedLink className={css.logoLink} name="BusinessLandingPage">
                  <IconCollection name="FOOTER_LOGO" />
                </NamedLink>{' '}
                <NamedLink name="BusinessLandingPage" className={css.copyrightLink}>
                  <FormattedMessage id="Footer.copyright" />
                </NamedLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className={css.topBorderWrapper}>
        <div className={css.content}>
          <div className={css.someLiksMobile}>{socialMediaLinks}</div>

          <div className={css.searches}>
            <ul className={css.list}>
              <li className={css.listItem}>
                <NamedLink
                  name="SearchPage"
                  to={{
                    search:
                      '?address=New%20York%20City%2C%20New%20York%2C%20USA&bounds=40.917576401307%2C-73.7008392055224%2C40.477399%2C-74.2590879797556',
                  }}
                  className={css.link}
                >
                  <FormattedMessage id="Footer.searchNewYork" />
                </NamedLink>
              </li>
              <li className={css.listItem}>
                <NamedLink
                  name="SearchPage"
                  to={{
                    search:
                      '?address=Los%20Angeles%2C%20California%2C%20USA&bounds=34.161440999758%2C-118.121305008073%2C33.9018913203336%2C-118.521456965901',
                  }}
                  className={css.link}
                >
                  <FormattedMessage id="Footer.searchLosAngeles" />
                </NamedLink>
              </li>
              <li className={css.listItem}>
                <NamedLink
                  name="SearchPage"
                  to={{
                    search:
                      '?address=San%20Francisco%2C%20California%2C%20USA&bounds=37.8324430069081%2C-122.354995082683%2C37.6044780500533%2C-122.517910874663',
                  }}
                  className={css.link}
                >
                  <FormattedMessage id="Footer.searchSanFrancisco" />
                </NamedLink>
              </li>
              <li className={css.listItem}>
                <NamedLink
                  name="SearchPage"
                  to={{
                    search:
                      '?address=Seattle%2C%20Washington%2C%20USA&bounds=47.7779392908564%2C-122.216605992108%2C47.3403950185547%2C-122.441233019046',
                  }}
                  className={css.link}
                >
                  <FormattedMessage id="Footer.searchSeattle" />
                </NamedLink>
              </li>
              <li className={css.listItem}>
                <NamedLink
                  name="SearchPage"
                  to={{
                    search:
                      '?address=Portland%2C%20Oregon%2C%20USA&bounds=45.858099013046%2C-122.441059986416%2C45.3794799927623%2C-122.929215816001',
                  }}
                  className={css.link}
                >
                  <FormattedMessage id="Footer.searchPortland" />
                </NamedLink>
              </li>
            </ul>
          </div>
          <div className={css.searchesExtra}>
            <ul className={css.list}>
              <li className={css.listItem}>
                <NamedLink
                  name="SearchPage"
                  to={{
                    search:
                      '?address=Denver%2C%20Colorado%2C%20United%20States%20of%20America&bounds=39.94623402%2C-104.600299056%2C39.62371698%2C-105.193616003506',
                  }}
                  className={css.link}
                >
                  <FormattedMessage id="Footer.searchDenver" />
                </NamedLink>
              </li>
              <li className={css.listItem}>
                <NamedLink
                  name="SearchPage"
                  to={{
                    search:
                      '?address=Philadelphia%2C%20Pennsylvania%2C%20United%20States%20of%20America&bounds=40.1379937851305%2C-74.9557749984862%2C39.8557310196928%2C-75.2946589071447',
                  }}
                  className={css.link}
                >
                  <FormattedMessage id="Footer.searchPhiladelphia" />
                </NamedLink>
              </li>
              <li className={css.listItem}>
                <NamedLink
                  name="SearchPage"
                  to={{
                    search:
                      '?address=Boston%2C%20Massachusetts%2C%20United%20States%20of%20America&bounds=42.3974009328397%2C-70.9860500028801%2C42.3196059806256%2C-71.1255750165112',
                  }}
                  className={css.link}
                >
                  <FormattedMessage id="Footer.searchBoston" />
                </NamedLink>
              </li>
              <li className={css.listItem}>
                <NamedLink
                  name="SearchPage"
                  to={{
                    search:
                      '?address=San%20Diego%2C%20California%2C%20United%20States%20of%20America&bounds=33.0722089336828%2C-116.853118984%2C32.534171982%2C-117.266223298428',
                  }}
                  className={css.link}
                >
                  <FormattedMessage id="Footer.searchSanDiego" />
                </NamedLink>
              </li>
              <li className={css.listItem}>
                <NamedLink
                  name="SearchPage"
                  to={{
                    search:
                      '?address=Boulder%2C%20Colorado%2C%20United%20States%20of%20America&bounds=40.1593785009969%2C-105.108872052936%2C39.9139839802231%2C-105.525489934809',
                  }}
                  className={css.link}
                >
                  <FormattedMessage id="Footer.searchBoulder" />
                </NamedLink>
              </li>
            </ul>
          </div>
          <div className={css.infoLinks}>
            <ul className={css.list}>
              <li className={css.listItem}>
                <NamedLink name="NewListingPage" className={css.link}>
                  <FormattedMessage id="Footer.toNewListingPage" />
                </NamedLink>
              </li>
              <li className={css.listItem}>
                <NamedLink name="AboutPage" className={css.link}>
                  <FormattedMessage id="Footer.toAboutPage" />
                </NamedLink>
              </li>
              <li className={css.listItem}>
                <NamedLink name="LandingPage" className={css.link}>
                  <FormattedMessage id="Footer.toFAQPage" />
                </NamedLink>
              </li>
              <li className={css.listItem}>
                <NamedLink name="LandingPage" className={css.link}>
                  <FormattedMessage id="Footer.toHelpPage" />
                </NamedLink>
              </li>
              <li className={css.listItem}>
                <NamedLink name="AboutPage" to={{ hash: '#contact' }} className={css.link}>
                  <FormattedMessage id="Footer.toContactPage" />
                </NamedLink>
              </li>
              <li className={css.listItem}>
                <NamedLink name="TermsOfServicePage" className={css.link}>
                  <FormattedMessage id="Footer.termsOfUse" />
                </NamedLink>
              </li>
              <li className={css.listItem}>
                <NamedLink name="PrivacyPolicyPage" className={css.link}>
                  <FormattedMessage id="Footer.privacyPolicy" />
                </NamedLink>
              </li>
            </ul>
          </div>

          <div className={css.extraLinks}>
            <div className={css.links}>
              <div className={css.organization} id="organization">
                <NamedLink name="LandingPage" className={css.logoLink}>
                  <span className={css.logo}>
                    <Logo format="desktop" />
                  </span>
                </NamedLink>
                <div className={css.organizationInfo}>
                  <p className={css.organizationDescription}>
                    <FormattedMessage id="Footer.organizationDescription" />
                  </p> 
                  <p className={css.organizationCopyright}>
                    <NamedLink name="LandingPage" className={css.copyrightLink}>
                      <FormattedMessage id="Footer.copyright" />
                    </NamedLink>
                  </p>
                </div>
              </div>
            </div>
            <div className={css.socialMediaLinks}>
              <p className={css.connectWithUs}>Connect with us</p>
              <div className={css.someLinks}>{socialMediaLinks}</div>
            </div>
          </div>

          <div className={css.copyrightAndTermsMobile}>
            <NamedLink name="LandingPage" className={css.organizationCopyrightMobile}>
              <FormattedMessage id="Footer.copyright" />
            </NamedLink>
            <div className={css.tosAndPrivacyMobile}>
              <NamedLink name="PrivacyPolicyPage" className={css.privacy}>
                <FormattedMessage id="Footer.privacy" />
              </NamedLink>
              <NamedLink name="TermsOfServicePage" className={css.terms}>
                <FormattedMessage id="Footer.terms" />
              </NamedLink>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

Footer.defaultProps = {
  rootClassName: null,
  className: null,
};

Footer.propTypes = {
  rootClassName: string,
  className: string,
  intl: intlShape.isRequired,
};

export default injectIntl(Footer);
