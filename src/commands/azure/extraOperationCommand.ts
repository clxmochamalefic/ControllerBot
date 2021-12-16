import { Message } from "discord.js";

import Command from "../commandInterface";
import { autoShutdown } from "../../models/autoShutdown"

export class AzureExtraOperationCommand implements Command {
  commandNames = ["extra", "additional", "okawari"];

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}, EXTRA OPERATION VirtualMachine`;
  }

  async run(message: Message): Promise<void> {
    autoShutdown.update(message)
  }
}
