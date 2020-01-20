import { Context } from '@actions/github/lib/context';
import matcher from 'matcher';

export const getDefaultConfig = (): ({ [key: string]: string | string[] }) => ({
	feature: ['feature/*', 'feat/*'],
	fix: 'fix/*',
	chore: 'chore/*',
});

export const getLabelsToAdd = (config: object, branchName: string): string[] => Object.keys(config).filter(key =>
	Array.isArray(config[key]) ?
		config[key].some(pattern => matcher.isMatch(branchName, pattern)) :
		matcher.isMatch(branchName, config[key]),
);

// eslint-disable-next-line no-magic-numbers
export const getPrNumber = (context: Context): number => context.payload.pull_request?.number ?? 0;
