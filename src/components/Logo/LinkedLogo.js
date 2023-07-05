import React from 'react';
import { oneOf, string } from 'prop-types';
import classNames from 'classnames';

import { NamedLink, Logo } from '../../components';

import css from './LinkedLogo.module.css';

const LinkedLogo = props => {
  const { className, rootClassName, format, alt, ...rest } = props;
  const classes = classNames(rootClassName || css.root, className);
  return (
    null
  );
};

LinkedLogo.defaultProps = {
  className: null,
  rootClassName: null,
  format: 'desktop',
};

LinkedLogo.propTypes = {
  className: string,
  rootClassName: string,
  format: oneOf(['desktop', 'mobile']),
};

export default LinkedLogo;
