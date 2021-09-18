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
const currentDirectory = exec('pwd')
  .toString()
  .replace(/(\r\n|\n|\r)/gm, '')
  .trim();

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
Reflect.deleteProperty(packageJSON, 'files');
// and save it in temp folder
fs.writeFileSync(
  `${packageDirectory}/package.json`,
  JSON.stringify(packageJSON, null, 2),
);

// pack everything and send to out folder
exec(
  `cd ${packageDirectory} && yarn pack --out %s-%v.tgz && npx copyfiles *.tgz ${currentDirectory}/out`,
);

// clean after
exec(`npx rimraf ${tempDirectory}`);
