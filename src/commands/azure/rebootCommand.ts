import { Message } from "discord.js";

import Command from "../commandInterface";
import { AzureControl } from "../../models/azureControl"
import { autoShutdown } from "../../models/autoShutdown"

export class AzureRebootCommand implements Command {
  commandNames = ["reboot", "restart"];

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}reboot to reboot virtual machine on MicrosoftAzure.`;
  }

  async run(message: Message): Promise<void> {
    await message.reply("begin reboot")

    const ipAddress = await AzureControl.reboot()
    autoShutdown.update(message)

    await message.reply("rebooted => " + ipAddress)
  }
}
