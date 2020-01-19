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
