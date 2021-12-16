import { Message } from "discord.js";

export type ScbMessage = {
  user: string,
  message: string,
}

class PushPopMessage {
  private messages: ScbMessage[] = []

  public push(message: Message): void {
    this.messages.push({
        user: message.author.username,
        message: message.content,
    })
  }

  public pop(): ScbMessage {
    return this.messages.pop() as ScbMessage;
  }
}

export const pushPopMessage = new PushPopMessage()
