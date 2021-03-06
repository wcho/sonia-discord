import { DMChannel, NewsChannel, TextChannel } from "discord.js";
import _ from "lodash";
import { AbstractService } from "../../../../classes/services/abstract.service";
import { ServiceNameEnum } from "../../../../enums/service-name.enum";
import { isDiscordDmChannel } from "../functions/is-discord-dm-channel";
import { isDiscordTextChannel } from "../functions/is-discord-text-channel";
import { IAnyDiscordChannel } from "../types/any-discord-channel";

export class DiscordChannelService extends AbstractService {
  private static _instance: DiscordChannelService;

  public static getInstance(): DiscordChannelService {
    if (_.isNil(DiscordChannelService._instance)) {
      DiscordChannelService._instance = new DiscordChannelService();
    }

    return DiscordChannelService._instance;
  }

  public constructor() {
    super(ServiceNameEnum.DISCORD_CHANNEL_SERVICE);
  }

  public isValid(
    channel: Readonly<TextChannel | DMChannel | NewsChannel | null | undefined>
  ): channel is IAnyDiscordChannel {
    if (this.isText(channel)) {
      return true;
    } else if (this.isDm(channel)) {
      return true;
    }

    return false;
  }

  public isText(
    channel: Readonly<TextChannel | DMChannel | NewsChannel | null | undefined>
  ): channel is TextChannel {
    return isDiscordTextChannel(channel);
  }

  public isDm(
    channel: Readonly<TextChannel | DMChannel | NewsChannel | null | undefined>
  ): channel is DMChannel {
    return isDiscordDmChannel(channel);
  }
}
