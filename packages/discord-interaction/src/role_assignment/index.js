const Discord = require("discord.js");
const client = new Discord.Client();

client.login(process.env.DISCORD_BOT_TOKEN);

exports.lambdaHandler = async function (event, context) {
  return assignRole();
};

async function assignRole() {
  return await new Promise((resolve, reject) => {
    client.on("ready", async () => {
      const guild = client.guilds.cache.get(process.env.SERVER_ID);
      console.log(guild.owner);
      const member = guild.member("xx");
      if (member.roles.has("xx")) return;
      member.addRole("xx");
      /*
      client.channels.cache
                .get(process.env.CHANNEL_ID)
                .send("Success")
      */
    });
  });
}
