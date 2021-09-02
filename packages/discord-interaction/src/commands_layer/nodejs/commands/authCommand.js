const {SlashCommand} = require('slash-create');
const fs = require("fs");
var jwt = require("jsonwebtoken");
//const Discord = require("discord.js");

const file = fs.readFileSync('/tmp/.env');
const envVariables = JSON.parse(file);

const JWT_EXPIRATION_TIME = "30m";

module.exports = class AuthCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
          name: "eth-auth",
          description: "Ethereum authentication",
          guildIDs: [envVariables.DISCORD_SERVER_ID],
        });
        this.filePath = __filename;
    }

    async run(ctx) {
      const token = jwt.sign({ userId: ctx.user.id }, envVariables.JWT_SECRET, {
        expiresIn: JWT_EXPIRATION_TIME
      });
      //sendDm(ctx.user.id);
      return `http://localhost:3000/discord-auth?id=${token}`;
    }
};

// Didn't manage to send message through DM without the slash command failing.
// There are some hints here, https://slash-create.js.org/#/docs/main/latest/general/faq
// I tried that, but it didn't work.
// It actually works to use the discord client to send a DM inside `run`, but then the result of the slash command is an error.
// If the goal is using DM's, probably the best way to go is just use discord.js to monitor and respond to !commands (if discord.js < v13)
// If possible to use discord.js v13, I think it already allows for slash commands natively.
// It's also possible to have messages only visible to the invoker of the slash command,
// as mentioned here https://support.discord.com/hc/en-us/articles/1500000580222-Ephemeral-Messages-FAQ
// That would be ideal, but slash-create doesn't support that option.
// 
/*
const waitForClient = (client) => {
    return new Promise((resolve, reject) => {
        // client.isReady is not available in v12.5.3, so I used uptime
        if (client.uptime == null) {
                client.on("ready", () => {
                resolve();
            });
        }
        // If uptime != null, client is ready - resolve immediately
        else {
            resolve();
        }
    });
};

async function sendDm(userId) {

  return await new Promise((resolve, reject) => {
    const client = new Discord.Client();
    client.login(envVariables.DISCORD_BOT_TOKEN);
    client.on("ready", async () => {
		const guild = await client.guilds.fetch(process.env.DISCORD_SERVER_ID);
		const member = await guild.members.fetch(userId);
		await member.send(
			"Here's your msg"
		);
		resolve("Click the link I've sent you through DM to authenticate using Ethereum.");
    });
  });
}
*/
