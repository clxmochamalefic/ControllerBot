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
    await message.reply("request received / begin reboot VirtualMachine")

    const ipAddress = await AzureControl.reboot()
    autoShutdown.update(message)

    await message.reply("request accepted / rebooted VirtualMachine")
    await message.reply("ip address: " + ipAddress)
  }
}
