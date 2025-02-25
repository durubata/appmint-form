import { faker } from '@faker-js/faker';
import * as objectPath from 'object-path';

export const generateData = (columns, count) => {
  return [...Array(count)].map(() => {
    const row = {};
    columns?.forEach(column => {
      row[column.accessorKey] = faker.datatype.string();
    });
    return row;
  });
};

export const generateFakeData = (columns: any[], count: number = 10) => {
  return Array.from({ length: count }).map((_, index) => {
    const row: Record<string, any> = {};

    columns.forEach(column => {
      const path = column.accessorKey || column.header.toLowerCase();
      const value = generateValueForKey(path.split('.').pop() || '', index);
      objectPath.set(row, path, value);
    });

    return row;
  });
};

const generateValueForKey = (key: string, index: number) => {
  if (/first\s?name|given\s?name/i.test(key)) {
    return faker.name.firstName();
  } else if (/last\s?name|surname/i.test(key)) {
    return faker.name.lastName();
  } else if (/email|e-mail/i.test(key)) {
    return faker.internet.email();
  } else if (/age|years?/i.test(key)) {
    return faker.datatype.number({ min: 18, max: 100 });
  } else if (/phone|telephone|mobile/i.test(key)) {
    return faker.phone.number();
  } else if (/address|location|city|town/i.test(key)) {
    return faker.address.city();
  } else if (/title|position|role/i.test(key)) {
    return faker.name.jobTitle();
  } else if (/price|amount|cost|value/i.test(key)) {
    return faker.commerce.price();
  } else if (/description|summary|details/i.test(key)) {
    return faker.lorem.sentence();
  } else if (/date|day|time/i.test(key)) {
    return faker.date.recent().toISOString().split('T')[0];
  } else if (/company|business|organization/i.test(key)) {
    return faker.company.name();
  } else if (/country/i.test(key)) {
    return faker.address.country();
  } else if (/state|province/i.test(key)) {
    return faker.address.state();
  } else if (/zip|postal|postcode/i.test(key)) {
    return faker.address.zipCode();
  } else if (/url|website|link/i.test(key)) {
    return faker.internet.url();
  } else if (/color|colour/i.test(key)) {
    return faker.color.human();
  } else if (/username|user\s?name/i.test(key)) {
    return faker.internet.userName();
  } else if (/password/i.test(key)) {
    return faker.internet.password();
  } else if (/ip\s?address|ip/i.test(key)) {
    return faker.internet.ip();
  } else if (/mac\s?address|mac/i.test(key)) {
    return faker.internet.mac();
  } else if (/credit\s?card|cc/i.test(key)) {
    return faker.finance.creditCardNumber();
  } else if (/iban/i.test(key)) {
    return faker.finance.iban();
  } else if (/bic|swift/i.test(key)) {
    return faker.finance.bic();
  } else {
    return faker.lorem.word();
  }
};
