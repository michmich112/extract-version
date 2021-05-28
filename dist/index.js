"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSchemeRegexp = exports.getCurrentVersion = void 0;
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
const readline = __importStar(require("readline"));
const FAILURE = 1;
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = getActionOptions();
        Object.freeze(options);
        const schemeRegExp = generateSchemeRegexp(options.schema);
        const version = yield getCurrentVersion(options, schemeRegExp);
        console.info(`[SUCCESS] - found version ${version}`);
        return version;
    });
}
function getActionOptions() {
    const schema = core.getInput('schema', { required: true });
    const versionFile = core.getInput('version-file', { required: true });
    const versionLine = parseInt(core.getInput('version-line')) || undefined;
    return {
        schema,
        versionFile,
        versionLine,
    };
}
function getCurrentVersion(options, regExp) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { versionFile: path, versionLine: line } = options;
        // verify the path actually corresponds to a file
        if (!fs.existsSync(path))
            throw new Error(`Version file with path ${path} does not exist.`);
        const rl = readline.createInterface({ input: fs.createReadStream(path), crlfDelay: Infinity });
        let counter = 1, initialMatch;
        try {
            for (var rl_1 = __asyncValues(rl), rl_1_1; rl_1_1 = yield rl_1.next(), !rl_1_1.done;) {
                const ln = rl_1_1.value;
                const match = ln.match(regExp);
                if (!initialMatch && match !== null)
                    initialMatch = match[0]; // set the initial match
                if (!line && initialMatch) { // return straight away if line is not specified
                    console.log(`Match found line ${counter} -> ${initialMatch}`);
                    return initialMatch;
                }
                // if the user has specified a line number we go all the way to it
                if (line && counter === line) {
                    if (match !== null) {
                        console.log(`Found scheme match line ${counter} -> ${match[0]}`);
                        return match[0];
                    }
                    else {
                        console.log(`No match found for specified scheme on specified line ${line}.`);
                        if (initialMatch) {
                            console.log(`Using previous found match: ${initialMatch}`);
                            return initialMatch;
                        }
                        else
                            console.log(`No match found previously. Continuing file search.`);
                    }
                }
                else if (line && counter > line && initialMatch) {
                    console.log(`Match found line ${counter} -> ${initialMatch}`);
                    return initialMatch;
                }
                counter++; // increment line counter
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (rl_1_1 && !rl_1_1.done && (_a = rl_1.return)) yield _a.call(rl_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        throw new Error(`No match found in file. Unable to identify current version number.`);
    });
}
exports.getCurrentVersion = getCurrentVersion;
/**
 * scheme must be of form <tag><seperator>[<tag><seperator>]
 * tag will be used to generate commands
 *   - strstatus is a reserved tag that inserts the status as a string, also mapped to the status command
 * seperators are used to seperate tags. allowed seperators are: .,;-_><
 * brackets define optional tags. they wont be displayed if there are no tags after them and if they are = to 0
 * generated regex will identify the scheme in the passed options file
 * @param scheme
 */
function generateSchemeRegexp(scheme) {
    let seperators = new Set(scheme.match(/[.,;:\-_><]+/gm) || []), tags = new Set(scheme.split(/[.,;:\-_><\]\[]+/g).filter((tag) => tag !== "")), 
    // regExp = scheme.replace(/[\[\]]/gm, "");
    regExp = scheme.replace(/\[/gm, '(').replace(/\]/gm, ')?');
    seperators.forEach((sep) => regExp = regExp.replace(new RegExp('\\' + sep.split('').join('\\'), 'g'), '\\' + sep.split('').join('\\')));
    tags.forEach((tag) => regExp = regExp.replace(tag, '[0-9]+'));
    return new RegExp(regExp);
}
exports.generateSchemeRegexp = generateSchemeRegexp;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = getActionOptions();
        Object.freeze(options);
        const schemeRegExp = generateSchemeRegexp(options.schema);
        const version = yield getCurrentVersion(options, schemeRegExp);
        console.info(`[SUCCESS] - found version ${version}`);
        core.setOutput('version', version);
        return version;
    });
}
main()
    .then(version => version)
    .catch(e => {
    core.error(e);
    core.setFailed(e.message);
    return FAILURE;
});
