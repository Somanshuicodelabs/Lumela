import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const IconCamera = props => {
  const { rootClassName, className, pencilClassName } = props;
  const classes = classNames(rootClassName , className);
  return (
    <svg
      className={classes}
      width="56"
      height="48"
      viewBox="0 0 56 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M28.0016 34.6666C32.6408 34.6666 36.4016 31.0849 36.4016 26.6666C36.4016 22.2483 32.6408 18.6666 28.0016 18.6666C23.3624 18.6666 19.6016 22.2483 19.6016 26.6666C19.6016 31.0849 23.3624 34.6666 28.0016 34.6666Z"
        fill="#595858"
      />
      <path
        d="M50.4 5.33333H41.524L38.052 1.73333C37.5302 1.18772 36.8946 0.751753 36.1859 0.453297C35.4772 0.154841 34.7109 0.000454052 33.936 0H22.064C20.496 0 18.984 0.64 17.92 1.73333L14.476 5.33333H5.6C2.52 5.33333 0 7.73333 0 10.6667V42.6667C0 45.6 2.52 48 5.6 48H50.4C53.48 48 56 45.6 56 42.6667V10.6667C56 7.73333 53.48 5.33333 50.4 5.33333ZM28 40C20.272 40 14 34.0267 14 26.6667C14 19.3067 20.272 13.3333 28 13.3333C35.728 13.3333 42 19.3067 42 26.6667C42 34.0267 35.728 40 28 40Z"
        fill="#595858"
      />
    </svg>
  );
};

IconCamera.defaultProps = {
  rootClassName: null,
  className: null,
  pencilClassName: null,
};

const { string } = PropTypes;

IconCamera.propTypes = {
  rootClassName: string,
  className: string,
  pencilClassName: string,
};

export default IconCamera;
