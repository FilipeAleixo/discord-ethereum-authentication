const {once} = require('events');
const CfnLambda = require('cfn-lambda');
const fs = require("fs");

// included in commands layer
const {SlashCreator} = require('slash-create');

// match any JS file in commands directory
const COMMANDS_DIR_OPTIONS = {
    dirname: '/opt/nodejs/commands',
    filter: /^([^.].*)\.js$/,
    recursive: false
};

exports.lambdaHandler = CfnLambda({
    AsyncCreate: handleCreateAsync,
    AsyncUpdate: handleUpdateAsync,
    AsyncDelete: handleDeleteAsync
});

async function handleCreateAsync() {
    console.log("CREATE");
    return handleCreateOrUpdate();
}

async function handleUpdateAsync() {
    console.log("UPDATE");
    return handleCreateOrUpdate();
}

async function handleDeleteAsync() {
    // do nothing here - commands should persist
    // (note that global commands take up to 1 hour to update)

    return {
        PhysicalResourceId: "SlashCommands:" + process.env.DISCORD_APP_ID
    }
}

async function handleCreateOrUpdate() {
    try {
        await createCommands();
    } catch (err) {
        console.log(err.stack);
        throw err;
    }

    return {
        PhysicalResourceId: "SlashCommands:" + process.env.DISCORD_APP_ID
    }
}

async function createCommands() {
    writeEnvVariablesToLayer();
    const creator = new SlashCreator({
        applicationID: process.env.DISCORD_APP_ID,
        publicKey: process.env.DISCORD_PUBLIC_KEY,
        token: process.env.DISCORD_BOT_TOKEN
    });

    creator.on('debug', console.log);
    creator.on('warn', console.log);
    creator.on('error', console.log);
    creator.on('rawREST', (request) => {
        console.log("Request:", JSON.stringify(request.body));
    });

    creator
        .registerCommandsIn(COMMANDS_DIR_OPTIONS)
        .syncCommands();

    // note that syncCommands() is asynchronous
    await once(creator, 'synced');
}

function writeEnvVariablesToLayer() {
    // Layers can't access environment variables directly, so I'm using this hack
    const envVariables = {
      DISCORD_SERVER_ID: process.env.DISCORD_SERVER_ID,
      DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
      JWT_SECRET: process.env.JWT_SECRET
    };
    fs.writeFileSync(
      "/tmp/.env",
      JSON.stringify(envVariables)
    );
}