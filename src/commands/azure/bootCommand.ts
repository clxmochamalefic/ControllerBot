import { Message } from "discord.js";
import { ComputeManagementClient } from "@azure/arm-compute"
import { NetworkManagementClient } from "@azure/arm-network"
import { ClientSecretCredential } from "@azure/identity"

import Command from "../commandInterface";
import azureConfig from "../../config/azureConfig"

export class AzureBootCommand implements Command {
  commandNames = ["boot", "start", "powerOn"];

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}boot to boot virtual machine on MicrosoftAzure.`;
  }

  async run(message: Message): Promise<void> {
    await message.reply("request received / begin boot VirtualMachine")

    const credentials = new ClientSecretCredential(azureConfig.tenantId, azureConfig.clientId, azureConfig.secret)
    const computeClient = new ComputeManagementClient(credentials, azureConfig.subscriptionId)
    const beginStartResponse = await computeClient.virtualMachines.beginStart(azureConfig.resGroup, azureConfig.vmName)

    const response = await beginStartResponse.pollUntilDone();
    console.log(response)

    const networkClient = new NetworkManagementClient(credentials, azureConfig.subscriptionId)
    const publicIPAddresses = await networkClient.publicIPAddresses.list(azureConfig.resGroup);

    await message.reply("request accepted / booted VirtualMachine")
    for await (let x of publicIPAddresses) {
      if (x.name == azureConfig.networkName) {
        await message.reply("ip address: " + x.ipAddress)
      }
    }
  }
}
