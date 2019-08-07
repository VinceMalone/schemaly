import faker from 'faker';
import * as R from 'ramda';

const EmployeeEvent = {
  NewHire: 'New Hire',
  Terminated: 'Terminated',
  RateChange: 'Rate Change',
};

const WageType = {
  Hourly: 'Hourly',
  Salary: 'Salary',
};

const isNewHire = R.equals(EmployeeEvent.NewHire);
const isTerminated = R.equals(EmployeeEvent.Terminated);
const isRateChange = R.equals(EmployeeEvent.RateChange);

const isHourly = R.equals(WageType.Hourly);

const formatAmount = value =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    style: 'decimal',
  });

const amount = options => formatAmount(faker.random.number({ precision: 0.01, ...options }));

const createRate = (wageType, event, name) => {
  return {
    name,
    amount: {
      current: amount(),
      payCycle: amount(),
      previous: isRateChange(event) ? amount() : null,
    },
    hours: isHourly(wageType) ? amount({ max: 99 }) : null,
  };
};

export default function createEmployee({ formatDate }) {
  const toDate = R.unless(
    R.isNil,
    R.pipe(
      value => new Date(value),
      formatDate,
    ),
  );

  return () => {
    const employeeEvent = faker.random.arrayElement(Object.values(EmployeeEvent));
    const wageType = faker.random.arrayElement(Object.values(WageType));
    const toRate = R.partial(createRate, [wageType, employeeEvent]);

    return {
      uuid: faker.random.uuid(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      title: faker.name.jobTitle(),
      wageType,
      event: employeeEvent,
      startDate: toDate(isNewHire(employeeEvent) ? faker.date.recent() : faker.date.past()),
      terminationDate: toDate(isTerminated(employeeEvent) ? faker.date.recent() : null),
      rateChangeDate: toDate(isRateChange(employeeEvent) ? faker.date.recent() : null),
      standardRate: toRate('Standard'),
      overtimeRate: toRate('Overtime'),
      otherRate: toRate('Other'),
    };
  };
}
