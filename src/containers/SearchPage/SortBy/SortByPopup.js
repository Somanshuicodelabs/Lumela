import React, { Component } from 'react';
import { string, func, arrayOf, shape, number } from 'prop-types';
import classNames from 'classnames';

import { Menu, MenuContent, MenuItem, MenuLabel } from '../../../components';
import css from './SortByPopup.module.css';
import {IconArrowDown ,IconArrowUp} from '../../../components';
// import IconArrowUp from '../IconArrowUp/IconArrowUp';


const optionLabel = (options, key) => {
  const option = options.find(o => o.key === key);
  return option ? option.label : key;
};

const SortByIcon = () => {
  return (
    <svg
      className={css.icon}
      width="12"
      height="11"
      viewBox="0 0 12 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.751055 0C0.551992 0 0.361083 0.0790773 0.220324 0.219836C0.0795656 0.360594 0.000488281 0.551504 0.000488281 0.750567C0.000488281 0.949629 0.0795656 1.14054 0.220324 1.2813C0.361083 1.42206 0.551992 1.50113 0.751055 1.50113H9.00729C9.20635 1.50113 9.39726 1.42206 9.53802 1.2813C9.67878 1.14054 9.75785 0.949629 9.75785 0.750567C9.75785 0.551504 9.67878 0.360594 9.53802 0.219836C9.39726 0.0790773 9.20635 0 9.00729 0H0.751055Z"
        fill="#2CAAC1"
      />
      <path
        d="M0.750567 3.00238C0.551504 3.00238 0.360594 3.08146 0.219836 3.22222C0.0790773 3.36297 0 3.55388 0 3.75295C0 3.95201 0.0790773 4.14292 0.219836 4.28368C0.360594 4.42444 0.551504 4.50351 0.750567 4.50351H6.00453C6.2036 4.50351 6.39451 4.42444 6.53526 4.28368C6.67602 4.14292 6.7551 3.95201 6.7551 3.75295C6.7551 3.55388 6.67602 3.36297 6.53526 3.22222C6.39451 3.08146 6.2036 3.00238 6.00453 3.00238H0.750567Z"
        fill="#2CAAC1"
      />
      <path
        d="M0.750567 6.00464C0.551504 6.00464 0.360594 6.08372 0.219836 6.22447C0.0790773 6.36523 0 6.55614 0 6.7552C0 6.95427 0.0790773 7.14518 0.219836 7.28594C0.360594 7.42669 0.551504 7.50577 0.750567 7.50577H3.75283C3.9519 7.50577 4.14281 7.42669 4.28356 7.28594C4.42432 7.14518 4.5034 6.95427 4.5034 6.7552C4.5034 6.55614 4.42432 6.36523 4.28356 6.22447C4.14281 6.08372 3.9519 6.00464 3.75283 6.00464H0.750567Z"
        fill="#2CAAC1"
      />
      <path
        d="M9.75728 3.75295C9.75728 3.55388 9.6782 3.36297 9.53745 3.22222C9.39669 3.08146 9.20578 3.00238 9.00672 3.00238C8.80765 3.00238 8.61674 3.08146 8.47598 3.22222C8.33523 3.36297 8.25615 3.55388 8.25615 3.75295V7.94561L7.28567 6.97513C7.14411 6.83841 6.95451 6.76275 6.75772 6.76446C6.56092 6.76617 6.37267 6.84511 6.23351 6.98427C6.09435 7.12343 6.01541 7.31168 6.0137 7.50848C6.01199 7.70528 6.08764 7.89487 6.22436 8.03643L8.47606 10.2881C8.61682 10.4288 8.80769 10.5079 9.00672 10.5079C9.20574 10.5079 9.39661 10.4288 9.53737 10.2881L11.7891 8.03643C11.9258 7.89487 12.0014 7.70528 11.9997 7.50848C11.998 7.31168 11.9191 7.12343 11.7799 6.98427C11.6408 6.84511 11.4525 6.76617 11.2557 6.76446C11.0589 6.76275 10.8693 6.83841 10.7278 6.97513L9.75728 7.94561V3.75295Z"
        fill="#2CAAC1"
      />
    </svg>
  );
};



class SortByPopup extends Component {
  constructor(props) {
    super(props);
    this.state = { isFilterDrawerOpen: false };
    this.state = { isOpen: false };
    this.onToggleActive = this.onToggleActive.bind(this);
    this.selectOption = this.selectOption.bind(this);
  }

  onToggleActive(isOpen) {
    this.setState({ isOpen: isOpen });
  }

  selectOption(urlParam, option) {
    this.setState({ isOpen: false });
    this.props.onSelect(urlParam, option);
  }

  toggleFilterDrawer = () => {
    this.setIsFilterDrawerOpen(!this.state.isFilterDrawerOpen);
  };
  setIsFilterDrawerOpen = (isOpen) => {
    this.setState({ isFilterDrawerOpen: isOpen });
  }

  render() {
    const {
      rootClassName,
      className,
      menuLabelRootClassName,
      urlParam,
      label,
      options,
      initialValue,
      contentPlacementOffset,
    } = this.props;

    // resolve menu label text and class
    const menuLabel = initialValue ? optionLabel(options, initialValue) : label;

    const classes = classNames(rootClassName || css.root, className);
    const menuLabelClasses = classNames(
      menuLabelRootClassName || css.menuLabel,
      !initialValue && options ? css.active : null
    );

    return (
      <>
        <Menu
          className={classes}
          useArrow={false}
          contentPlacementOffset={contentPlacementOffset}
          onToggleActive={this.onToggleActive}
          isOpen={this.state.isOpen}
        >
          <MenuLabel className={menuLabelClasses} onClickMobile={() => this.toggleFilterDrawer()}>
            <SortByIcon />
            {menuLabel}
            {this.state.isOpen ? <IconArrowUp /> : <IconArrowDown />}
          </MenuLabel>

          <MenuContent className={css.menuContent} closeDrawer={() => this.toggleFilterDrawer()} openDrawer={this.state.isFilterDrawerOpen}>
            {/* <MenuItem key="sort-by">
              <h4 className={css.menuHeading}>{label}</h4>
            </MenuItem> */}
            {options.map((option, i) => {
              // check if this option is selected
              const selected = initialValue === option.key;
              // menu item border class
              const menuItemBorderClass = selected ? css.menuItemBorderSelected : css.menuItemBorder;

              return (
                <MenuItem key={option.key + i}>
                  <button
                    className={classNames(css.menuItem, selected ? css.active : null)}
                    disabled={option.disabled}
                    onClick={() => (selected ? null : this.selectOption(urlParam, option.key))}
                  >
                    <span className={menuItemBorderClass} />
                    {option.longLabel || option.label}
                  </button>
                </MenuItem>
              );
            })}
          </MenuContent>

        </Menu>
      </>
    );
  }
}

SortByPopup.defaultProps = {
  rootClassName: null,
  className: null,
  menuLabelRootClassName: null,
  initialValue: null,
  contentPlacementOffset: 0,
};

SortByPopup.propTypes = {
  rootClassName: string,
  className: string,
  menuLabelRootClassName: string,
  urlParam: string.isRequired,
  label: string.isRequired,
  onSelect: func.isRequired,
  options: arrayOf(
    shape({
      key: string.isRequired,
      label: string.isRequired,
    })
  ).isRequired,
  initialValue: string,
  contentPlacementOffset: number,
};

export default SortByPopup;
