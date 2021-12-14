import Command from "./commandInterface";
import { Message } from "discord.js";

export class ListCommand implements Command {
  commandNames = ["", "list", "help"];

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}echo to get same message.`;
  }

  async run(message: Message): Promise<void> {
    await message.reply(
      "Usage: \n"
    + "!scb <sub command>" + " \n"
    + "" + " \n"
    + "sub commands" + " \n"
    + "- BASIC" + " \n"
    + "    - greet / hello          => show greeting (あいさつするだけのコマンド)" + " \n"
    + "    - time                   => show now (current time) (現在時刻を表示するコマンド)" + " \n"
    + "    - echo / print           => echo (オウム返しコマンド)" + " \n"
    + "    - <no sub> / list / help => show command list (コマンドリストを表示するコマンド)" + " \n"
    + "" + " \n"
    + "    - !hage / hage => DON'T SAY THAT AGAIN" + " \n"
    + "" + " \n"
    + "- MINECRAFT SERVER CONTROL" + " \n"
    + "    - boot / start / powerOn            => start server command (サーバ起動コマンド)" + " \n"
    + "    - stop / shutdown / powerOff / halt => stop server command (サーバ終了コマンド)" + " \n"
    + "    - reboot / restart => restart server command (サーバ再起動コマンド)" + " \n"
    + "" + " \n"
    + "EXAMPLES: " + " \n"
    + "!scb echo !hage " + " \n"
    + "!scb boot " + " \n"
    + "!scb halt " + " \n"
    );
  }
}
