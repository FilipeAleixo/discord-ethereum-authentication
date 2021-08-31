const {SlashCommand} = require('slash-create');

module.exports = class HelloCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
          name: "hello",
          description: "Says hello to you.",
          guildIDs: ["880146700524724255"],
        });
        this.filePath = __filename;
    }

    async run(ctx) {
        return `Hello, ${ctx.user.username}`;
    }
};
