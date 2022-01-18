# fragments

Lab1

How to run various scripts

lint :

1. To run this script just enter command: npm run lint
2. This command will run the command "eslint --config .eslintrc.js src/\*\*" saved in the scripts part of package.json.
3. This script is run to make sure there is no errors that need to be fixed.

start :

1. To run this script just enter command: npm start
2. This command will run the command "node src/server.js" saved in the scripts part of package.json.
3. The start script runs our server normally.

dev :

1. To run this script just enter command: npm run dev
2. This command will run the command "cross-env LOG_LEVEL=debug nodemon ./src/server.js --watch src" saved in the scripts part of package.json.
3. This script runs the server in development mode using nodemon which mean the server will go through a hard reload every time a change is noted in src/\*\* folder.

debug :

1. To run this script just enter command: npm run debug
2. This command will run the command "cross-env LOG_LEVEL=debug nodemon --inspect=0.0.0.0:9229 ./src/server.js --watch src" saved in the scripts part of package.json.
3. This script is the similar to dev but it also starts the node inspector on port 9229 enabling us to attach a debugger.
