import * as core from '@actions/core';
import * as fs from "fs";
import * as readline from "readline";

const FAILURE = 1;

type ActionOptions = {
  schema: string,
  versionFile: string,
  versionLine?: number,
}

async function test() {
  const options = getActionOptions();
  Object.freeze(options);
  const schemeRegExp = generateSchemeRegexp(options.schema);
  const version = await getCurrentVersion(options, schemeRegExp);
  console.info(`[SUCCESS] - found version ${version}`);
  return version;
}


function getActionOptions(): ActionOptions {
  const schema = core.getInput('schema', { required: true });
  const versionFile = core.getInput('version-file', { required: true });
  const versionLine = parseInt(core.getInput('version-line')) || undefined;

  return {
    schema,
    versionFile,
    versionLine,
  };
}

export async function getCurrentVersion(options: ActionOptions, regExp: RegExp): Promise<string> {
  const { versionFile: path, versionLine: line } = options;

  // verify the path actually corresponds to a file
  if (!fs.existsSync(path)) throw new Error(`Version file with path ${path} does not exist.`);

  const rl = readline.createInterface({ input: fs.createReadStream(path), crlfDelay: Infinity });
  let counter = 1,
    initialMatch: string | undefined;

  for await (const ln of rl) {
    const match = ln.match(regExp);
    if (!initialMatch && match !== null) initialMatch = match[0]; // set the initial match
    if (!line && initialMatch) { // return straight away if line is not specified
      console.log(`Match found line ${counter} -> ${initialMatch}`);
      return initialMatch;
    }
    // if the user has specified a line number we go all the way to it
    if (line && counter === line) {
      if (match !== null) {
        console.log(`Found scheme match line ${counter} -> ${match[0]}`);
        return match[0];
      } else {
        console.log(`No match found for specified scheme on specified line ${line}.`);
        if (initialMatch) {
          console.log(`Using previous found match: ${initialMatch}`);
          return initialMatch;
        } else console.log(`No match found previously. Continuing file search.`);
      }
    } else if (line && counter > line && initialMatch) {
      console.log(`Match found line ${counter} -> ${initialMatch}`);
      return initialMatch;
    }
    counter++; // increment line counter
  }
  throw new Error(`No match found in file. Unable to identify current version number.`);

}

/**
 * scheme must be of form <tag><seperator>[<tag><seperator>]
 * tag will be used to generate commands
 *   - strstatus is a reserved tag that inserts the status as a string, also mapped to the status command
 * seperators are used to seperate tags. allowed seperators are: .,;-_><
 * brackets define optional tags. they wont be displayed if there are no tags after them and if they are = to 0
 * generated regex will identify the scheme in the passed options file
 * @param scheme
 */
export function generateSchemeRegexp(scheme: string): RegExp {
  let seperators = new Set(scheme.match(/[.,;:\-_><]+/gm) || []),
    tags = new Set(scheme.split(/[.,;:\-_><\]\[]+/g).filter((tag: string) => tag !== "")),
    // regExp = scheme.replace(/[\[\]]/gm, "");
    regExp = scheme.replace(/\[/gm, '(').replace(/\]/gm, ')?');
  seperators.forEach(
    (sep) => regExp = regExp.replace(new RegExp('\\' + sep.split('').join('\\'), 'g'),
      '\\' + sep.split('').join('\\')));
  tags.forEach((tag) => regExp = regExp.replace(tag, '[0-9]+'));

  return new RegExp(regExp);
}

async function main() {
  const options = getActionOptions();
  Object.freeze(options);
  const schemeRegExp = generateSchemeRegexp(options.schema);
  const version = await getCurrentVersion(options, schemeRegExp);
  console.info(`[SUCCESS] - found version ${version}`);
  return version;
}


main()
  .then(version => version)
  .catch(e => {
    core.error(e);
    return FAILURE;
  });
