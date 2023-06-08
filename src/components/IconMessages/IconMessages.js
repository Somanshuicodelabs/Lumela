import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const IconMessages = props => {
  const { rootClassName, className, pencilClassName } = props;
  const classes = classNames(rootClassName , className);
  return (
    <svg
      className={classes}
      width="24"
      height="18"
      viewBox="0 0 24 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23.25 2.25C23.25 1.0125 22.2375 0 21 0H3C1.7625 0 0.75 1.0125 0.75 2.25V15.75C0.75 16.9875 1.7625 18 3 18H21C22.2375 18 23.25 16.9875 23.25 15.75V2.25ZM21 2.25L12 7.875L3 2.25H21ZM21 15.75H3V4.5L12 10.125L21 4.5V15.75Z"
        fill="#595858"
      />
    </svg>
  );
};

IconMessages.defaultProps = {
  rootClassName: null,
  className: null,
  pencilClassName: null,
};

const { string } = PropTypes;

IconMessages.propTypes = {
  rootClassName: string,
  className: string,
  pencilClassName: string,
};

export default IconMessages;
