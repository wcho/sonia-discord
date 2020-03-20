import { Client } from 'discord.js';
import _ from 'lodash';
import {
  chalkCyan,
  chalkRed,
  chalkWhite
} from '../logger/chalk';
import { Logger } from '../logger/logger';
import { DiscordSonia } from './discord-sonia';
import { DiscordClient } from './discord-client';

export class DiscordAuthentication {
  private static _instance: DiscordAuthentication;

  public static getInstance(): DiscordAuthentication {
    if (_.isNil(DiscordAuthentication._instance)) {
      DiscordAuthentication._instance = new DiscordAuthentication();
    }

    return DiscordAuthentication._instance;
  }

  private readonly _logger: Logger;
  private readonly _client: Client;
  private readonly _discordSonia: DiscordSonia;

  public constructor() {
    this._logger = Logger.getInstance();
    this._client = DiscordClient.getInstance().getClient();
    this._discordSonia = DiscordSonia.getInstance();

    this._init();
  }

  private _init(): void {
    this._listen();
    this._login();
  }

  private _listen(): void {
    this._client.on('ready', (): void => {
      if (!_.isNil(this._client.user)) {
        this._logger.log(this.constructor.name, chalkWhite(`authenticated as: ${chalkCyan(`"${this._client.user.tag}`)}"`));
      } else {
        this._logger.log(this.constructor.name, chalkWhite(`authenticated as: ${chalkCyan(`unknown user`)}`));
      }
    });
  }

  private _login(): void {
    this._client.login(this._discordSonia.getSoniaSecretToken()).then((): void => {
      this._logger.debug(this.constructor.name, chalkWhite(`authentication successful`));
    }).catch((error: unknown): void => {
      this._logger.error(this.constructor.name, chalkWhite(`authentication failed`));
      this._logger.error(this.constructor.name, chalkRed(error));
    });

    this._logger.debug(this.constructor.name, chalkWhite(`authenticating...`));
  }
}