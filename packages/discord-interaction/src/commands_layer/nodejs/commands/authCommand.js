const {SlashCommand} = require('slash-create');
const fs = require("fs");
var jwt = require("jsonwebtoken");

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
        expiresIn: JWT_EXPIRATION_TIME,
      });

      // See all the message options here:
      // https://slash-create.js.org/#/docs/main/v4.0.1/typedef/MessageOptions
      ctx.send(`http://localhost:3000/discord-auth?id=${token}`, {
        ephemeral: true,
      });
    }
};