import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const IconArrowDown = props => {
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
            <path d="M1 0.5L4.12134 3.62134L7.24268 0.5" stroke="black" />
        </svg>
    );
};

IconArrowDown.defaultProps = {
    rootClassName: null,
    className: null,
    pencilClassName: null,
};

const { string } = PropTypes;

IconArrowDown.propTypes = {
    rootClassName: string,
    className: string,
    pencilClassName: string,
};

export default IconArrowDown;
