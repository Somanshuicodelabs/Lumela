import React from 'react';
import { func, node, object, shape, string } from 'prop-types';
import classNames from 'classnames';

import Field from '../../Field';

import css from './SectionContainer.module.css';
// This component can be used to wrap some common styles and features of Section-level components.
// E.g: const SectionHero = props => (<SectionContainer><H1>Hello World!</H1></SectionContainer>);
const SectionContainer = props => {
  const { className, rootClassName, id, as, children, appearance, options, ...otherProps } = props;
  const Tag = as || 'section';
  const classes = classNames(
    rootClassName || css.root,
    className,
    id === 'hero-landing' ? css.landingHero : null,
    id === 'explore-lumela' ? css.exploreLumelaSection : null,
    id === 'heard-about-this' ? css.heardAboutSection : null,
    id === 'join-lumela-today' ? css.joinLumelaSection : null,
    id === 'business_section' ? css.businessSection : null,
    id === 'blog_section' ? css.businessSection : null
  );

  return (
    <>
      {id === 'heard-about-this' || id === 'join-lumela-today' ? (
        <Tag className={classes} id={id} {...otherProps}>
          <div className={css.fixedWidthContainer}>
            {appearance?.fieldType === 'customAppearance' ? (
              <Field
                data={{ alt: `Background image for ${id}`, ...appearance }}
                className={className}
                options={options}
                landingHero={id === 'hero-landing' ? true : false}
              />
            ) : null}
            <div className={css.sectionContent}>{children}</div>
          </div>
        </Tag>
      ) : (
        <Tag className={classes} id={id} {...otherProps}>
          {appearance?.fieldType === 'customAppearance' ? (
            <Field
              data={{ alt: `Background image for ${id}`, ...appearance }}
              className={className}
              options={options}
              landingHero={id === 'hero-landing' ? true : false}
            />
          ) : null}
          <div className={css.sectionContent}>{children}</div>
        </Tag>
      )}
    </>
  );
};

const propTypeOption = shape({
  fieldComponents: shape({ component: node, pickValidProps: func }),
});

SectionContainer.defaultProps = {
  rootClassName: null,
  className: null,
  as: 'div',
  children: null,
  appearance: null,
};

SectionContainer.propTypes = {
  rootClassName: string,
  className: string,
  as: string,
  children: node,
  appearance: object,
  options: propTypeOption,
};

export default SectionContainer;
