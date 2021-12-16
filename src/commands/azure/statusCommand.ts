import { Message } from "discord.js";

import Command from "../commandInterface";
import { AzureControl } from "../../models/azureControl"

export class AzureStatusCommand implements Command {
  commandNames = ["status", "stat"];

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}status to status of virtual machine on MicrosoftAzure.`;
  }

  async run(message: Message): Promise<void> {
    await message.reply("request received / fetch VirtualMachine status")
    const statuses = await AzureControl.status()
    await message.reply("request accepted / show status below")

    for (let stat of statuses) {
      await message.reply(stat)
    }
  }
}
