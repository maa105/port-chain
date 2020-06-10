## Installing Dependencies

run `npm i` on root and in `./frontend` folder

## Available Scripts

In the project directory, you can run:

### `npm run startup`

installs dependencies and starts the react frontend.<br />
works on windows. otherwise install dependencies manually (see above) then run `npm start`.<br />

### `npm start`

if dependencies are installed u can run this one directly

### `npm test`

runs the test cases and watches for changes

### `npm run build`

Builds the app for production.<br />
The build output will be in `./frontend/builds/production.zip`

### `gulp build:frontend --env <env=production|staging|development> [--zip] [--keep]`

Builds the app for the specified environment.<br />
specify --zip to zip the build.<br />
specify --keep in case --zip is specified to keep the original folder.<br />

## Configs

check `./frontend/src/config` for different configuration files. (apiPrefix is very important)

## In Development

check `./frontend/src/setupProxy.js` for proxy configuration to your backend

