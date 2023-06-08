import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const IconUser = props => {
  const { rootClassName, className, pencilClassName } = props;
  const classes = classNames(rootClassName , className);
  return (
<svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M13.5 25.3636C20.0521 25.3636 25.3636 20.0521 25.3636 13.5C25.3636 6.94789 20.0521 1.63636 13.5 1.63636C6.94789 1.63636 1.63636 6.94789 1.63636 13.5C1.63636 20.0521 6.94789 25.3636 13.5 25.3636ZM13.5 27C20.9558 27 27 20.9558 27 13.5C27 6.04416 20.9558 0 13.5 0C6.04416 0 0 6.04416 0 13.5C0 20.9558 6.04416 27 13.5 27Z" fill="black"/>
<path fillRule="evenodd" clipRule="evenodd" d="M13.5003 13.0908C15.5337 13.0908 17.1821 11.4424 17.1821 9.409C17.1821 7.37559 15.5337 5.72718 13.5003 5.72718C11.4669 5.72718 9.81849 7.37559 9.81849 9.409C9.81849 11.4424 11.4669 13.0908 13.5003 13.0908ZM13.5003 14.7272C16.4375 14.7272 18.8185 12.3462 18.8185 9.409C18.8185 6.47185 16.4375 4.09082 13.5003 4.09082C10.5632 4.09082 8.18213 6.47185 8.18213 9.409C8.18213 12.3462 10.5632 14.7272 13.5003 14.7272Z" fill="black"/>
<path d="M21.7828 23.1305C20.8109 19.6972 17.6539 17.1818 13.9094 17.1818C10.0263 17.1818 6.77503 19.8868 5.93719 23.5154L4.51538 22.5C5.74095 18.4744 9.48311 15.5454 13.9094 15.5454C18.3357 15.5454 22.0778 18.4744 23.3034 22.5L21.7828 23.1305Z" fill="black"/>
</svg>

  );
};

IconUser.defaultProps = {
  rootClassName: null,
  className: null,
  pencilClassName: null,
};

const { string } = PropTypes;

IconUser.propTypes = {
  rootClassName: string,
  className: string,
  pencilClassName: string,
};

export default IconUser;
