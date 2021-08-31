# serverless-discord-bot

> A serverless Discord Bot template built for [AWS Lambda](https://aws.amazon.com/lambda) based on Discord's [slash commands](https://discord.com/developers/docs/interactions/slash-commands) and the [slash-create](https://github.com/Snazzah/slash-create) library.

## Introduction
This repository helps you to get started with a serverless [`AWSLambdaServer`](https://slash-create.js.org/#/docs/main/latest/examples/lambda) setup if you want to use [**slash-create**](https://github.com/Snazzah/slash-create) for your discord bot running on AWS.

It contains a [CloudFormation](https://aws.amazon.com/cloudformation/) template based on [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) describing the following resources:

| Name | Source Folder | Description |
|---|---|---|
| `CommandsLayer` | `src/commands_layer` | [Lambda layer](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html) containing the *slash-create* library and your custom slash commands |
| `CreateCommandsFunction`<br>`CreateCommandsInvoker` | `src/create_commands` | Lambda function that automatically syncs your commands to Discord every time you update them |
| `DiscordInteractionApi` | - | [Amazon API Gateway](https://aws.amazon.com/api-gateway) HTTP API receiving incoming interaction requests from Discord |
| `DiscordHandlerFunction` | `src/handler` | Lambda function responsible for handling and executing your commands |

### Credentials
Discord credentials are retrieved from an [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/) secret named `/dev/serverless_discord_bot/discord` you have to create manually before deploying the stack.

It must contain the following (self-explanatory) key/value pairs you get from the [Discord Developer Portal](https://discord.com/developers):
- `app_id`
- `public_key`
- `bot_token`

## Setup
1. Login to the [AWS Management Console](https://console.aws.amazon.com/)
2. Create a new Secrets Manager secret
    - Secret Type: *other*
    - Add your Discord credentials (see above)
    - Set the name of the secret to `/dev/serverless_discord_bot/discord`
3. Install the [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).
   You can optionally also install the [AWS Toolkit](https://aws.amazon.com/tools/) extension for your IDE. 
4. Clone this repository.
5. Add your commands in `src/commands_layer/nodejs/commands`.
   For more information, refer to the docs linked below.
   Note that global commands take up to one hour to update.
6. To build and deploy the application, run the following in your shell (alternatively use AWS Toolkit):

```text
sam build
sam deploy --guided
```

7. Copy the **API Gateway endpoint URL** stack output and paste it in the Discord Developer Portal as *Interactions Endpoint URL*.
8. Have some fun and build something great!

## Usage
### Updating your commands
To update your commands, simply edit the code in the commands directory and deploy your changes. `CreateCommandsFunction` will automatically be called and sync your changes to Discord.

## Documentation
- [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html)
- [Discord Slash Commands](https://discord.com/developers/docs/interactions/slash-commands)
- [slash-create](https://slash-create.js.org)
