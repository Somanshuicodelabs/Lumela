import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const IconProfile = props => {
  const { rootClassName, className, pencilClassName } = props;
  const classes = classNames(rootClassName , className);
  return (
    <svg
      className={classes}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.7508 6.75136C12.7508 8.82227 11.0721 10.501 9.00136 10.501C6.93067 10.501 5.25195 8.82227 5.25195 6.75136C5.25195 4.68067 6.93067 3.00195 9.00136 3.00195C11.0721 3.00195 12.7508 4.68067 12.7508 6.75136Z"
        fill="#595858"
      />
      <path
        d="M9 18C13.9655 18 18 13.9657 18 9C18 4.03433 13.9657 0 9 0C4.03433 0 0 4.03433 0 9C0 13.9657 4.03433 18 9 18ZM9 1.50118C13.131 1.50118 16.4988 4.86903 16.4988 9C16.4988 10.7603 15.8832 12.3883 14.8555 13.6703C14.5655 12.3426 13.8279 11.1825 12.8154 10.3483C11.8641 11.3607 10.5007 11.9965 8.99978 11.9965C7.49887 11.9965 6.13549 11.3605 5.18414 10.3483C4.17169 11.1828 3.4392 12.3426 3.14409 13.6703C2.11648 12.3883 1.50074 10.7603 1.50074 9C1.50074 4.86903 4.86881 1.50118 8.99957 1.50118H9Z"
        fill="#595858"
      />
    </svg>
  );
};

IconProfile.defaultProps = {
  rootClassName: null,
  className: null,
  pencilClassName: null,
};

const { string } = PropTypes;

IconProfile.propTypes = {
  rootClassName: string,
  className: string,
  pencilClassName: string,
};

export default IconProfile;
