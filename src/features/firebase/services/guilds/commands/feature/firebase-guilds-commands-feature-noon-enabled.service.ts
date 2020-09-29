import { Guild, TextChannel } from "discord.js";
import admin from "firebase-admin";
import _ from "lodash";
import { AbstractService } from "../../../../../../classes/services/abstract.service";
import { ServiceNameEnum } from "../../../../../../enums/service-name.enum";
import { ChalkService } from "../../../../../logger/services/chalk/chalk.service";
import { LoggerService } from "../../../../../logger/services/logger.service";
import { IFirebaseGuild } from "../../../../types/guilds/firebase-guild";
import { IFirebaseGuildVFinal } from "../../../../types/guilds/firebase-guild-v-final";
import { FirebaseGuildsService } from "../../firebase-guilds.service";
import CollectionReference = admin.firestore.CollectionReference;
import WriteResult = admin.firestore.WriteResult;

export class FirebaseGuildsCommandsFeatureNoonEnabledService extends AbstractService {
  private static _instance: FirebaseGuildsCommandsFeatureNoonEnabledService;

  public static getInstance(): FirebaseGuildsCommandsFeatureNoonEnabledService {
    if (_.isNil(FirebaseGuildsCommandsFeatureNoonEnabledService._instance)) {
      FirebaseGuildsCommandsFeatureNoonEnabledService._instance = new FirebaseGuildsCommandsFeatureNoonEnabledService();
    }

    return FirebaseGuildsCommandsFeatureNoonEnabledService._instance;
  }

  public constructor() {
    super(
      ServiceNameEnum.FIREBASE_GUILDS_COMMANDS_FEATURE_NOON_ENABLED_SERVICE
    );
  }

  public updateState(
    id: Readonly<Guild["id"]>,
    channelId: Readonly<TextChannel["id"]>,
    isEnabled: Readonly<boolean>
  ): Promise<WriteResult> {
    const collectionReference:
      | CollectionReference<IFirebaseGuild>
      | undefined = FirebaseGuildsService.getInstance().getCollectionReference();

    if (!_.isNil(collectionReference)) {
      LoggerService.getInstance().debug({
        context: this._serviceName,
        message: ChalkService.getInstance().text(
          `updating Firebase guild noon feature enabled state...`
        ),
      });

      return collectionReference
        .doc(id)
        .update(this.getUpdatedGuild(channelId, isEnabled))
        .then(
          (writeResult: Readonly<WriteResult>): Promise<WriteResult> => {
            LoggerService.getInstance().success({
              context: this._serviceName,
              message: ChalkService.getInstance().text(
                `Firebase guild ${ChalkService.getInstance().value(
                  id
                )} noon feature enabled state updated to ${ChalkService.getInstance().value(
                  isEnabled
                )}`
              ),
            });

            return Promise.resolve(writeResult);
          }
        );
    }

    return Promise.reject(new Error(`Collection not available`));
  }

  public getUpdatedGuild(
    id: Readonly<TextChannel["id"]>,
    isEnabled: Readonly<boolean>
  ): Partial<IFirebaseGuildVFinal> {
    return {
      channels: {
        0: {
          features: {
            noon: {
              isEnabled,
            },
          },
          id,
        },
      },
    };
  }
}
