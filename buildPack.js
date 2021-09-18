/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const os = require('os');

// create temp directory
const tempDirectory = fs.mkdtempSync(`${os.tmpdir()}/your-project-tarball-`);
const packageDirectory = `${tempDirectory}/package`;

// create subfolder package
fs.mkdirSync(packageDirectory);

// read existing package.json
const packageJSON = require('./package.json');

// copy all necessary files
// https://docs.npmjs.com/files/package.json#files
const exec = require('child_process').execSync;

exec(
  `copyfiles -a ${packageJSON.files} README.md CHANGELOG.md LICENSE ${packageDirectory}`,
);

const currentDirectory = exec('pwd').toString();

exec(`npx rimraf out/*`);

// create your own package.json or modify it here
Reflect.deleteProperty(packageJSON, 'scripts');
Reflect.deleteProperty(packageJSON, 'devDependencies');
fs.writeFileSync(
  `${packageDirectory}/package.json`,
  JSON.stringify(packageJSON, null, 2),
);

exec(
  `cd ${packageDirectory} && yarn pack --filename ${currentDirectory}/out/coisa.tgz && ls -lah`,
  {
    stdio: 'inherit',
  },
);
console.log(packageDirectory);

exec(`npx rimraf ${packageDirectory}`);
