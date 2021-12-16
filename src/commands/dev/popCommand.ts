import Command from "../commandInterface";
import { Message } from "discord.js";

import { pushPopMessage } from "../../models/pushpopMessage"

export class PopCommand implements Command {
  commandNames = ["pop"];

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}pop to get pushed message.`;
  }

  async run(message: Message): Promise<void> {
    const popMessage = pushPopMessage.pop();
    await message.reply(popMessage.user + ": " + popMessage.message);
  }
}
