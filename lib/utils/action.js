"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = void 0;
const core_1 = require("@actions/core");
const github_action_config_helper_1 = require("@technote-space/github-action-config-helper");
const github_action_helper_1 = require("@technote-space/github-action-helper");
const misc_1 = require("./misc");
const action = (logger, octokit, context) => __awaiter(void 0, void 0, void 0, function* () {
    const configPath = core_1.getInput('CONFIGURATION_PATH', { required: true });
    const ref = core_1.getInput('REF');
    const config = (yield github_action_config_helper_1.getConfig(configPath, octokit, context, {
        configPath: '',
        ref,
    })) || misc_1.getDefaultConfig();
    const labelsToAdd = misc_1.getLabelsToAdd(config, github_action_helper_1.Utils.getPrBranch(context));
    if (labelsToAdd.length) {
        yield octokit.issues.addLabels(Object.assign(Object.assign({}, context.repo), { 'issue_number': misc_1.getPrNumber(context), labels: labelsToAdd }));
        logger.startProcess('Added labels: ');
        console.log(labelsToAdd);
    }
    else {
        logger.info('There are no labels to add.');
    }
    logger.endProcess();
});
exports.action = action;
