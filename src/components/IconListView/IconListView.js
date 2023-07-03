import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const IconListView = props => {
  const { rootClassName, className, pencilClassName } = props;
  const classes = classNames(rootClassName, className);
  return (
    <svg width="18" height="18" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1 5V21L8 17L16 21L23 17V1L16 5L8 1L1 5Z"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 1V17"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 5V21"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

IconListView.defaultProps = {
  rootClassName: null,
  className: null,
  pencilClassName: null,
};

const { string } = PropTypes;

IconListView.propTypes = {
  rootClassName: string,
  className: string,
  pencilClassName: string,
};

export default IconListView;
