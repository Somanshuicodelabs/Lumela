import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const IconLogOff = props => {
  const { rootClassName, className, pencilClassName } = props;
  const classes = classNames(rootClassName, className);
  return (
    <svg
      className={classes}
      width="18"
      height="17"
      viewBox="0 0 18 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.04547 2.19589C3.31242 2.19589 3.56843 2.08985 3.75719 1.90108C3.94595 1.71232 4.052 1.45631 4.052 1.18936C4.052 0.922412 3.94595 0.666398 3.75719 0.477637C3.56843 0.288876 3.31242 0.182831 3.04547 0.182831H1.03241C0.76546 0.182831 0.509446 0.288876 0.320685 0.477637C0.131924 0.666398 0.0258789 0.922412 0.0258789 1.18936V15.2808C0.0258789 15.5477 0.131924 15.8037 0.320685 15.9925C0.509446 16.1813 0.76546 16.2873 1.03241 16.2873H3.04547C3.31242 16.2873 3.56843 16.1813 3.75719 15.9925C3.94595 15.8037 4.052 15.5477 4.052 15.2808C4.052 15.0138 3.94595 14.7578 3.75719 14.5691C3.56843 14.3803 3.31242 14.2742 3.04547 14.2742H2.03894V2.19589H3.04547Z"
        fill="#6B6B6B"
      />
      <path
        d="M16.9558 7.65128L14.1174 3.62516C13.9634 3.40816 13.7298 3.26094 13.4677 3.21567C13.2055 3.1704 12.9361 3.23077 12.7183 3.38359C12.6094 3.45987 12.5168 3.55696 12.4456 3.66925C12.3745 3.78154 12.3263 3.9068 12.3038 4.03782C12.2814 4.16883 12.2851 4.303 12.3148 4.43257C12.3444 4.56214 12.3995 4.68455 12.4767 4.79273L14.2079 7.22853H14.1174H6.06512C5.79818 7.22853 5.54216 7.33458 5.3534 7.52334C5.16464 7.7121 5.05859 7.96811 5.05859 8.23506C5.05859 8.50201 5.16464 8.75803 5.3534 8.94679C5.54216 9.13555 5.79818 9.24159 6.06512 9.24159H14.1174L12.3056 11.6573C12.2263 11.763 12.1686 11.8833 12.1358 12.0114C12.103 12.1394 12.0957 12.2727 12.1144 12.4035C12.1331 12.5344 12.1774 12.6603 12.2447 12.774C12.3121 12.8877 12.4012 12.9871 12.5069 13.0664C12.6811 13.1971 12.893 13.2677 13.1108 13.2677C13.2671 13.2677 13.4212 13.2313 13.561 13.1614C13.7007 13.0916 13.8223 12.9901 13.9161 12.8651L16.9356 8.83898C17.0646 8.66874 17.136 8.46192 17.1396 8.24841C17.1432 8.03491 17.0788 7.82578 16.9558 7.65128Z"
        fill="#6B6B6B"
      />
    </svg>
  );
};

IconLogOff.defaultProps = {
  rootClassName: null,
  className: null,
  pencilClassName: null,
};

const { string } = PropTypes;

IconLogOff.propTypes = {
  rootClassName: string,
  className: string,
  pencilClassName: string,
};

export default IconLogOff;
