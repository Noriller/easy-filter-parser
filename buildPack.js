/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const os = require('os');
const exec = require('child_process').execSync;

// create temp directory
const tempDirectory = fs.mkdtempSync(`${os.tmpdir()}/your-project-tarball-`);
const packageDirectory = `${tempDirectory}/package`;

// create subfolder package
fs.mkdirSync(packageDirectory);

// get current directory
const currentDirectory = exec('pwd').toString().trim();

// clean output folder
exec(`npx rimraf out/*`);

// read existing package.json
const packageJSON = require('./package.json');

// copy all necessary files
exec(
  `copyfiles -a -f ${packageJSON.files} README.md CHANGELOG.md LICENSE ${packageDirectory}`,
);

// modify package.json
Reflect.deleteProperty(packageJSON, 'scripts');
Reflect.deleteProperty(packageJSON, 'devDependencies');
// and save it in temp folder
fs.writeFileSync(
  `${packageDirectory}/package.json`,
  JSON.stringify(packageJSON, null, 2),
);

// pack everything
exec(
  `cd ${packageDirectory} && yarn pack --filename ${currentDirectory}/out/test.tgz`,
);

// clean after
exec(`npx rimraf ${tempDirectory}`);
