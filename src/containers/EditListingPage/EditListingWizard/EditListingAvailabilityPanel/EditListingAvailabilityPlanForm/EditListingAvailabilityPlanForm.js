import React from 'react';
import { bool, object, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import classNames from 'classnames';

import { FormattedMessage, injectIntl, intlShape } from '../../../../../util/reactIntl';
import { Form, Heading, H3, PrimaryButton ,InlineTextButton,
  IconClose,
  FieldSelect,
  // FieldTimeZoneSelect,
  FieldRadioButton,
  FieldCheckbox,} from '../../../../../components';
import AvailabilityPlanEntries from './AvailabilityPlanEntries';
import moment from 'moment';

import css from './EditListingAvailabilityPlanForm.module.css';

const printHourStrings = h => (h > 9 ? `${h}:00` : `0${h}:00`);

const HOURS = Array(24).fill();
const ALL_START_HOURS = [...HOURS].map((v, i) => printHourStrings(i));
const ALL_END_HOURS = [...HOURS].map((v, i) => printHourStrings(i + 1));
/**
 * User might create entries inside the day of week in what ever order.
 * We sort them before submitting to Marketplace API
 */
const sortEntries = () => (a, b) => {
  if (a.startTime && b.startTime) {
    const aStart = Number.parseInt(a.startTime.split(':')[0]);
    const bStart = Number.parseInt(b.startTime.split(':')[0]);
    return aStart - bStart;
  }
  return 0;
};

const findEntryFn = entry => e => e.startTime === entry.startTime && e.endTime === entry.endTime;

const filterStartHours = (availableStartHours, values, dayOfWeek, index) => {
  const entries = values[dayOfWeek];
  const currentEntry = entries[index];

  // If there is no end time selected, return all the available start times
  if (!currentEntry.endTime) {
    return availableStartHours;
  }

  // By default the entries are not in order so we need to sort the entries by startTime
  // in order to find out the previous entry
  const sortedEntries = [...entries].sort(sortEntries());

  // Find the index of the current entry from sorted entries
  const currentIndex = sortedEntries.findIndex(findEntryFn(currentEntry));

  // If there is no next entry or the previous entry does not have endTime,
  // return all the available times before current selected end time.
  // Otherwise return all the available start times that are after the previous entry or entries.
  const prevEntry = sortedEntries[currentIndex - 1];
  const pickBefore = time => h => h < time;
  const pickBetween = (start, end) => h => h >= start && h < end;

  return !prevEntry || !prevEntry.endTime
    ? availableStartHours.filter(pickBefore(currentEntry.endTime))
    : availableStartHours.filter(pickBetween(prevEntry.endTime, currentEntry.endTime));
};

const filterEndHours = (availableEndHours, values, dayOfWeek, index) => {
  const entries = values[dayOfWeek];
  const currentEntry = entries[index];

  // If there is no start time selected, return an empty array;
  if (!currentEntry.startTime) {
    return [];
  }

  // By default the entries are not in order so we need to sort the entries by startTime
  // in order to find out the allowed start times
  const sortedEntries = [...entries].sort(sortEntries(-1));

  // Find the index of the current entry from sorted entries
  const currentIndex = sortedEntries.findIndex(findEntryFn(currentEntry));

  // If there is no next entry,
  // return all the available end times that are after the start of current entry.
  // Otherwise return all the available end hours between current start time and next entry.
  const nextEntry = sortedEntries[currentIndex + 1];
  const pickAfter = time => h => h > time;
  const pickBetween = (start, end) => h => h > start && h <= end;

  return !nextEntry || !nextEntry.startTime
    ? availableEndHours.filter(pickAfter(currentEntry.startTime))
    : availableEndHours.filter(pickBetween(currentEntry.startTime, nextEntry.startTime));
};

const getEntryBoundaries = (values, dayOfWeek, intl, findStartHours) => index => {
  const entries = values[dayOfWeek];
  const boundaryDiff = findStartHours ? 0 : 1;

  return entries.reduce((allHours, entry, i) => {
    const { startTime, endTime } = entry || {};

    if (i !== index && startTime && endTime) {
      const startHour = Number.parseInt(startTime.split(':')[0]);
      const endHour = Number.parseInt(endTime.split(':')[0]);
      const hoursBetween = Array(endHour - startHour)
        .fill()
        .map((v, i) => printHourStrings(startHour + i + boundaryDiff));

      return allHours.concat(hoursBetween);
    }

    return allHours;
  }, []);
};


const DailyPlan = props => {
  const { dayOfWeek, values, intl, form } = props;
  const getEntryStartTimes = getEntryBoundaries(values, dayOfWeek, intl, true);
  const getEntryEndTimes = getEntryBoundaries(values, dayOfWeek, intl, false);

  const hasEntries = values[dayOfWeek] && values[dayOfWeek][0];

  const startTimePlaceholder = intl.formatMessage({
    id: 'EditListingAvailabilityPlanForm.startTimePlaceholder',
  });
  const endTimePlaceholder = intl.formatMessage({
    id: 'EditListingAvailabilityPlanForm.endTimePlaceholder',
  });

  return (
    <div className={classNames(css.weekDay, hasEntries ? css.hasEntries : null)}>
      <FieldArray name={dayOfWeek}>
        {({ fields }) => {
          return (
            <div className={css.dayButtons}>
              {values.selectedDay == dayOfWeek ? (
                <div className={css.openCheckBox}>
                  <FieldCheckbox
                    id={`${dayOfWeek}.open`}
                    name={`${dayOfWeek}Status`}
                    label={'Open 24 hours'}
                    isAvailability={true}
                    value={`${dayOfWeek}_open`}
                    onChecked={e => {
                      fields.map(i => fields.remove(i));
                      form.change(`${dayOfWeek}Status`, e.target.checked && [`${dayOfWeek}_open`]);
                      const rr = [{startTime:"12:00",endTime:"00:00"}];
                      form.change(`${dayOfWeek}`,rr)
                      form.change(`${dayOfWeek}startTime`, ' '),
                        form.change(`${dayOfWeek}endTime`, ' ');
                    }}
                  />

                  <FieldCheckbox
                    id={`${dayOfWeek}.closed`}
                    name={`${dayOfWeek}Status`}
                    label={'Closed'}
                    isAvailability={true}
                    value={`${dayOfWeek}_close`}
                    onChecked={e => {
                      fields.map(i => fields.remove(i));
                      form.change(`${dayOfWeek}Status`, e.target.checked && [`${dayOfWeek}_close`]),
                        form.change(`${dayOfWeek}startTime`, ' '),
                        form.change(`${dayOfWeek}endTime`, ' ');
                    }}
                  />
                </div>
              ) : null}
              {values.selectedDay == dayOfWeek &&
              fields.length === 0 &&
              !values[`${dayOfWeek}Status`] ? (
                <InlineTextButton
                  type="button"
                  className={css.buttonAddNew}
                  onClick={() => {
                    values[`${dayOfWeek}Status`]
                      ? fields.push({ startTime: '00:00', endTime: '00:00' })
                      : fields.push({ startTime: null, endTime: null });
                    form.change('selectedDay', dayOfWeek);
                  }}
                >
                  <FormattedMessage id="EditListingAvailabilityPlanForm.addAnother" />
                </InlineTextButton>
              ) : null}

              {fields.map((name, index) => {
                // Pick available start hours
                const pickUnreservedStartHours = h => !getEntryStartTimes(index).includes(h);
                const availableStartHours = ALL_START_HOURS.filter(pickUnreservedStartHours);
                // Pick available end hours
                const pickUnreservedEndHours = h => !getEntryEndTimes(index).includes(h);
                const availableEndHours = ALL_END_HOURS.filter(pickUnreservedEndHours);
                return (
                  values.selectedDay == dayOfWeek && (
                    <div className={css.fieldWrapper} key={name}>
                      {values[`${dayOfWeek}Status`] ? null : (
                        <div className={css.selectTime}>
                          <div className={css.formRow}>
                            <div className={css.field}>
                              <FieldSelect
                                id={`${name}.startTime`}
                                name={`${name}.startTime`}
                                selectClassName={css.fieldSelect}
                                label="Open time"
                              >
                                <option disabled value="">
                                  {startTimePlaceholder}
                                </option>
                                {filterStartHours(
                                  availableStartHours,
                                  values,
                                  dayOfWeek,
                                  index
                                ).map(s => (
                                  <option value={s} key={s}>
                                    {moment(`${s}`, ['HH.mm']).format('hh:mm A')}
                                  </option>
                                ))}
                              </FieldSelect>
                            </div>
                            <span className={css.dashBetweenTimes}>-</span>
                            <div className={css.field}>
                              <FieldSelect
                                id={`${name}.endTime`}
                                name={`${name}.endTime`}
                                selectClassName={css.fieldSelect}
                                label="Close time"
                              >
                                <option disabled value="">
                                  {endTimePlaceholder}
                                </option>
                                {filterEndHours(availableEndHours, values, dayOfWeek, index).map(
                                  s => (
                                    <option value={s} key={s}>
                                      {moment(`${s}`, ['HH.mm']).format('hh:mm A')}
                                    </option>
                                  )
                                )}
                              </FieldSelect>
                            </div>
                          </div>

                          <div
                            className={css.fieldArrayRemove}
                            onClick={() => fields.remove(index)}
                            style={{ cursor: 'pointer' }}
                          >
                            <IconClose rootClassName={css.closeIcon} />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                );
              })}

              {fields.length === 0 || values[`${dayOfWeek}Status`] ? null : (
                <InlineTextButton
                  type="button"
                  className={css.buttonAddNew}
                  onClick={() => {
                    values[`${dayOfWeek}Status`]
                      ? fields.push({ startTime: '00:00', endTime: '00:00' })
                      : fields.push({ startTime: null, endTime: null });
                    form.change('selectedDay', dayOfWeek);
                  }}
                >
                  <FormattedMessage id="EditListingAvailabilityPlanForm.addAnother" />
                </InlineTextButton>
              )}
            </div>
          );
        }}
      </FieldArray>
    </div>
  );
};

/**
 * Handle submitted values: sort entries within the day of week
 * @param {Redux Thunk} onSubmit promise fn.
 * @param {Array<string>} weekdays ['mon', 'tue', etc.]
 */
const submit = (onSubmit, weekdays) => values => {
  const sortedValues = weekdays.reduce(
    (submitValues, day) => {
      return submitValues[day]
        ? {
            ...submitValues,
            [day]: submitValues[day].sort(sortEntries()),
          }
        : submitValues;
    },
    { ...values }
  );

  onSubmit(sortedValues);
};

/**
 * Create and edit availability plan of the listing.
 * This is essentially the weekly schedule.
 */
const EditListingAvailabilityPlanFormComponent = props => {
  const { onSubmit, ...restOfprops } = props;
  return (
    <FinalForm
      {...restOfprops}
      onSubmit={submit(onSubmit, props.weekdays)}
      mutators={{
        ...arrayMutators,
      }}
      render={fieldRenderProps => {
        const {
          rootClassName,
          className,
          formId,
          form: formApi,
          handleSubmit,
          inProgress,
          intl,
          listingTitle,
          weekdays,
          useFullDays,
          fetchErrors,
          values,
          onCancel,
          form,
        } = fieldRenderProps;

        const classes = classNames(rootClassName || css.root, className);
        const submitInProgress = inProgress;

        const concatDayEntriesReducer = (entries, day) =>
          values[day] ? entries.concat(values[day]) : entries;
        const hasUnfinishedEntries = !!weekdays
          .reduce(concatDayEntriesReducer, [])
          .find(e => !e.startTime || !e.endTime);

        const { updateListingError } = fetchErrors || {};

        const submitDisabled = submitInProgress || hasUnfinishedEntries || !values;

        const getCompletedClass = (weekday, values) => {
          let conmpletedClass = undefined;
          switch (weekday) {
            case 'mon':
              conmpletedClass =
                (values.monStatus || values.mon) && values.selectedDay != weekday
                  ? css.completedStep
                  : null;
              break;
            case 'tue':
              conmpletedClass =
                (values.tueStatus || values.tue) && values.selectedDay != weekday
                  ? css.completedStep
                  : null;
              break;
            case 'wed':
              conmpletedClass =
                (values.wedStatus || values.wed) && values.selectedDay != weekday
                  ? css.completedStep
                  : null;
              break;
            case 'thu':
              conmpletedClass =
                (values.thuStatus || values.thu) && values.selectedDay != weekday
                  ? css.completedStep
                  : null;
              break;
            case 'fri':
              conmpletedClass =
                (values.friStatus || values.fri) && values.selectedDay != weekday
                  ? css.completedStep
                  : null;
              break;
            case 'sat':
              conmpletedClass =
                (values.satStatus || values.sat) && values.selectedDay != weekday
                  ? css.completedStep
                  : null;
              break;
            case 'sun':
              conmpletedClass =
                (values.sunStatus || values.sun) && values.selectedDay != weekday
                  ? css.completedStep
                  : null;
              break;
          }
          // if (values.monStatus && values.mon) {
          //   return css.completed;
          // }
          return conmpletedClass;
        };

        return (
          <Form id={formId} className={classes} onSubmit={handleSubmit}>
            <h3 className={css.subheading}>
              <FormattedMessage id="EditListingAvailabilityPlanForm.hoursOfOperationTitle" />
            </h3>
            <div className={css.week}>
              {weekdays.map((w, i) => {
                return (
                  <>
                    <span
                      className={classNames(
                        values.selectedDay === w && css.selectedDay,
                        getCompletedClass(w, values)
                      )}
                      onClick={() => {
                        form.change('selectedDay', w);
                      }}
                    >
                      {w}
                    </span>
                  </>
                );
              })}
            </div>

            <div className={css.week}>
              {weekdays.map((w, i) => {
                return (
                  <>
                    {values.selectedDay == w ? (
                      <DailyPlan dayOfWeek={w} key={w} values={values} intl={intl} form={form} />
                    ) : null}
                  </>
                );
              })}
            </div>
            <div className={css.submitButton}>
              {updateListingError ? (
                <p className={css.error}>
                  <FormattedMessage id="EditListingAvailabilityPlanForm.updateFailed" />
                </p>
              ) : null}
              <PrimaryButton type="button" onClick={onCancel}>
                <FormattedMessage id="EditListingAvailabilityPlanForm.cancelSchedule" />
              </PrimaryButton>{' '}
              <PrimaryButton
                type="submit"
                inProgress={submitInProgress}
                disabled={
                  submitDisabled ||
                  (!values.monStatus && !values.mon) ||
                  (!values.tueStatus && !values.tue) ||
                  (!values.wedStatus && !values.wed) ||
                  (!values.thuStatus && !values.thu) ||
                  (!values.satStatus && !values.sat) ||
                  (!values.sunStatus && !values.sun) ||
                  (!values.friStatus && !values.fri)
                }
              >
                <FormattedMessage id="EditListingAvailabilityPlanForm.saveSchedule" />
              </PrimaryButton>
            </div>
          </Form>
        );
      }}
    />
  );
};

EditListingAvailabilityPlanFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  submitButtonWrapperClassName: null,
  inProgress: false,
};

EditListingAvailabilityPlanFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  submitButtonWrapperClassName: string,

  inProgress: bool,
  fetchErrors: object.isRequired,

  listingTitle: string.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const EditListingAvailabilityPlanForm = compose(injectIntl)(
  EditListingAvailabilityPlanFormComponent
);

EditListingAvailabilityPlanForm.displayName = 'EditListingAvailabilityPlanForm';

export default EditListingAvailabilityPlanForm;