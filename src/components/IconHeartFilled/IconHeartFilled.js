import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const IconHeartFilled = props => {
  const { rootClassName, className, pencilClassName } = props;
  const classes = classNames(rootClassName, className);
  return (
    <svg
      className={classes}
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.5001 19.1008C10.363 19.1017 10.2271 19.0743 10.1002 19.0203C9.97327 18.9663 9.85784 18.8867 9.76051 18.7862L1.66676 10.3451C0.651509 9.27661 0.0820313 7.83402 0.0820312 6.33072C0.0820313 4.82742 0.651509 3.38484 1.66676 2.31633C2.68995 1.25361 4.07596 0.656837 5.52092 0.656837C6.96589 0.656837 8.3519 1.25361 9.37509 2.31633L10.5001 3.4881L11.6251 2.31633C12.6483 1.25361 14.0343 0.656837 15.4793 0.656837C16.9242 0.656837 18.3102 1.25361 19.3334 2.31633C20.3487 3.38484 20.9181 4.82742 20.9181 6.33072C20.9181 7.83402 20.3487 9.27661 19.3334 10.3451L11.2397 18.7862C11.1423 18.8867 11.0269 18.9663 10.9 19.0203C10.7731 19.0743 10.6372 19.1017 10.5001 19.1008Z"
        fill="#6B6B6B"
      />
    </svg>
  );
};

IconHeartFilled.defaultProps = {
  rootClassName: null,
  className: null,
  pencilClassName: null,
};

const { string } = PropTypes;

IconHeartFilled.propTypes = {
  rootClassName: string,
  className: string,
  pencilClassName: string,
};

export default IconHeartFilled;
