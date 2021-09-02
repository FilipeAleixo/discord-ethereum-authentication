const Discord = require("discord.js");
const client = new Discord.Client();

// Note: I'm using Discord.js v12.5.3 because v13 is only compatible with node 16.
// Lambda currently only allows for node 14.

client.login(process.env.DISCORD_BOT_TOKEN);

const waitForClient = () => {
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

exports.lambdaHandler = async function (event, context) {
  await waitForClient();
  await assignRole(event.userId, event.publicAddress);
  return;
};

async function assignRole(userId, publicAddress) {
  const guild = await client.guilds.fetch(process.env.DISCORD_SERVER_ID);
  const member = await guild.members.fetch(userId);
	await member.roles.add(process.env.DISCORD_ROLE_ID);

	await member.send(
    `Congrats sir, you're now authenticated using Ethereum! Address: ${publicAddress}`
  );
	return true;

}