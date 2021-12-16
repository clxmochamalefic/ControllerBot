import { Message } from "discord.js";
import { ComputeManagementClient } from "@azure/arm-compute"
import { NetworkManagementClient } from "@azure/arm-network"
import { ClientSecretCredential } from "@azure/identity"

import Command from "../commandInterface";
import azureConfig from "../../config/azureConfig"
import { AzureControl } from "../../models/azureControl"

export class AzureBootCommand implements Command {
  commandNames = ["boot", "start", "powerOn"];

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}boot to boot virtual machine on MicrosoftAzure.`;
  }

  async run(message: Message): Promise<void> {
    await message.reply("request received / begin boot VirtualMachine")
    const ipAddress = await AzureControl.boot()

    await message.reply("request accepted / booted VirtualMachine")
    await message.reply("ip address: " + ipAddress)
  }
}
