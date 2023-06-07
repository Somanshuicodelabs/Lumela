import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const IconLocation = props => {
  const { rootClassName, className, pencilClassName } = props;
  const classes = classNames(rootClassName, className);
  return (
    <svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.782 -0.0429688C3.49098 -0.0429688 0 3.44801 0 7.73899C0 13.0642 6.96413 20.882 7.26063 21.2122C7.53913 21.5224 8.02538 21.5218 8.30337 21.2122C8.59988 20.882 15.564 13.0642 15.564 7.73899C15.5639 3.44801 12.073 -0.0429688 7.782 -0.0429688ZM7.782 11.6543C5.62309 11.6543 3.86672 9.89791 3.86672 7.73899C3.86672 5.58007 5.62313 3.82371 7.782 3.82371C9.94088 3.82371 11.6972 5.58012 11.6972 7.73904C11.6972 9.89795 9.94088 11.6543 7.782 11.6543Z"
        fill="#60CCDA"
      />
    </svg>
  );
};

IconLocation.defaultProps = {
  rootClassName: null,
  className: null,
  pencilClassName: null,
};

const { string } = PropTypes;

IconLocation.propTypes = {
  rootClassName: string,
  className: string,
  pencilClassName: string,
};

export default IconLocation;
