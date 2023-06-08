import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const IconDashboard = props => {
  const { rootClassName, className, pencilClassName } = props;
  const classes = classNames(rootClassName , className);
  return (
    <svg
      className={classes}
      width="20"
      height="18"
      viewBox="0 0 20 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.8483 10.125H10.6399L16.1065 15.6808C16.3154 15.8931 16.6593 15.9103 16.8741 15.7047C18.2128 14.4229 19.1337 12.6949 19.4038 10.7525C19.4502 10.4199 19.1786 10.125 18.8483 10.125ZM18.3007 7.84683C18.0156 3.64701 14.7135 0.290962 10.5811 0.00127127C10.2656 -0.0208774 9.99996 0.249477 9.99996 0.570809V8.43746H17.7406C18.0568 8.43746 18.3225 8.16745 18.3007 7.84683ZM8.33953 10.125V1.78266C8.33953 1.44691 8.04931 1.17093 7.72241 1.21804C3.60007 1.81008 0.449068 5.47024 0.595739 9.85673C0.746561 14.3617 4.56311 18.056 8.99782 17.9994C10.7413 17.9772 12.3522 17.4063 13.6768 16.4514C13.95 16.2545 13.968 15.8457 13.7311 15.6048L8.33953 10.125Z"
        fill="#595858"
      />
    </svg>
  );
};

IconDashboard.defaultProps = {
  rootClassName: null,
  className: null,
  pencilClassName: null,
};

const { string } = PropTypes;

IconDashboard.propTypes = {
  rootClassName: string,
  className: string,
  pencilClassName: string,
};

export default IconDashboard;
