import React, { Component } from 'react';
import { func, object, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl'; // Updated import
import { InlineTextButton } from '../../components';
import css from './SearchFiltersSecondary.module.css';

class SearchFiltersSecondaryComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { currentQueryParams: props.urlQueryParams };
    this.applyFilters = this.applyFilters.bind(this);
    this.cancelFilters = this.cancelFilters.bind(this);
    this.resetAll = this.resetAll.bind(this);
  }

  applyFilters() {
    const { applyFilters, onClosePanel, closeDrawer } = this.props;

    if (applyFilters) {
      applyFilters();
    }

    onClosePanel();
    if (closeDrawer) {
      closeDrawer();
    }
  }

  cancelFilters() {
    const { cancelFilters, onClosePanel, closeDrawer } = this.props;

    if (cancelFilters) {
      cancelFilters();
    }

    onClosePanel();
    if (closeDrawer) {
      closeDrawer();
    }
  }

  resetAll(e) {
    const { resetAll, onClosePanel, isCanDoFilter, closeDrawer } = this.props;

    if (resetAll) {
      resetAll(e, isCanDoFilter);
    }

    onClosePanel();

    if (closeDrawer) {
      closeDrawer();
    }

    if (e && e.currentTarget) {
      e.currentTarget.blur();
    }
  }

  render() {
    const { rootClassName, className, children, isCanDoFilter } = this.props;
    const classes = classNames(
      rootClassName || css.root,
      className,
      isCanDoFilter ? css.canDoFilter : null
    );

    return (
      <div className={classes}>
        <div className={css.filtersWrapper}>{children}</div>
        <div className={css.footer}>
          <InlineTextButton rootClassName={css.resetAllButton} onClick={this.resetAll}>
            <FormattedMessage id="SearchFiltersSecondary.resetAll" />
          </InlineTextButton>
          <InlineTextButton rootClassName={css.cancelButton} onClick={this.cancelFilters}>
            <FormattedMessage id="SearchFiltersSecondary.cancel" />
          </InlineTextButton>
          <InlineTextButton rootClassName={css.applyButton} onClick={this.applyFilters}>
            <FormattedMessage id="SearchFiltersSecondary.apply" />
          </InlineTextButton>
        </div>
      </div>
    );
  }
}

SearchFiltersSecondaryComponent.defaultProps = {
  rootClassName: null,
  className: null,
};

SearchFiltersSecondaryComponent.propTypes = {
  rootClassName: string,
  className: string,
  urlQueryParams: object.isRequired,
  applyFilters: func.isRequired,
  resetAll: func.isRequired,
  onClosePanel: func.isRequired,
  closeDrawer: func, // Updated prop type, no longer marked as required
};

const SearchFiltersSecondary = SearchFiltersSecondaryComponent;

export default SearchFiltersSecondary;