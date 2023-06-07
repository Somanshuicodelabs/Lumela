import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const IconPaymentMethod = props => {
  const { rootClassName, className, pencilClassName } = props;
  const classes = classNames(rootClassName, className);
  return (
    <svg
      className={classes}
      width="21"
      height="18"
      viewBox="0 0 21 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.25 17.4463H3.75C2.85489 17.4463 1.99645 17.144 1.36351 16.6057C0.730579 16.0675 0.375 15.3375 0.375 14.5763V3.09592C0.375 2.33472 0.730579 1.6047 1.36351 1.06646C1.99645 0.528213 2.85489 0.22583 3.75 0.22583H17.25C18.1451 0.22583 19.0036 0.528213 19.6365 1.06646C20.2694 1.6047 20.625 2.33472 20.625 3.09592V14.5763C20.625 15.3375 20.2694 16.0675 19.6365 16.6057C19.0036 17.144 18.1451 17.4463 17.25 17.4463ZM3.75 2.13922C3.45163 2.13922 3.16548 2.24002 2.9545 2.41943C2.74353 2.59885 2.625 2.84219 2.625 3.09592V14.5763C2.625 14.83 2.74353 15.0733 2.9545 15.2527C3.16548 15.4322 3.45163 15.533 3.75 15.533H17.25C17.5484 15.533 17.8345 15.4322 18.0455 15.2527C18.2565 15.0733 18.375 14.83 18.375 14.5763V3.09592C18.375 2.84219 18.2565 2.59885 18.0455 2.41943C17.8345 2.24002 17.5484 2.13922 17.25 2.13922H3.75Z"
        fill="#6B6B6B"
      />
      <path d="M10.5 5.966H15V15.533H10.5V5.966Z" fill="#6B6B6B" />
    </svg>
  );
};

IconPaymentMethod.defaultProps = {
  rootClassName: null,
  className: null,
  pencilClassName: null,
};

const { string } = PropTypes;

IconPaymentMethod.propTypes = {
  rootClassName: string,
  className: string,
  pencilClassName: string,
};

export default IconPaymentMethod;
