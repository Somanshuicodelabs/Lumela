import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const IconArrowUp = props => {
    const { rootClassName, className, pencilClassName } = props;
    const classes = classNames(rootClassName, className);
    return (
        <svg
            className={classes}
            width="8"
            height="5"
            viewBox="0 0 8 5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M7.24268 4.5L4.12134 1.37866L1 4.5" stroke="black" />
        </svg>
    );
};

IconArrowUp.defaultProps = {
    rootClassName: null,
    className: null,
    pencilClassName: null,
};

const { string } = PropTypes;

IconArrowUp.propTypes = {
    rootClassName: string,
    className: string,
    pencilClassName: string,
};

export default IconArrowUp;
