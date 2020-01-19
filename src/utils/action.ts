import { getInput } from '@actions/core' ;
import { GitHub } from '@actions/github';
import { Context } from '@actions/github/lib/context';
import { getConfig } from '@technote-space/github-action-config-helper';
import { Utils, Logger } from '@technote-space/github-action-helper';
import { getDefaultConfig, getLabelsToAdd } from './misc';

export const action = async(logger: Logger, octokit: GitHub, context: Context): Promise<void> => {
	const configPath  = getInput('configuration-path', {required: true});
	const config      = await getConfig(configPath, octokit, context, '') || getDefaultConfig();
	const labelsToAdd = getLabelsToAdd(config, Utils.getBranch(context));
	if (labelsToAdd.length) {
		await octokit.issues.addLabels({
			...context.repo,
			// eslint-disable-next-line no-magic-numbers
			number: context.payload.pull_request?.number ?? 0,
			labels: labelsToAdd,
		});

		logger.startProcess('Added labels: ');
		console.log(labelsToAdd);
	} else {
		logger.info('There are no labels to add.');
	}
	logger.endProcess();
};
