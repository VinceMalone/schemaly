import fs from 'fs';
import path from 'path';

import faker from 'faker';
import * as R from 'ramda';
import yargs from 'yargs';

import { flatten } from './flatten';
import { formatDate } from './formatDate';

const { argv } = yargs
  .option('count', {
    default: 1,
    describe: 'Number of entries to generate',
    type: 'number',
  })
  .option('date-format', {
    default: 'long',
    describe: 'Format of generated dates',
    type: 'string',
  })
  .option('dry-run', {
    describe: 'Show the output without saving',
    type: 'boolean',
  })
  .option('flatten', {
    describe: 'Flatten nested data structures',
    type: 'boolean',
  })
  .option('out', {
    demandOption: true,
    describe: 'Path to the JSON output file',
    type: 'string',
  })
  .option('schema', {
    demandOption: true,
    describe: 'Path to schema module',
    type: 'string',
  })
  .option('seed', {
    default: -1,
    describe: 'Randomness seed (-1 to forgo seeding)',
    type: 'number',
  });

const build = async config => {
  const module = await import(path.resolve(argv.schema));
  const data = R.times(
    R.pipe(
      module.default(config),
      R.when(() => argv.flatten, flatten),
    ),
    argv.count,
  );

  return JSON.stringify(data, null, 2) + '\n';
};

export const save = async () => {
  if (argv.seed > -1) {
    faker.seed(argv.seed);
  }

  try {
    const json = await build({
      formatDate: R.partialRight(formatDate, [argv.dateFormat]),
    });

    if (argv.dryRun) {
      console.log(json);
    } else {
      const out = path.resolve(argv.out);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, json, 'utf8');
    }
  } catch (err) {
    console.error(err);
  }
};
