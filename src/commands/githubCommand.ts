import Command from "./commandInterface";
import { Message } from "discord.js";

export class GithubCommand implements Command {
  commandNames = ["echo", "print"];

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}echo to get same message.`;
  }

  async run(message: Message): Promise<void> {
    await message.reply("https://github.com/cocoalix/SerecraftBot");
  }
}
