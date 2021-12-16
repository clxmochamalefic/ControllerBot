import { Message } from "discord.js";
import { ComputeManagementClient, InstanceViewStatus } from "@azure/arm-compute"
import { NetworkManagementClient } from "@azure/arm-network"
import { ClientSecretCredential } from "@azure/identity"

import Command from "../commandInterface";
import azureConfig from "../../config/azureConfig"

export class AzureStatusCommand implements Command {
  commandNames = ["status", "stat"];

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}status to status of virtual machine on MicrosoftAzure.`;
  }

  async run(message: Message): Promise<void> {
    await message.reply("request received / fetch VirtualMachine status")

    const credentials = new ClientSecretCredential(azureConfig.tenantId, azureConfig.clientId, azureConfig.secret)
    const computeClient = new ComputeManagementClient(credentials, azureConfig.subscriptionId)
    const instanceViewResponse = await computeClient.virtualMachines.instanceView(azureConfig.resGroup, azureConfig.vmName);
    const instanceResponse = await computeClient.virtualMachines.get(azureConfig.resGroup, azureConfig.vmName);

    const networkClient = new NetworkManagementClient(credentials, azureConfig.subscriptionId)
    const publicIPAddresses = await networkClient.publicIPAddresses.list(azureConfig.resGroup);

    await message.reply("request accepted / show status below")
    const statuses = instanceViewResponse.statuses as InstanceViewStatus[]
    for (let stat of statuses) {
      await message.reply("statuses: " + stat.displayStatus)
    }

    for await (let x of publicIPAddresses) {
      if (x.name == azureConfig.networkName) {
        await message.reply("ip address: " + x.ipAddress)
      }
    }
  }
}
