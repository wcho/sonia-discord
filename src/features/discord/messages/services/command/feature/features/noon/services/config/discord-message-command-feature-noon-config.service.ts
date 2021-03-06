import _ from "lodash";
import { AbstractService } from "../../../../../../../../../../classes/services/abstract.service";
import { ColorEnum } from "../../../../../../../../../../enums/color.enum";
import { IconEnum } from "../../../../../../../../../../enums/icon.enum";
import { ServiceNameEnum } from "../../../../../../../../../../enums/service-name.enum";
import { IDiscordMessageCommandFeatureConfig } from "../../interfaces/discord-message-command-feature-config";
import { IDiscordMessageCommandFeatureNoonConfig } from "../../interfaces/discord-message-command-feature-noon-config";
import { DiscordMessageCommandFeatureNoonConfigCoreService } from "./discord-message-command-feature-noon-config-core.service";

export class DiscordMessageCommandFeatureNoonConfigService extends AbstractService {
  private static _instance: DiscordMessageCommandFeatureNoonConfigService;

  public static getInstance(): DiscordMessageCommandFeatureNoonConfigService {
    if (_.isNil(DiscordMessageCommandFeatureNoonConfigService._instance)) {
      DiscordMessageCommandFeatureNoonConfigService._instance = new DiscordMessageCommandFeatureNoonConfigService();
    }

    return DiscordMessageCommandFeatureNoonConfigService._instance;
  }

  public constructor() {
    super(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_NOON_CONFIG_SERVICE);
  }

  public getConfig(): IDiscordMessageCommandFeatureConfig {
    return {
      noon: this.getNoonConfig(),
    };
  }

  public getNoonConfig(): IDiscordMessageCommandFeatureNoonConfig {
    return DiscordMessageCommandFeatureNoonConfigCoreService.getInstance().noon;
  }

  public getNoonConfigImageColor(): ColorEnum {
    return DiscordMessageCommandFeatureNoonConfigCoreService.getInstance().noon
      .imageColor;
  }

  public getNoonConfigImageUrl(): IconEnum {
    return DiscordMessageCommandFeatureNoonConfigCoreService.getInstance().noon
      .imageUrl;
  }
}
