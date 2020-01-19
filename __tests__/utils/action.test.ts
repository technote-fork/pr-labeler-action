/* eslint-disable no-magic-numbers */
import nock from 'nock';
import path from 'path';
import { Context } from '@actions/github/lib/context';
import { Logger } from '@technote-space/github-action-helper';
import { GitHub } from '@actions/github/lib/github';
import {
	testEnv,
	generateContext,
	disableNetConnect,
	getConfigFixture,
} from '@technote-space/github-action-test-helper';
import { action } from '../../src/utils/action';

const rootDir       = path.resolve(__dirname, '../..');
const configRootDir = path.resolve(__dirname, '../fixtures');
const logger        = new Logger();
const octokit       = new GitHub('');
const getContext    = (branch, number = 1): Context => generateContext({
	event: 'pull_request',
	action: 'opened',
	ref: `heads/${branch}`,
	sha: 'test-sha',
	owner: 'hello',
	repo: 'world',
}, {
	payload: {
		'pull_request': {
			number,
		},
	},
});

describe('action', () => {
	testEnv(rootDir);
	disableNetConnect(nock);

	it('should add labels', async() => {
		const fn = jest.fn();
		nock('https://api.github.com')
			.get('/repos/hello/world/contents/.github/pr-labeler.yml')
			.reply(200, getConfigFixture(configRootDir))
			.post('/repos/hello/world/issues/1/labels', body => {
				fn();
				console.log(body);
				expect(body).toMatchObject({
					labels: ['config-fix'],
				});
				return true;
			})
			.reply(200);

		await action(logger, octokit, getContext('fix/test'));
		expect(fn).toBeCalledTimes(1);
	});

	it('should add default labels', async() => {
		const fn = jest.fn();
		nock('https://api.github.com')
			.get('/repos/hello/world/contents/.github/pr-labeler.yml')
			.reply(404)
			.post('/repos/hello/world/issues/1/labels', body => {
				fn();
				expect(body).toMatchObject({
					labels: ['fix'],
				});
				return true;
			})
			.reply(200);

		await action(logger, octokit, getContext('fix/test'));
		expect(fn).toBeCalledTimes(1);
	});

	it('should add labels with unexpected number', async() => {
		const fn = jest.fn();
		nock('https://api.github.com')
			.get('/repos/hello/world/contents/.github/pr-labeler.yml')
			.reply(200, getConfigFixture(configRootDir))
			.post('/repos/hello/world/issues/0/labels', body => {
				fn();
				expect(body).toMatchObject({
					labels: ['config-fix'],
				});
				return true;
			})
			.reply(200);

		const context = getContext('fix/test');
		delete context.payload.pull_request;
		await action(logger, octokit, context);
		expect(fn).toBeCalledTimes(1);
	});

	it('should not add labels', async() => {
		const fn = jest.fn();
		nock('https://api.github.com')
			.get('/repos/hello/world/contents/.github/pr-labeler.yml')
			.reply(200, getConfigFixture(configRootDir))
			.post('/repos/hello/world/issues/1/labels', () => {
				fn();
				return true;
			})
			.reply(200);

		await action(logger, octokit, getContext('abc/test'));
		expect(fn).not.toBeCalled();
	});
});

