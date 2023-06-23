import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const IconFavorite = props => {
  const { rootClassName, className, pencilClassName } = props;
  const classes = classNames(rootClassName, className);
  return (
    <svg
      className={classes}
      width="23"
      height="21"
      viewBox="0 0 23 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.5 4L8.79321 2.58776C6.9781 1.64075 4.75981 1.96867 3.29632 3.40034C1.4623 5.19449 1.39255 8.1235 3.13908 10.0029L11.5 19L19.8609 10.0029C21.6075 8.1235 21.5377 5.19449 19.7037 3.40034C18.2402 1.96867 16.0219 1.64075 14.2068 2.58776L11.5 4Z"
        fill="black"
        fillOpacity="0.33"
        stroke="white"
        strokeOpacity="0.8"
        strokeWidth="2"
      />
    </svg>
  );
};

IconFavorite.defaultProps = {
  rootClassName: null,
  className: null,
  pencilClassName: null,
};

const { string } = PropTypes;

IconFavorite.propTypes = {
  rootClassName: string,
  className: string,
  pencilClassName: string,
};

export default IconFavorite;
