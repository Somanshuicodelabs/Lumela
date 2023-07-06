import React from 'react';
import { arrayOf, bool, func, node, object, shape, string } from 'prop-types';
import classNames from 'classnames';

import Field, { hasDataInFields } from '../../Field';
import BlockBuilder from '../../BlockBuilder';

import SectionContainer from '../SectionContainer';
import css from './SectionArticle.module.css';
import TopbarSearchForm from '../../../../components/Topbar/TopbarSearchForm/TopbarSearchForm';
import { parse } from '../../../../util/urlHelpers'
import {
  isAnyFilterActive,
  isMainSearchTypeKeywords,
  isOriginInUse,
  getQueryParamNames,
} from '../../../../util/search';
import { cloneDeep } from 'lodash';

// Section component that's able to show article content
// The article content is mainly supposed to be inside a block
const SectionArticle = props => {
  const {
    sectionId,
    className,

    rootClassName,
    defaultClasses,
    title,
    description,
    appearance,
    callToAction,
    blocks,
    isInsideContainer,
    options,
    config,

  } = props;

  // If external mapping has been included for fields
  // E.g. { h1: { component: MyAwesomeHeader } }
  const fieldComponents = options?.fieldComponents;
  const fieldOptions = { fieldComponents };

  const hasHeaderFields = hasDataInFields([title, description, callToAction], fieldOptions);
  const hasBlocks = blocks?.length > 0;

  const handleSubmit = (values) => {
    const { currentSearchParams } = this.props;
    const { history, config, routeConfiguration } = this.props;

    const topbarSearchParams = () => {
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
  const handleSubmit1 = (values) => {
    const { currentSearchParams } = this.props;
    const { history, config, routeConfiguration } = this.props;

    const topbarSearchParams = () => {
      if (isMainSearchTypeKeywords(config)) {
        return { keywords: values?.keywords };
      }



      // topbar search defaults to 'location' search



    };
    const searchParams = {
      ...currentSearchParams,
      ...topbarSearchParams(),
    };
    history.push(createResourceLocatorString('SearchPage', routeConfiguration, {}, searchParams));
  }
  const topbarSearcInitialValues = () => {

    const { mobilemenu, mobilesearch, keywords, address, origin, bounds } = parse(location.search, {
      latlng: ['origin'],
      latlngBounds: ['bounds'],
    });

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

  return (
    <SectionContainer
      id={sectionId}
      className={className}
      rootClassName={rootClassName}
      appearance={appearance}
      options={fieldOptions}
    >
      {hasHeaderFields ? (
        <header className={classNames(defaultClasses.sectionDetails, props?.additionalClass)}>
          <Field
            data={title}
            className={classNames(defaultClasses.title, props?.title?.additionalClass)}
            options={fieldOptions}
          />
          <Field
            data={description}
            className={classNames(defaultClasses.description, props?.description?.additionalClass)}
            options={fieldOptions}
          />
          <Field data={callToAction} className={defaultClasses.ctaButton} options={fieldOptions} />
        </header>
      ) : null}
      {hasBlocks ? (
        <div
          className={classNames(
            defaultClasses.blockContainer,
            css.articleMain,
            props?.additionalClass,
            {
              [css.noSidePaddings]: isInsideContainer,
            }
          )}
        >
          <BlockBuilder
            blocks={blocks}
            id={sectionId}
            ctaButtonClass={defaultClasses.ctaButton}
            options={options}
          />
          {sectionId == 'hero-landing' &&
            <TopbarSearchForm
              isKeywordsSearch
              className={css.searchLink}
              desktopInputRoot={css.topbarSearchWithLeftPadding}
              onSubmit={handleSubmit1}
              initialValues={initialSearchFormValues}
            />
          }
        </div>
      ) : null}
    </SectionContainer>
  );
};

const propTypeOption = shape({
  fieldComponents: shape({ component: node, pickValidProps: func }),
});

SectionArticle.defaultProps = {
  className: null,
  rootClassName: null,
  defaultClasses: null,
  textClassName: null,
  title: null,
  description: null,
  appearance: null,
  callToAction: null,
  blocks: [],
  isInsideContainer: false,
  options: null,
};

SectionArticle.propTypes = {
  sectionId: string.isRequired,
  className: string,
  rootClassName: string,
  defaultClasses: shape({
    sectionDetails: string,
    title: string,
    description: string,
    ctaButton: string,
  }),
  title: object,
  description: object,
  appearance: object,
  callToAction: object,
  blocks: arrayOf(object),
  isInsideContainer: bool,
  options: propTypeOption,
};

export default SectionArticle;
