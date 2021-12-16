import { Message } from "discord.js";
import { AbortController } from "@azure/abort-controller";
import { ComputeManagementClient } from "@azure/arm-compute"
import { ClientSecretCredential } from "@azure/identity"

import Command from "../commandInterface";
import azureConfig from "../../config/azureConfig"

export class AzureRebootCommand implements Command {
  commandNames = ["reboot", "restart"];

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}reboot to reboot virtual machine on MicrosoftAzure.`;
  }

  async run(message: Message): Promise<void> {
    await message.reply("request received / begin reboot VirtualMachine")

    const abortController = new AbortController();

    const credentials = new ClientSecretCredential(azureConfig.tenantId, azureConfig.clientId, azureConfig.secret)
    const computeClient = new ComputeManagementClient(credentials, azureConfig.subscriptionId)
    const pollDeallocateResponse = await computeClient.virtualMachines.beginDeallocate(azureConfig.resGroup, azureConfig.vmName, { abortSignal: abortController.signal })

    const response = await pollDeallocateResponse.pollUntilDone();

    await message.reply("reboot progress are 50%")

    const pollStartResponse = await computeClient.virtualMachines.beginStart(azureConfig.resGroup, azureConfig.vmName)
    const startResponse = await pollStartResponse.pollUntilDone();

    await message.reply("request accepted / rebooted VirtualMachine")
  }
}
