import * as core from '@actions/core';
import { getActionOptions, generateSchemeRegexp, getCurrentVersion } from './utils';
import collectStats from "gh-action-stats";

async function main() {
  try {
    const options = getActionOptions();
    Object.freeze(options);
    const schemeRegExp = generateSchemeRegexp(options.schema);
    const version = await getCurrentVersion(options, schemeRegExp);
    console.info(`[SUCCESS] - found version ${version}`);
    core.setOutput('version', version)
  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
    throw e;
  }
}

collectStats(main);
