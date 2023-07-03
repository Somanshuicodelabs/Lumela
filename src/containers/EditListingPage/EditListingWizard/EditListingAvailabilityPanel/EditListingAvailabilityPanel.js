import React, { useState } from 'react';
import { arrayOf, bool, func, object, string } from 'prop-types';
import classNames from 'classnames';

// Import configs and util modules
import { FormattedMessage } from '../../../../util/reactIntl';
import { getDefaultTimeZoneOnBrowser, timestampToDate } from '../../../../util/dates';
import { LISTING_STATE_DRAFT, propTypes } from '../../../../util/types';
import { DAY, isFullDay } from '../../../../transactions/transaction';

// Import shared components
import { Button, H3, InlineTextButton, ListingLink, Modal } from '../../../../components';

// Import modules from this directory
import EditListingAvailabilityPlanForm from './EditListingAvailabilityPlanForm';
import EditListingAvailabilityExceptionForm from './EditListingAvailabilityExceptionForm';
import WeeklyCalendar from './WeeklyCalendar/WeeklyCalendar';

import css from './EditListingAvailabilityPanel.module.css';
import { ensureOwnListing } from '../../../../util/data';
import moment from 'moment';
import IconCollection from '../../../../components/IconCollection/IconCollection';

// This is the order of days as JavaScript understands them
// The number returned by "new Date().getDay()" refers to day of week starting from sunday.
const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

// This is the order of days as JavaScript understands them
// The number returned by "new Date().getDay()" refers to day of week starting from sunday.
const rotateDays = (days, startOfWeek) => {
  return startOfWeek === 0 ? days : days.slice(startOfWeek).concat(days.slice(0, startOfWeek));
};

const findEntry = (availabilityPlan, dayOfWeek) =>
  availabilityPlan.entries.find(d => d.dayOfWeek === dayOfWeek);

const getEntries = (availabilityPlan, dayOfWeek) =>
  availabilityPlan.entries.filter(d => d.dayOfWeek === dayOfWeek);

const defaultTimeZone = () =>
  typeof window !== 'undefined' ? getDefaultTimeZoneOnBrowser() : 'Etc/UTC';



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
                <span className={css.entry} key={`${e.dayOfWeek}${e.startTime}`}>{`${e.endTime === '00:00' ? '' : moment(`${e.startTime}`, ['HH.mm']).format('hh:mm a')
                  } ${e.endTime === '00:00' ? '' : '-'} ${e.endTime === '00:00'
                    ? 'Open 24 hours'
                    : moment(`${e.endTime}`, ['HH.mm']).format('hh:mm a')
                  }`}</span>
                <IconCollection name="EDIT_ICON_PENCIL" />
              </div>
            );
          })
        ) : Array.isArray(weekStatus) &&
          weekStatus.map(e => e?.map(f => f?.split('_')[0]).filter(r => r == dayOfWeek)) ? (
          <>
            {Array.isArray(weekStatus) &&
              weekStatus.map(
                (e, id) =>
                  e &&
                  e.map(f => {
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
const createEntryDayGroups = (entries = {}) => {
  // Collect info about which days are active in the availability plan form:
  let activePlanDays = [];
  return entries.reduce((groupedEntries, entry) => {
    const { startTime, endTime: endHour, dayOfWeek } = entry;
    const dayGroup = groupedEntries[dayOfWeek] || [];
    activePlanDays = activePlanDays.includes(dayOfWeek)
      ? activePlanDays
      : [...activePlanDays, dayOfWeek];
    return {
      ...groupedEntries,
      [dayOfWeek]: [
        ...dayGroup,
        {
          startTime,
          endTime: endHour === '00:00' ? '24:00' : endHour,
        },
      ],
      activePlanDays,
    };
  }, {});
};

// Create initial values
const createInitialValues = (availabilityPlan, weekStatus) => {
  const { timezone, entries } = availabilityPlan || {};
  const tz = timezone || defaultTimeZone();
  return {
    timezone: tz,
    monStatus: weekStatus?.[0] || null,
    tueStatus: weekStatus?.[1] || null,
    wedStatus: weekStatus?.[2] || null,
    thuStatus: weekStatus?.[3] || null,
    friStatus: weekStatus?.[4] || null,
    satStatus: weekStatus?.[5] || null,
    sunStatus: weekStatus?.[6] || null,
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
          startTime: startTime ? startTime : '12:00',
          endTime: endTime === '24:00' ? '00:00' : endTime ? endTime : '00:00',
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

//////////////////////////////////
// EditListingAvailabilityPanel //
//////////////////////////////////
const EditListingAvailabilityPanel = props => {
  const {
    className,
    rootClassName,
    params,
    locationSearch,
    listing,
    monthlyExceptionQueries,
    weeklyExceptionQueries,
    allExceptions,
    onAddAvailabilityException,
    onDeleteAvailabilityException,
    disabled,
    ready,
    onFetchExceptions,
    onSubmit,
    onManageDisableScrolling,
    onNextTab,
    submitButtonText,
    updateInProgress,
    errors,
    config,
    routeConfiguration,
    history,
    onPrevious
  } = props;
  // Hooks
  const currentListing = ensureOwnListing(listing);
  const { publicData } = (currentListing && currentListing.attributes) || {};
  const { weekStatus } = publicData || {};
  const isNextButtonDisabled = !currentListing.attributes.availabilityPlan;
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState(false);
  const [isEditExceptionsModalOpen, setIsEditExceptionsModalOpen] = useState(false);
  const [valuesFromLastSubmit, setValuesFromLastSubmit] = useState(null);

  const firstDayOfWeek = config?.localization.firstDayOfWeek;
  const classes = classNames(rootClassName || css.root, className);
  const listingAttributes = listing?.attributes;
  const unitType = listingAttributes?.publicData?.unitType;
  const useFullDays = isFullDay(unitType);
  const hasAvailabilityPlan = !!listingAttributes?.availabilityPlan;
  const isPublished = currentListing?.id && currentListing.attributes?.state !== LISTING_STATE_DRAFT;
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
  const availabilityPlan = listingAttributes?.availabilityPlan || defaultAvailabilityPlan;
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

  const sortedAvailabilityExceptions = allExceptions;

  // Save exception click handler
  const saveException = values => {
    const { availability, exceptionStartTime, exceptionEndTime, exceptionRange } = values;

    // TODO: add proper seat handling
    const seats = availability === 'available' ? 1 : 0;

    // Exception date/time range is given through FieldDateRangeInput or
    // separate time fields.
    const range = useFullDays
      ? {
        start: exceptionRange?.startDate,
        end: exceptionRange?.endDate,
      }
      : {
        start: timestampToDate(exceptionStartTime),
        end: timestampToDate(exceptionEndTime),
      };

    const params = {
      listingId: listing.id,
      seats,
      ...range,
    };

    return onAddAvailabilityException(params)
      .then(() => {
        setIsEditExceptionsModalOpen(false);
      })
      .catch(e => {
        // Don't close modal if there was an error
      });
  };

  return (
    <main className={classes}>
      {/* <H3 as="h1">
        {isPublished ? (
          <FormattedMessage
            id="EditListingAvailabilityPanel.title"
            values={{ listingTitle: <ListingLink listing={listing} />, lineBreak: <br /> }}
          />
        ) : (
          <FormattedMessage
            id="EditListingAvailabilityPanel.createListingTitle"
            values={{ lineBreak: <br /> }}
          />
        )}
      </H3> */}
      <p className={css.title}>
        <FormattedMessage id="EditListingFeaturesPanel.createListingTitle" />
      </p>

      {/* <div className={css.planInfo}>
        {!hasAvailabilityPlan ? (
          <p>
            <FormattedMessage id="EditListingAvailabilityPanel.availabilityPlanInfo" />
          </p>
        ) : null}

        <InlineTextButton
          className={css.editPlanButton}
          onClick={() => setIsEditPlanModalOpen(true)}
        >
          {hasAvailabilityPlan ? (
            <FormattedMessage id="EditListingAvailabilityPanel.editAvailabilityPlan" />
          ) : (
            <FormattedMessage id="EditListingAvailabilityPanel.setAvailabilityPlan" />
          )}
        </InlineTextButton>
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
        {errors.showListingsError ? (
          <p className={css.error}>
            <FormattedMessage id="EditListingAvailabilityPanel.showListingFailed" />
          </p>
        ) : null}

        {/* {hasAvailabilityPlan ? (
        <>
          <WeeklyCalendar
            className={css.section}
            headerClassName={css.sectionHeader}
            listingId={listing.id}
            availabilityPlan={availabilityPlan}
            availabilityExceptions={sortedAvailabilityExceptions}
            weeklyExceptionQueries={weeklyExceptionQueries}
            isDaily={unitType === DAY}
            useFullDays={useFullDays}
            onDeleteAvailabilityException={onDeleteAvailabilityException}
            onFetchExceptions={onFetchExceptions}
            params={params}
            locationSearch={locationSearch}
            firstDayOfWeek={firstDayOfWeek}
            routeConfiguration={routeConfiguration}
            history={history}
          />

          <section className={css.section}>
            <InlineTextButton
              className={css.addExceptionButton}
              onClick={() => setIsEditExceptionsModalOpen(true)}
              disabled={disabled || !hasAvailabilityPlan}
              ready={ready}
            >
              <FormattedMessage id="EditListingAvailabilityPanel.addException" />
            </InlineTextButton>
          </section>
        </>
      ) : null}

      {errors.showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingAvailabilityPanel.showListingFailed" />
        </p>
      ) : null} */}

        {/* {!isPublished ? (
        <Button
          className={css.goToNextTabButton}
          onClick={onNextTab}
          disabled={!hasAvailabilityPlan}
        >
          {submitButtonText}
        </Button>
      ) : null} */}

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
                  className={classNames(css.submitButton, 'disableButton')}
                  // onClick={() => {
                  //   const isAllWeekDaysEntered = publicData.weekStatus.findIndex(e => e === null)
                  //   isAllWeekDaysEntered === -1 && onNextTab()
                  // }}
                  onClick={onNextTab}
                  disabled={isNextButtonDisabled}
                >
                   <FormattedMessage id="EditListingDescriptionForm.nextButton"/>
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        {onManageDisableScrolling && isEditPlanModalOpen ? (
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
              listingTitle={currentListing?.attributes?.title}
              availabilityPlan={availabilityPlan}
              weekdays={WEEKDAYS}
              onCancel={() => setIsEditPlanModalOpen(false)}
              useFullDays={useFullDays}
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

        {/* {onManageDisableScrolling && isEditExceptionsModalOpen ? (
        <Modal
          id="EditAvailabilityExceptions"
          isOpen={isEditExceptionsModalOpen}
          onClose={() => setIsEditExceptionsModalOpen(false)}
          onManageDisableScrolling={onManageDisableScrolling}
          containerClassName={css.modalContainer}
          usePortal
        >
          <EditListingAvailabilityExceptionForm
            formId="EditListingAvailabilityExceptionForm"
            listingId={listing.id}
            allExceptions={allExceptions}
            monthlyExceptionQueries={monthlyExceptionQueries}
            fetchErrors={errors}
            onFetchExceptions={onFetchExceptions}
            onSubmit={saveException}
            timeZone={availabilityPlan.timezone}
            isDaily={unitType === DAY}
            updateInProgress={updateInProgress}
            useFullDays={useFullDays}
          />
        </Modal>
      ) : null} */}
      </div>
    </main>
  );
};

EditListingAvailabilityPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
  monthlyExceptionQueries: null,
  weeklyExceptionQueries: null,
  allExceptions: [],
};

EditListingAvailabilityPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  monthlyExceptionQueries: object,
  weeklyExceptionQueries: object,
  allExceptions: arrayOf(propTypes.availabilityException),
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