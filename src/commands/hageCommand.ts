import Command from "./commandInterface";
import { Message } from "discord.js";

export class HageCommand implements Command {
  commandNames = ["hage", "!hage"];

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}echo to get same message.`;
  }

  async run(message: Message): Promise<void> {
    await message.reply("DON'T SAY THAT AGAIN");
  }
}
