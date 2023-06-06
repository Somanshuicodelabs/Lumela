import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const IconRightArrow = props => {
  const { rootClassName, className, pencilClassName } = props;
  const classes = classNames(rootClassName, className);
  return (
    <svg
      className={classes}
      width="35"
      height="7"
      viewBox="0 0 35 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.5 3.67857L34 3.67857M34 3.67857L30 0.39286M34 3.67857L30 6.55357"
        stroke="black"
      />
    </svg>
  );
};

IconRightArrow.defaultProps = {
  rootClassName: null,
  className: null,
  pencilClassName: null,
};

const { string } = PropTypes;

IconRightArrow.propTypes = {
  rootClassName: string,
  className: string,
  pencilClassName: string,
};

export default IconRightArrow;
