// included in commands layer
const {AWSLambdaServer, SlashCreator} = require('slash-create');

// match any JS file in commands directory
const COMMANDS_DIR_OPTIONS = {
    dirname: '/opt/nodejs/commands',
    filter: /^([^.].*)\.js$/,
    recursive: false
};

const creator = new SlashCreator({
    applicationID: process.env.DISCORD_APP_ID,
    publicKey: process.env.DISCORD_PUBLIC_KEY
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
