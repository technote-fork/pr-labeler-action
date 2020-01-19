"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const matcher_1 = __importDefault(require("matcher"));
exports.getDefaultConfig = () => ({
    feature: ['feature/*', 'feat/*'],
    fix: 'fix/*',
    chore: 'chore/*',
});
exports.getLabelsToAdd = (config, branchName) => Object.keys(config).filter(key => Array.isArray(config[key]) ?
    config[key].some(pattern => matcher_1.default.isMatch(branchName, pattern)) :
    matcher_1.default.isMatch(branchName, config[key]));
