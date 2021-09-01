const {SlashCommand} = require('slash-create');
const fs = require("fs");
var jwt = require("jsonwebtoken");
//const Discord = require("discord.js");

const file = fs.readFileSync('/tmp/.env');
const envVariables = JSON.parse(file);

// TODO PUT IN ENV VARIABLES
const JWT_SECRET = "d9ua9nhcn347cnr9cnr29n3hcnr239";
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
		const token = jwt.sign({ userId: ctx.user.id }, JWT_SECRET, {
      		expiresIn: JWT_EXPIRATION_TIME,
    	});
		return `http://localhost:3000/discord-auth?id=${token}`;
        //return sendDm(ctx.user.id);
    }
};

// TODO send link through private message
/*
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