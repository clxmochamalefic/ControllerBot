import { Message } from "discord.js";

import Command from "../commandInterface";
import { AzureControl } from "../../models/azureControl"
import { autoShutdown } from "../../models/autoShutdown"

export class AzureBootCommand implements Command {
  commandNames = ["boot", "start", "powerOn"];

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}boot to boot virtual machine on MicrosoftAzure.`;
  }

  async run(message: Message): Promise<void> {
    await message.reply("begin boot")
    const ipAddress = await AzureControl.boot()
    autoShutdown.update(message)

    await message.reply("booted => " + ipAddress)
  }
}
