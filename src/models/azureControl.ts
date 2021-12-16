import { ComputeManagementClient, InstanceViewStatus } from "@azure/arm-compute"
import { NetworkManagementClient } from "@azure/arm-network"
import { ClientSecretCredential } from "@azure/identity"
import { AbortController } from "@azure/abort-controller";

import azureConfig from "../config/azureConfig"

export class AzureControl {
  static credentials: ClientSecretCredential = new ClientSecretCredential(azureConfig.tenantId, azureConfig.clientId, azureConfig.secret)
  static computeClient: ComputeManagementClient = new ComputeManagementClient(AzureControl.credentials, azureConfig.subscriptionId)
  static networkClient = new NetworkManagementClient(AzureControl.credentials, azureConfig.subscriptionId)

  static async boot(): Promise<string> {
    const beginStartResponse = await AzureControl.computeClient.virtualMachines.beginStart(azureConfig.resGroup, azureConfig.vmName)

    const response = await beginStartResponse.pollUntilDone();
    console.log(response)

    const publicIPAddresses = await AzureControl.networkClient.publicIPAddresses.list(azureConfig.resGroup);

    for await (let x of publicIPAddresses) {
      if (x.name == azureConfig.networkName) {
        return x.ipAddress as string
      }
    }

    return "";
  }

  static async halt(): Promise<void> {
    const abortController = new AbortController();
    const beginStartResponse = await AzureControl.computeClient.virtualMachines.beginDeallocate(azureConfig.resGroup, azureConfig.vmName, { abortSignal: abortController.signal })
    const response = await beginStartResponse.pollUntilDone();
  }

  static async reboot(): Promise<string> {
    await AzureControl.halt();
    return AzureControl.boot();
  }

  static async status(): Promise<string[]> {
    const instanceViewResponse = await AzureControl.computeClient.virtualMachines.instanceView(azureConfig.resGroup, azureConfig.vmName);
    const publicIPAddresses = await AzureControl.networkClient.publicIPAddresses.list(azureConfig.resGroup);

    const statuses = instanceViewResponse.statuses as InstanceViewStatus[]
    const resultStatuses: string[] = [];
    for (let stat of statuses) {
      resultStatuses.push("status: " + stat.displayStatus)
    }

    for await (let network of publicIPAddresses) {
      if (network.name == azureConfig.networkName) {
        resultStatuses.push("ip address: " + network.ipAddress)
        break;
      }
    }

    return resultStatuses
  }
}
