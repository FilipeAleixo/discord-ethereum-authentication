const Discord = require("discord.js");
const client = new Discord.Client();

client.login(process.env.DISCORD_BOT_TOKEN);

exports.lambdaHandler = async function (event, context) {
  return assignRole(event.userId);
};

async function assignRole(userId) {
  return await new Promise((resolve, reject) => {
    client.on("ready", async () => {
      const guild = await client.guilds.fetch(process.env.DISCORD_SERVER_ID);
      //console.log(guild)
      const member = await guild.members.fetch(userId);

      const hasRole = await member.roles.cache.has(process.env.DISCORD_ROLE_ID);
      if (hasRole) resolve("Role already assigned");
      else {
        member.roles.add(process.env.ROLE_ID);
        await member.send("Congrats sir, you're now authenticated using Ethereum!!1");
        resolve("Successfuly assigned role");
      }
    });
  });
}

async function sendMessageToChannel(message) {
  client.channels.fetch(process.env.DISCORD_CHANNEL_ID).send(message);
}
