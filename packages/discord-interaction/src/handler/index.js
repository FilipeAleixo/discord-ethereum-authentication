// included in commands layer
const {AWSLambdaServer, SlashCreator} = require('slash-create');
const fs = require("fs");

// match any JS file in commands directory
const COMMANDS_DIR_OPTIONS = {
    dirname: '/opt/nodejs/commands',
    filter: /^([^.].*)\.js$/,
    recursive: false
};

writeEnvVariablesToLayer();

const creator = new SlashCreator({
    applicationID: process.env.DISCORD_APP_ID,
    publicKey: process.env.DISCORD_PUBLIC_KEY,
    token: process.env.DISCORD_BOT_TOKEN
});

creator
    .withServer(new AWSLambdaServer(module.exports, 'lambdaHandler'))
    .registerCommandsIn(COMMANDS_DIR_OPTIONS);

creator.on('debug', console.log);
creator.on('warn', console.log);
creator.on('error', console.log);
creator.on('rawREST', (request) => {
    console.log("Request:", JSON.stringify(request.body));
});

function writeEnvVariablesToLayer() {
  // Layers can't access environment variables directly, so I'm using this hack
  const envVariables = {
    DISCORD_SERVER_ID: process.env.DISCORD_SERVER_ID,
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
    JWT_SECRET: process.env.JWT_SECRET
  };
  fs.writeFileSync("/tmp/.env", JSON.stringify(envVariables));
}