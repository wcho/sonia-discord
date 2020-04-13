import { GuildChannel } from "discord.js";
import _ from "lodash";
import { wrapInQuotes } from "../../../../functions/formatters/wrap-in-quotes";
import { AppConfigService } from "../../../app/services/config/app-config-service";
import { ChalkService } from "../../../logger/services/chalk-service";
import { LoggerService } from "../../../logger/services/logger-service";
import { ProfileConfigService } from "../../../profile/services/config/profile-config-service";
import { isDiscordGuildChannel } from "../../channels/functions/is-discord-guild-channel";
import { DiscordChannelGuildService } from "../../channels/services/discord-channel-guild-service";
import { AnyDiscordChannel } from "../../channels/types/any-discord-channel";
import { addDiscordDevPrefix } from "../../functions/add-discord-dev-prefix";
import { IDiscordMessageResponse } from "../../messages/interfaces/discord-message-response";
import { DiscordClientService } from "../../services/discord-client-service";
import { isDiscordGuild } from "../functions/is-discord-guild";
import { AnyGuildMember } from "../types/any-guild-member";
import { DiscordGuildConfigService } from "./config/discord-guild-config-service";

export class DiscordGuildMemberAddService {
  private static _instance: DiscordGuildMemberAddService;

  public static getInstance(): DiscordGuildMemberAddService {
    if (_.isNil(DiscordGuildMemberAddService._instance)) {
      DiscordGuildMemberAddService._instance = new DiscordGuildMemberAddService();
    }

    return DiscordGuildMemberAddService._instance;
  }

  private readonly _discordClientServiceClient = DiscordClientService.getInstance().getClient();
  private readonly _discordChannelGuildService = DiscordChannelGuildService.getInstance();
  private readonly _discordGuildConfigService = DiscordGuildConfigService.getInstance();
  private readonly _loggerService = LoggerService.getInstance();
  private readonly _profileConfigService = ProfileConfigService.getInstance();
  private readonly _chalkService = ChalkService.getInstance();
  private readonly _appConfigService = AppConfigService.getInstance();
  private readonly _className = `DiscordGuildMemberAddService`;

  public constructor() {
    this.init();
  }

  public init(): void {
    this._listen();
  }

  private _listen(): void {
    this._discordClientServiceClient.on(
      `guildMemberAdd`,
      (member: Readonly<AnyGuildMember>): void => {
        this._handleGuildMemberAdd(member);
      }
    );

    this._loggerService.debug({
      context: this._className,
      message: this._chalkService.text(
        `listen ${wrapInQuotes(`guildMemberAdd`)} event`
      ),
    });
  }

  private _handleGuildMemberAdd(member: Readonly<AnyGuildMember>): void {
    if (this._discordGuildConfigService.shouldWelcomeNewMembers()) {
      const primaryChannel: GuildChannel | null = this._getPrimaryChannel(
        member
      );

      if (isDiscordGuildChannel(primaryChannel)) {
        this._sendMessage(primaryChannel, member);
      }
    }
  }

  private _sendMessage(
    channel: Readonly<GuildChannel>,
    member: Readonly<AnyGuildMember>
  ): void {
    const messageResponse: IDiscordMessageResponse = this._getMessageResponse(
      member
    );

    this._loggerService.debug({
      context: this._className,
      message: this._chalkService.text(
        `sending message for the new guild member...`
      ),
    });

    (channel as AnyDiscordChannel)
      .send(messageResponse.response, messageResponse.options)
      .then((): void => {
        this._loggerService.log({
          context: this._className,
          message: this._chalkService.text(
            `welcome message for the new guild sent`
          ),
        });
      })
      .catch((error: unknown): void => {
        this._loggerService.error({
          context: this._className,
          message: this._chalkService.text(
            `message sending for the new guild member failed`
          ),
        });
        this._loggerService.error({
          context: this._className,
          message: this._chalkService.error(error),
        });
      });
  }

  private _getMessageResponse(
    member: Readonly<AnyGuildMember>
  ): IDiscordMessageResponse {
    return {
      response: this._getMessageResponseWithEnvPrefix(
        `Bienvenue **${member.displayName}**, il est midi !`
      ),
    };
  }

  private _getMessageResponseWithEnvPrefix(response: Readonly<string>): string {
    if (!this._appConfigService.isProduction()) {
      return addDiscordDevPrefix(
        response,
        this._profileConfigService.getNickname()
      );
    }

    return response;
  }

  private _getPrimaryChannel(
    member: Readonly<AnyGuildMember>
  ): GuildChannel | null {
    if (isDiscordGuild(member.guild)) {
      const primaryChannel:
        | GuildChannel
        | undefined = member.guild.channels.cache.find(
        (channel: Readonly<GuildChannel>): boolean => {
          return this._discordChannelGuildService.isGeneral(channel);
        }
      );

      if (isDiscordGuildChannel(primaryChannel)) {
        return primaryChannel;
      }
    }

    return null;
  }
}
