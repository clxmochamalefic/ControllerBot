import { Message } from "discord.js";

import Command from "../commandInterface";
import { AzureControl } from "../../models/azureControl"
import { autoShutdown } from "../../models/autoShutdown"

export class AzureHaltCommand implements Command {
  commandNames = ["stop", "shutdown", "powerOff", "halt"];

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}halt to stop virtual machine on MicrosoftAzure.`;
  }

  async run(message: Message): Promise<void> {
    await message.reply("shutting-down")

    await AzureControl.halt()
    autoShutdown.clear()

    await message.reply("( (o>_<) VirtualMachine stopped THANK YOU SEND SHUTDOWN COMMAND!!")
  }
}
