/* eslint-disable no-magic-numbers */
import {getContext} from '@technote-space/github-action-test-helper';
import {getDefaultConfig, getLabelsToAdd, getPrNumber} from '../../src/utils/misc';

describe('getDefaultConfig', () => {
  it('should return default config', () => {
    const config = getDefaultConfig();
    expect(typeof config).toBe('object');
    expect(config).toHaveProperty('feature');
    expect(config).toHaveProperty('fix');
    expect(config).toHaveProperty('chore');
    expect(config.feature).toHaveLength(2);
    expect(config.feature[0]).toBe('feature/*');
    expect(config.feature[1]).toBe('feat/*');
    expect(config.fix).toBe('fix/*');
    expect(config.chore).toBe('chore/*');
  });
});

describe('getLabelsToAdd', () => {
  it('should not get labels', () => {
    expect(getLabelsToAdd({}, 'test/abc')).toHaveLength(0);
    expect(getLabelsToAdd({fix: 'fix/*'}, 'test/abc')).toHaveLength(0);
  });

  it('should get labels', () => {
    const labels = getLabelsToAdd({
      test1: 'test/*',
      test2: ['test1/*', 'test2/*'],
      test3: ['test3/*', 'test/*'],
    }, 'test/abc');
    expect(labels).toHaveLength(2);
    expect(labels[0]).toBe('test1');
    expect(labels[1]).toBe('test3');
  });
});

describe('getPrNumber', () => {
  it('should get pr number', () => {
    expect(getPrNumber(getContext({
      payload: {
        'pull_request': {
          number: 123,
        },
      },
    }))).toBe(123);
  });

  it('should not get pr number', () => {
    expect(getPrNumber(getContext({}))).toBe(0);
    expect(getPrNumber(getContext({
      payload: {
        'pull_request': {},
      },
    }))).toBe(0);
  });
});
