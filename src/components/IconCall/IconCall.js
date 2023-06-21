import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const IconCall = props => {
  const { rootClassName, className, pencilClassName } = props;
  const classes = classNames(rootClassName , className);
  return (
    <svg
      className={classes}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.4914 0.672938L10.6477 0.0167016C10.3387 -0.0543907 10.0216 0.106934 9.89578 0.396772L8.5833 3.45921C8.46846 3.72717 8.54502 4.04162 8.77197 4.22482L10.429 5.58104C9.44461 7.67826 7.72473 9.42275 5.58376 10.4262L4.22754 8.76925C4.0416 8.5423 3.72989 8.46574 3.46193 8.58058L0.399495 9.89305C0.106923 10.0216 -0.0544015 10.3387 0.0166907 10.6477L0.672927 13.4914C0.741285 13.7867 1.00378 14 1.31276 14C8.31534 14 14 8.32629 14 1.31277C14 1.00652 13.7894 0.741296 13.4914 0.672938Z"
        fill="black"
      />
    </svg>
  );
};

IconCall.defaultProps = {
  rootClassName: null,
  className: null,
  pencilClassName: null,
};

const { string } = PropTypes;

IconCall.propTypes = {
  rootClassName: string,
  className: string,
  pencilClassName: string,
};

export default IconCall;
