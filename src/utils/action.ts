import {getInput} from '@actions/core' ;
import {Octokit} from '@technote-space/github-action-helper/dist/types';
import {Context} from '@actions/github/lib/context';
import {getConfig} from '@technote-space/github-action-config-helper';
import {Utils} from '@technote-space/github-action-helper';
import {Logger} from '@technote-space/github-action-log-helper';
import {getDefaultConfig, getLabelsToAdd, getPrNumber} from './misc';

export const action = async(logger: Logger, octokit: Octokit, context: Context): Promise<void> => {
  const configPath  = getInput('CONFIGURATION_PATH', {required: true});
  const ref         = getInput('REF');
  const config      = await getConfig(configPath, octokit, context, {
    configPath: '',
    ref,
  }) || getDefaultConfig();
  const labelsToAdd = getLabelsToAdd(config, Utils.getPrBranch(context));
  if (labelsToAdd.length) {
    await octokit.issues.addLabels({
      ...context.repo,
      'issue_number': getPrNumber(context),
      labels: labelsToAdd,
    });

    logger.startProcess('Added labels: ');
    console.log(labelsToAdd);
  } else {
    logger.info('There are no labels to add.');
  }

  logger.endProcess();
};
