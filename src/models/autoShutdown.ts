import "dotenv/config"

import { Message } from "discord.js";

import { AzureControl } from "./azureControl"

export class AutoShutdown {
  private autoShutdownTimerId: ReturnType<typeof setTimeout>|null = null
  private announceTimerId: ReturnType<typeof setTimeout>|null = null
  private requestMessage: Message|null = null

  async update(message: Message): Promise<void> {
    const shutdownInitMinutes: number = (Number(process.env.AUTOSHUTDOWN_INIT_MINUTES) || 120) * 60 * 1000
    const shutdownExtraMinutes: number = (Number(process.env.AUTOSHUTDOWN_EXTRA_MINUTES) || 60) * 60 * 1000
    const announceMinutes: number = (Number(process.env.AUTOSHUTDOWN_ANOUNCE_MINUTES) || 10) * 60 * 1000

    const isFirst = this.autoShutdownTimerId === null
    const shutdownMinutes = isFirst ? shutdownInitMinutes : shutdownExtraMinutes

    this.requestMessage = message

    if (this.autoShutdownTimerId !== null) {
      clearTimeout(this.autoShutdownTimerId)
    }
    if (this.announceTimerId !== null) {
      clearTimeout(this.announceTimerId)
    }

    this.autoShutdownTimerId = setTimeout(async (): Promise<void> => {
      if (this.requestMessage !== null) {
        await this.requestMessage.reply("begin shutdown VirtualMachine")
      }
      await AzureControl.halt();
      if (this.requestMessage !== null) {
        await this.requestMessage.reply("completed shutdown / ( (o=_=) THANK YOU FOR YOUR PLAYING, SEE YA AGAIN!!")
      }
    }, shutdownMinutes)

    this.announceTimerId = setTimeout(async (): Promise<void> => {
      if (this.requestMessage !== null) {
        const announceRowMinutes: number = Number(process.env.AUTOSHUTDOWN_ANOUNCE_MINUTES) || 10
        await this.requestMessage.reply("EN( (o0_0) oO( " + announceRowMinutes + " minutes before stop the VirtualMachine, do you want to extend? )")
        await this.requestMessage.reply("JA( (o0_0) oO( VirtualMachine停止 " + announceRowMinutes + " 分前です、延長しますか？ )")
      }
    }, shutdownMinutes - announceMinutes)

    if (!isFirst) {
        const shutdownExtraRowMinutes: number = Number(process.env.AUTOSHUTDOWN_EXTRA_MINUTES) || 60
        await this.requestMessage.reply("EN( (o0_<) oO ( ENTERED EXTRA OPERATION: " + shutdownExtraRowMinutes + " min )")
        await this.requestMessage.reply("JA( (o0_<) oO ( " + shutdownExtraRowMinutes + "分延長入りました～☆ )")
    }
  }

  clear(): void {
    if (this.autoShutdownTimerId !== null) {
      clearTimeout(this.autoShutdownTimerId)
      this.autoShutdownTimerId = null
    }
    if (this.announceTimerId !== null) {
      clearTimeout(this.announceTimerId)
      this.announceTimerId = null
    }
  }
}

export const autoShutdown = new AutoShutdown()
