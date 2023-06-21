import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const IconPayment = props => {
  const { rootClassName, className, pencilClassName } = props;
  const classes = classNames(rootClassName , className);
  return (
    <svg
      className={classes}
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 17.2923C1 18.2315 1.76848 19 2.70773 19H21.322C22.2648 19 23.0298 18.2315 23.0298 17.2923V16.2625H1V17.2923Z"
        fill="#121212"
      />
      <path
        d="M21.322 5H2.70773C1.76848 5 1 5.76515 1 6.70773V14.3554H23.0298V6.70773C23.0298 5.76515 22.2648 5 21.322 5ZM8.08966 10.0532C8.08966 10.2178 7.95624 10.3512 7.79164 10.3512L3.71809 10.351C3.55349 10.351 3.42007 10.2176 3.42007 10.053V7.57279C3.42007 7.40819 3.55349 7.27477 3.71809 7.27477H7.79181C7.95641 7.27477 8.08983 7.40819 8.08983 7.57279L8.08966 10.0532ZM17.0732 10.0038C16.2569 10.0038 15.5942 9.34122 15.5942 8.52488C15.5942 7.71204 16.2569 7.04944 17.0732 7.04944C17.8929 7.04944 18.5486 7.72237 18.5486 8.52488C18.5486 9.33106 17.8929 10.0038 17.0732 10.0038ZM19.505 10.0038C19.2489 10.0038 19.0064 9.93895 18.7946 9.82271C19.0781 9.45064 19.2317 8.99638 19.2317 8.52504C19.2317 8.05375 19.0779 7.60278 18.7944 7.23058C19.0062 7.11451 19.2487 7.04947 19.5049 7.04947C20.3212 7.04947 20.9803 7.71207 20.9803 8.52491C20.9805 9.34125 20.3212 10.0038 19.505 10.0038Z"
        fill="#121212"
      />
    </svg>
  );
};

IconPayment.defaultProps = {
  rootClassName: null,
  className: null,
  pencilClassName: null,
};

const { string } = PropTypes;

IconPayment.propTypes = {
  rootClassName: string,
  className: string,
  pencilClassName: string,
};

export default IconPayment;
