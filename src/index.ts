import * as core from '@actions/core';
import { getActionOptions, generateSchemeRegexp, getCurrentVersion } from './utils';
import collectStats from "gh-action-stats";

const FAILURE = 1;


async function main() {
  collectStats(); // collect the stats of the action run
  const options = getActionOptions();
  Object.freeze(options);
  const schemeRegExp = generateSchemeRegexp(options.schema);
  const version = await getCurrentVersion(options, schemeRegExp);
  console.info(`[SUCCESS] - found version ${version}`);
  return version;
}


main()
  .then(version => core.setOutput('version', version))
  .catch(e => {
    core.error(e);
    core.setFailed(e.message);
    return FAILURE;
  });
