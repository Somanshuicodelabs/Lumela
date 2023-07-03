import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const IconLocationPin = props => {
  const { rootClassName, className, pencilClassName } = props;
  const classes = classNames(rootClassName, className);
  return (
    <svg width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.51893 0.5C2.92437 0.5 0 3.42437 0 7.01889C0 11.4798 5.8338 18.0287 6.08218 18.3053C6.31548 18.5651 6.7228 18.5647 6.95567 18.3053C7.20405 18.0287 13.0379 11.4798 13.0379 7.01889C13.0378 3.42437 10.1134 0.5 6.51893 0.5ZM6.51893 10.2987C4.71042 10.2987 3.23912 8.8274 3.23912 7.01889C3.23912 5.21038 4.71045 3.73909 6.51893 3.73909C8.3274 3.73909 9.79869 5.21042 9.79869 7.01893C9.79869 8.82744 8.3274 10.2987 6.51893 10.2987Z"
        fill="#6B6B6B"
      />
    </svg>
  );
};

IconLocationPin.defaultProps = {
  rootClassName: null,
  className: null,
  pencilClassName: null,
};

const { string } = PropTypes;

IconLocationPin.propTypes = {
  rootClassName: string,
  className: string,
  pencilClassName: string,
};

export default IconLocationPin;
