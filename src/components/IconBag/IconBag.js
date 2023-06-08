import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const IconBag = props => {
  const { rootClassName, className, pencilClassName } = props;
  const classes = classNames(rootClassName , className);
  return (
    <svg width="23" height="27" viewBox="0 0 23 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M1.67937 7.87491L3.30462 25.3562H19.6954L21.3206 7.87491H1.67937ZM0.858264 6.23096C0.352156 6.23096 -0.0440417 6.67731 0.00394202 7.19343L1.7714 26.2044C1.81335 26.6556 2.18328 27.0002 2.62572 27.0002H20.3743C20.8167 27.0002 21.1867 26.6556 21.2286 26.2044L22.9961 7.19343C23.044 6.67731 22.6478 6.23096 22.1417 6.23096H0.858264Z" fill="black"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M15.4763 9.73558V5.84135C15.4763 3.50901 13.696 1.61827 11.5 1.61827C9.30395 1.61827 7.5237 3.50901 7.5237 5.84135V9.73558C7.5237 12.0679 9.30395 13.9587 11.5 13.9587C13.696 13.9587 15.4763 12.0679 15.4763 9.73558ZM11.5 0C8.46243 0 6 2.61526 6 5.84135V9.73558C6 12.9617 8.46243 15.5769 11.5 15.5769C14.5376 15.5769 17 12.9617 17 9.73558V5.84135C17 2.61526 14.5376 0 11.5 0Z" fill="black"/>
    </svg>
    
  );
};

IconBag.defaultProps = {
  rootClassName: null,
  className: null,
  pencilClassName: null,
};

const { string } = PropTypes;

IconBag.propTypes = {
  rootClassName: string,
  className: string,
  pencilClassName: string,
};

export default IconBag;
