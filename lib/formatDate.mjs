import dateFns from 'date-fns';

const dateFormats = {
  long: 'MMM D, YYYY',
  short: 'MM/DD/YYYY',
  iso: 'YYYY-MM-DD',
};

const getFormat = format => dateFormats[format] || format;

export const formatDate = (date, format) => dateFns.format(date, getFormat(format));
