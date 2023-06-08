import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const IconOrder = props => {
  const { rootClassName, className, pencilClassName } = props;
  const classes = classNames(rootClassName, className);
  return (
    <svg
      className={classes}
      width="14"
      height="18"
      viewBox="0 0 14 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.0667 0.113435L11.6667 1.68827L9.68333 0.113435C9.5826 0.039872 9.4597 6.01528e-05 9.33333 6.01528e-05C9.20697 6.01528e-05 9.08406 0.039872 8.98333 0.113435L7 1.68827L5.01667 0.113435C4.91593 0.039872 4.79303 6.01528e-05 4.66667 6.01528e-05C4.5403 6.01528e-05 4.4174 0.039872 4.31667 0.113435L2.33333 1.68827L0.933333 0.113435C0.546875 -0.16427 0 0.0993739 0 0.563388V17.4366C0 17.9006 0.546875 18.1643 0.933333 17.8866L2.33333 16.3117L4.31667 17.8866C4.4174 17.9601 4.5403 17.9999 4.66667 17.9999C4.79303 17.9999 4.91593 17.9601 5.01667 17.8866L7 16.3117L8.98333 17.8866C9.08406 17.9601 9.20697 17.9999 9.33333 17.9999C9.4597 17.9999 9.5826 17.9601 9.68333 17.8866L11.6667 16.3117L13.0667 17.8866C13.4495 18.1643 14 17.9006 14 17.4366V0.563388C14 0.0993739 13.4531 -0.16427 13.0667 0.113435ZM11.6667 12.6559C11.6667 12.8105 11.5354 12.9371 11.375 12.9371H2.625C2.46458 12.9371 2.33333 12.8105 2.33333 12.6559V12.0934C2.33333 11.9388 2.46458 11.8122 2.625 11.8122H11.375C11.5354 11.8122 11.6667 11.9388 11.6667 12.0934V12.6559ZM11.6667 9.28122C11.6667 9.43589 11.5354 9.56244 11.375 9.56244H2.625C2.46458 9.56244 2.33333 9.43589 2.33333 9.28122V8.71878C2.33333 8.56411 2.46458 8.43756 2.625 8.43756H11.375C11.5354 8.43756 11.6667 8.56411 11.6667 8.71878V9.28122ZM11.6667 5.90658C11.6667 6.06125 11.5354 6.1878 11.375 6.1878H2.625C2.46458 6.1878 2.33333 6.06125 2.33333 5.90658V5.34413C2.33333 5.18946 2.46458 5.06291 2.625 5.06291H11.375C11.5354 5.06291 11.6667 5.18946 11.6667 5.34413V5.90658Z"
        fill="#595858"
      />
    </svg>
  );
};

IconOrder.defaultProps = {
  rootClassName: null,
  className: null,
  pencilClassName: null,
};

const { string } = PropTypes;

IconOrder.propTypes = {
  rootClassName: string,
  className: string,
  pencilClassName: string,
};

export default IconOrder;
