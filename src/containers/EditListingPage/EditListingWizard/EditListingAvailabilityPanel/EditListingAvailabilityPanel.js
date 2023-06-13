import React, { useState } from 'react';
import { arrayOf, bool, func, object, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../../../util/reactIntl';
import { ensureOwnListing } from '../../../../util/data';
import { getDefaultTimeZoneOnBrowser, timestampToDate } from '../../../../util/dates';
import { LISTING_STATE_DRAFT, DATE_TYPE_DATETIME, propTypes } from '../../../../util/types';
import {
  Button,
  IconClose,
  IconEdit,
  IconSpinner,
  InlineTextButton,
  ListingLink,
  Modal,
  TimeRange,
} from '../../../../components';
// import IconEditRounded from '../IconEditRounded/IconEditRounded';
import EditListingAvailabilityPlanForm from './EditListingAvailabilityPlanForm/EditListingAvailabilityPlanForm';

import css from './EditListingAvailabilityPanel.module.css';
import moment from 'moment';
import IconCollection from '../../../../components/IconCollection/IconCollection';

const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

// We want to sort exceptions on the client-side, maximum pagination page size is 100,
// so we need to restrict the amount of exceptions to that.
const MAX_EXCEPTIONS_COUNT = 100;

const defaultTimeZone = () =>
  typeof window !== 'undefined' ? getDefaultTimeZoneOnBrowser() : 'Etc/UTC';

/////////////
// Weekday //
/////////////
const findEntry = (availabilityPlan, dayOfWeek) =>
  availabilityPlan.entries.find(d => d.dayOfWeek === dayOfWeek);

const getEntries = (availabilityPlan, dayOfWeek) =>
  availabilityPlan.entries.filter(d => d.dayOfWeek === dayOfWeek);

const Weekday = props => {
  const { availabilityPlan, dayOfWeek, openEditModal, currentListing, i } = props;
  const { publicData } = (currentListing && currentListing.attributes) || {};
  const { weekStatus } = publicData || {};
  const hasEntry = findEntry(availabilityPlan, dayOfWeek);

  return (
    <div
      className={classNames(css.weekDay, { [css.blockedWeekDay]: !hasEntry })}
      onClick={() => openEditModal(true)}
      role="button"
    >
      <div className={css.dayOfWeek}>
        <FormattedMessage id={`EditListingAvailabilityPanel.dayOfWeek.${dayOfWeek}`} />
      </div>
      <div className={css.entries}>
        {availabilityPlan && hasEntry ? (
          getEntries(availabilityPlan, dayOfWeek).map(e => {
            return (
              <div>
                <span className={css.entry} key={`${e.dayOfWeek}${e.startTime}`}>{`${ e.endTime === '00:00' ? '' : moment(
                  `${e.startTime}`,
                  ['HH.mm']
                ).format('hh:mm a')} ${e.endTime === '00:00' ? '' : "-"} ${e.endTime === '00:00'
                    ? 'Open 24 hours'
                    : moment(`${e.endTime}`, ['HH.mm']).format('hh:mm a')
                  }`}</span>
                <IconCollection name="EDIT_ICON_PENCIL" />
              </div>
            );
          })
        )
          : weekStatus &&
            weekStatus.map(e => e?.map(f => f?.split('_')[0]).filter(r => r == dayOfWeek)) ? (
            <>
              {weekStatus &&
                weekStatus.map((e, id) =>
                  e && e.map(f => {
                    return (
                      <div>
                        {i == id ? (
                          <>
                            <p>
                              {f.split('_')[1] == 'open'
                                ? 'Open 24 hours'
                                : f.split('_')[1] == 'close'
                                  ? 'Closed'
                                  : null}
                            </p>
                            <IconCollection name="EDIT_ICON_PENCIL" />
                          </>
                        ) : null}
                      </div>
                    );
                  })
                )}
            </>
          ) : null}
      </div>
    </div>
  );
};

///////////////////////////////////////////////////
// EditListingAvailabilityExceptionPanel - utils //
///////////////////////////////////////////////////

// Create initial entry mapping for form's initial values
const createEntryDayGroups = (entries = {}) =>
  entries.reduce((groupedEntries, entry) => {
    const { startTime, endTime: endHour, dayOfWeek } = entry;
    const dayGroup = groupedEntries[dayOfWeek] || [];
    return {
      ...groupedEntries,
      [dayOfWeek]: [
        ...dayGroup,
        {
          startTime,
          endTime: endHour === '00:00' ? '24:00' : endHour,
        },
      ],
    };
  }, {});

// Create initial values
const createInitialValues = (availabilityPlan, weekStatus) => {
  const { timezone, entries } = availabilityPlan || {};
  const tz = timezone || defaultTimeZone();
  return {
    timezone: tz,
    monStatus: weekStatus[0] ? weekStatus[0] : null, tueStatus: weekStatus[1] ? weekStatus[1] : null, wedStatus: weekStatus[2] ? weekStatus[2] : null, thuStatus: weekStatus[3] ? weekStatus[3] : null, friStatus: weekStatus[4] ? weekStatus[4] : null, satStatus: weekStatus[5] ? weekStatus[5] : null, sunStatus: weekStatus[6] ? weekStatus[6] : null,
    ...createEntryDayGroups(entries),
  };
};

// Create entries from submit values
const createEntriesFromSubmitValues = values =>
  WEEKDAYS.reduce((allEntries, dayOfWeek) => {
    const dayValues = values[dayOfWeek] || [];
    const dayEntries = dayValues.map(dayValue => {
       const { startTime, endTime } = dayValue;
      // Note: This template doesn't support seats yet.
      return startTime && endTime 
        ? {
            dayOfWeek,
            seats: 1,
            startTime:startTime?startTime:"12:00",
            endTime: endTime === '24:00' ? '00:00' : endTime ? endTime : "00:00",
          }
        : null;
    });

    return allEntries.concat(dayEntries.filter(e => !!e));
  }, []);

// Create availabilityPlan from submit values
const createAvailabilityPlan = values => ({
  availabilityPlan: {
    type: 'availability-plan/time',
    timezone: values.timezone,
    entries: createEntriesFromSubmitValues(values),
  },
  publicData: {
    weekStatus: WEEKDAYS.map(dayOfWeek =>
      values[`${dayOfWeek}Status`] ? values[`${dayOfWeek}Status`] : null
    ),
  },
});

// Ensure that the AvailabilityExceptions are in sensible order.
//
// Note: if you allow fetching more than 100 exception,
// pagination kicks in and that makes client-side sorting impossible.
const sortExceptionsByStartTime = (a, b) => {
  return a.attributes.start.getTime() - b.attributes.start.getTime();
};

//////////////////////////////////
// EditListingAvailabilityPanel //
//////////////////////////////////
const EditListingAvailabilityPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    availabilityExceptions,
    fetchExceptionsInProgress,
    onAddAvailabilityException,
    onDeleteAvailabilityException,
    disabled,
    ready,
    onSubmit,
    onManageDisableScrolling,
    onNextTab,
    submitButtonText,
    updateInProgress,
    errors,
    onPrevious,
  } = props;
  // Hooks
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState(false);
  const [isEditExceptionsModalOpen, setIsEditExceptionsModalOpen] = useState(false);
  const [valuesFromLastSubmit, setValuesFromLastSubmit] = useState(null);

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const { publicData } = (currentListing && currentListing.attributes) || {};
  const { weekStatus } = publicData || {};
  const isNextButtonDisabled = !currentListing.attributes.availabilityPlan;
  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const defaultAvailabilityPlan = {
    type: 'availability-plan/time',
    timezone: defaultTimeZone(),
    entries: [
      // { dayOfWeek: 'mon', startTime: '09:00', endTime: '17:00', seats: 1 },
      // { dayOfWeek: 'tue', startTime: '09:00', endTime: '17:00', seats: 1 },
      // { dayOfWeek: 'wed', startTime: '09:00', endTime: '17:00', seats: 1 },
      // { dayOfWeek: 'thu', startTime: '09:00', endTime: '17:00', seats: 1 },
      // { dayOfWeek: 'fri', startTime: '09:00', endTime: '17:00', seats: 1 },
      // { dayOfWeek: 'sat', startTime: '09:00', endTime: '17:00', seats: 1 },
      // { dayOfWeek: 'sun', startTime: '09:00', endTime: '17:00', seats: 1 },
    ],
  };
  const availabilityPlan = currentListing.attributes.availabilityPlan || defaultAvailabilityPlan;
  const initialValues = valuesFromLastSubmit
    ? valuesFromLastSubmit
    : createInitialValues(availabilityPlan, weekStatus);

  const handleSubmit = values => {
    setValuesFromLastSubmit(values);
    // Final Form can wait for Promises to return.
    return onSubmit(createAvailabilityPlan(values))
      .then(() => {
        setIsEditPlanModalOpen(false);
      })
      .catch(e => {
        // Don't close modal if there was an error
      });
  };

  const exceptionCount = availabilityExceptions ? availabilityExceptions.length : 0;
  const sortedAvailabilityExceptions = availabilityExceptions.sort(sortExceptionsByStartTime);

  // Save exception click handler
  const saveException = values => {
    const { availability, exceptionStartTime, exceptionEndTime } = values;

    // TODO: add proper seat handling
    const seats = availability === 'available' ? 1 : 0;

    return onAddAvailabilityException({
      listingId: listing.id,
      seats,
      start: timestampToDate(exceptionStartTime),
      end: timestampToDate(exceptionEndTime),
    })
      .then(() => {
        setIsEditExceptionsModalOpen(false);
      })
      .catch(e => {
        // Don't close modal if there was an error
      });
  };

  return (
    <main className={classes}>
      <p className={css.title}>
        <FormattedMessage id="EditListingFeaturesPanel.createListingTitle" />
      </p>
      <div className={css.editListingContainer}>
        {/* <div className={css.sectionHeader}>
          <p className={css.processWrap}>PROGRESS (5/5)</p>
          <div className={css.progressDiv}>
            <span className={css.progress}>&nbsp;</span>
          </div>
        </div> */}
        <div className={css.editListingContent}>
          <h2>Add your business hours</h2>
          <div className={css.week}>
            {WEEKDAYS.map((w, i) => (
              <Weekday
                dayOfWeek={w}
                key={w}
                i={i}
                availabilityPlan={availabilityPlan}
                currentListing={currentListing}
                openEditModal={setIsEditPlanModalOpen}
              />
            ))}
          </div>
          {/* <div className={css.exceptionSection}>
            <h2 className={css.exceptionTitle}>
              {fetchExceptionsInProgress ? (
                <FormattedMessage id="EditListingAvailabilityPanel.availabilityExceptionsTitleNoCount" />
              ) : (
                <FormattedMessage
                  id="EditListingAvailabilityPanel.availabilityExceptionsTitle"
                  values={{ count: exceptionCount }}
                />
              )}
            </h2>
            {fetchExceptionsInProgress ? (
              <div className={css.exceptionsLoading}>
                <IconSpinner />
              </div>
            ) : exceptionCount === 0 ? (
              <div className={css.noExceptions}>
                <FormattedMessage id="EditListingAvailabilityPanel.noExceptions" />
              </div>
            ) : (
              <div className={css.exceptions}>
                {sortedAvailabilityExceptions.map(availabilityException => {
                  const { start, end, seats } = availabilityException.attributes;
                  return (
                    <div key={availabilityException.id.uuid} className={css.exception}>
                      <div className={css.exceptionHeader}>
                        <div className={css.exceptionAvailability}>
                          <div
                            className={classNames(css.exceptionAvailabilityDot, {
                              [css.isAvailable]: seats > 0,
                            })}
                          />
                          <div className={css.exceptionAvailabilityStatus}>
                            {seats > 0 ? (
                              <FormattedMessage id="EditListingAvailabilityPanel.exceptionAvailable" />
                            ) : (
                              <FormattedMessage id="EditListingAvailabilityPanel.exceptionNotAvailable" />
                            )}
                          </div>
                        </div>
                        <TimeRange
                          className={css.timeRange}
                          startDate={start}
                          endDate={end}
                          dateType={DATE_TYPE_DATETIME}
                          timeZone={availabilityPlan.timezone}
                        />
                      </div>
                      <button
                        className={css.removeExceptionButton}
                        onClick={() =>
                          onDeleteAvailabilityException({ id: availabilityException.id })
                        }
                      >
                        <IconClose size="normal" className={css.removeIcon} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            {exceptionCount <= MAX_EXCEPTIONS_COUNT ? (
              <InlineTextButton
                className={css.addExceptionButton}
                onClick={() => setIsEditExceptionsModalOpen(true)}
                disabled={disabled}
                ready={ready}
              >
                <FormattedMessage id="EditListingAvailabilityPanel.addException" />
              </InlineTextButton>
            ) : null}
          </div> */}

          {errors.showListingsError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingAvailabilityPanel.showListingFailed" />
            </p>
          ) : null}

          <div className={css.fixedBottomFooter}>
            <div className={css.fixedWidthContainer}>
              <Button className={css.cancelButton} type="button">
                Cancel
              </Button>
              <span className={css.stepNumber}>Step 6 of 7</span>
              <div className={css.rightButtons}>
                <Button className={css.borderButton} type="button" onClick={onPrevious}>
                  Previous
                </Button>

                {!isPublished ? (
                  <Button
                  className={classNames(css.submitButton, "disableButton")}
                    // onClick={() => {
                    //   const isAllWeekDaysEntered = publicData.weekStatus.findIndex(e => e === null)
                    //   isAllWeekDaysEntered === -1 && onNextTab()
                    // }}
                    onClick={onNextTab}
                    disabled={isNextButtonDisabled}
                  >
                    {submitButtonText}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
          {onManageDisableScrolling ? (
            <Modal
              id="EditAvailabilityPlan"
              isOpen={isEditPlanModalOpen}
              onClose={() => setIsEditPlanModalOpen(false)}
              onManageDisableScrolling={onManageDisableScrolling}
              containerClassName={css.modalContainer}
              usePortal
              isAvailabilityPanel={true}
            >
              <EditListingAvailabilityPlanForm
                formId="EditListingAvailabilityPlanForm"
                listingTitle={currentListing.attributes.title}
                availabilityPlan={availabilityPlan}
                weekdays={WEEKDAYS}
                onCancel={() => setIsEditPlanModalOpen(false)}
                onSubmit={handleSubmit}
                initialValues={initialValues}
                inProgress={updateInProgress}
                fetchErrors={errors}
                onPrevious={onPrevious}
              />
            </Modal>
          ) : null}
          <div className={css.editButtons}>
            <InlineTextButton
              className={css.editPlanButton}
              onClick={() => setIsEditPlanModalOpen(true)}
            >
              <FormattedMessage id="EditListingAvailabilityPanel.editAllHours" />
            </InlineTextButton>{' '}
            <InlineTextButton
              className={css.editPlanButton}
              onClick={() => setIsEditPlanModalOpen(true)}
            >
              <FormattedMessage id="EditListingAvailabilityPanel.editWeekdays" />
            </InlineTextButton>{' '}
            <InlineTextButton
              className={css.editPlanButton}
              onClick={() => setIsEditPlanModalOpen(true)}
            >
              <FormattedMessage id="EditListingAvailabilityPanel.editWeekends" />
            </InlineTextButton>
          </div>
          {/* {onManageDisableScrolling ? (
            <Modal
              id="EditAvailabilityExceptions"
              isOpen={isEditExceptionsModalOpen}
              onClose={() => setIsEditExceptionsModalOpen(false)}
              onManageDisableScrolling={onManageDisableScrolling}
              containerClassName={css.modalContainer}
              usePortal
              isAvailabilityPanel={true}
            >
              <EditListingAvailabilityExceptionForm
                formId="EditListingAvailabilityExceptionForm"
                onSubmit={saveException}
                timeZone={availabilityPlan.timezone}
                availabilityExceptions={sortedAvailabilityExceptions}
                updateInProgress={updateInProgress}
                fetchErrors={errors}
              />
            </Modal>
          ) : null} */}
        </div>
      </div>
    </main>
  );
};

EditListingAvailabilityPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
  availabilityExceptions: [],
};

EditListingAvailabilityPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  availabilityExceptions: arrayOf(propTypes.availabilityException),
  fetchExceptionsInProgress: bool.isRequired,
  onAddAvailabilityException: func.isRequired,
  onDeleteAvailabilityException: func.isRequired,
  onSubmit: func.isRequired,
  onManageDisableScrolling: func.isRequired,
  onNextTab: func.isRequired,
  submitButtonText: string.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingAvailabilityPanel;
