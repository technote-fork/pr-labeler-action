import {Context} from '@actions/github/lib/context';
import matcher from 'matcher';

export const getDefaultConfig = (): ({ [key: string]: string | string[] }) => ({
  feature: ['feature/*', 'feat/*'],
  fix: 'fix/*',
  chore: 'chore/*',
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
export const getLabelsToAdd = (config: any, branchName: string): string[] => Object.keys(config).filter(key =>
  Array.isArray(config[key]) ?
    config[key].some(pattern => matcher.isMatch(branchName, pattern)) :
    matcher.isMatch(branchName, config[key]),
);

// eslint-disable-next-line no-magic-numbers
export const getPrNumber = (context: Context): number => context.payload.pull_request?.number ?? 0;
