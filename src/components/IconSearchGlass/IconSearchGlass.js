import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const IconSearchGlass = props => {
  const { rootClassName, className, pencilClassName } = props;
  const classes = classNames(rootClassName, className);
  return (
    <svg
      className={classes}
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.7048 1.03687C6.0273 1.03687 2.24548 4.81869 2.24548 9.4962C2.24548 14.1737 6.0273 17.9555 10.7048 17.9555C15.3823 17.9555 19.1642 14.1737 19.1642 9.4962C19.1642 4.81869 15.3823 1.03687 10.7048 1.03687ZM10.7048 15.9651C7.12204 15.9651 4.23592 13.079 4.23592 9.4962C4.23592 5.91342 7.12204 3.0273 10.7048 3.0273C14.2876 3.0273 17.1737 5.91342 17.1737 9.4962C17.1737 13.079 14.2876 15.9651 10.7048 15.9651Z"
        fill="black"
      />
      <path
        d="M15.7804 15.0696L22.3986 21.6878"
        stroke="black"
        strokeWidth="4.52371"
        strokeMiterlimit="10"
      />
    </svg>
  );
};

IconSearchGlass.defaultProps = {
  rootClassName: null,
  className: null,
  pencilClassName: null,
};

const { string } = PropTypes;

IconSearchGlass.propTypes = {
  rootClassName: string,
  className: string,
  pencilClassName: string,
};

export default IconSearchGlass;
