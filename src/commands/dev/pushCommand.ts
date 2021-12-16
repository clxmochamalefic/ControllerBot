import Command from "../commandInterface";
import { Message } from "discord.js";

import { pushPopMessage } from "../../models/pushpopMessage"

export class PushCommand implements Command {
  commandNames = ["push"];

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}push to push message.`;
  }

  async run(message: Message): Promise<void> {
    pushPopMessage.push(message);
    await message.reply("pushed");
  }
}
