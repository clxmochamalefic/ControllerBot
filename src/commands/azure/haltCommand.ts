import { Message } from "discord.js";

import Command from "../commandInterface";
import { AzureControl } from "../../models/azureControl"

export class AzureHaltCommand implements Command {
  commandNames = ["stop", "shutdown", "powerOff", "halt"];

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}halt to stop virtual machine on MicrosoftAzure.`;
  }

  async run(message: Message): Promise<void> {
    await message.reply("request received / shutting-down VirtualMachine")

    await AzureControl.halt()

    await message.reply("request accepted / stopped VirtualMachine / ( (o>_<) THANK YOU SEND SHUTDOWN COMMAND!!")
  }
}
