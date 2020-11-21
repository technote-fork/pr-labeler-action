"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrNumber = exports.getLabelsToAdd = exports.getDefaultConfig = void 0;
const matcher_1 = __importDefault(require("matcher"));
const getDefaultConfig = () => ({
    feature: ['feature/*', 'feat/*'],
    fix: 'fix/*',
    chore: 'chore/*',
});
exports.getDefaultConfig = getDefaultConfig;
// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
const getLabelsToAdd = (config, branchName) => Object.keys(config).filter(key => Array.isArray(config[key]) ?
    config[key].some(pattern => matcher_1.default.isMatch(branchName, pattern)) :
    matcher_1.default.isMatch(branchName, config[key]));
exports.getLabelsToAdd = getLabelsToAdd;
// eslint-disable-next-line no-magic-numbers
const getPrNumber = (context) => { var _a, _b; return (_b = (_a = context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.number) !== null && _b !== void 0 ? _b : 0; };
exports.getPrNumber = getPrNumber;
