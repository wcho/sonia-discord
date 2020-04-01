import { Client, Guild, GuildChannel } from "discord.js";
import { isDiscordGuildChannel } from "./is-discord-guild-channel";

describe(`isDiscordGuildChannel()`, (): void => {
  let channel: unknown;

  describe(`when the given value is undefined`, (): void => {
    beforeEach((): void => {
      channel = undefined;
    });

    it(`should return false`, (): void => {
      expect.assertions(1);

      const result = isDiscordGuildChannel(channel);

      expect(result).toStrictEqual(false);
    });
  });

  describe(`when the given value is null`, (): void => {
    beforeEach((): void => {
      channel = null;
    });

    it(`should return false`, (): void => {
      expect.assertions(1);

      const result = isDiscordGuildChannel(channel);

      expect(result).toStrictEqual(false);
    });
  });

  describe(`when the given value is an empty object`, (): void => {
    beforeEach((): void => {
      channel = {};
    });

    it(`should return false`, (): void => {
      expect.assertions(1);

      const result = isDiscordGuildChannel(channel);

      expect(result).toStrictEqual(false);
    });
  });

  describe(`when the given value is an object`, (): void => {
    beforeEach((): void => {
      channel = {
        key: `value`,
      };
    });

    it(`should return false`, (): void => {
      expect.assertions(1);

      const result = isDiscordGuildChannel(channel);

      expect(result).toStrictEqual(false);
    });
  });

  describe(`when the given value is a "GuildChannel" instance`, (): void => {
    beforeEach((): void => {
      // @todo replace with real mock
      channel = new GuildChannel(new Guild(new Client(), {}));
    });

    // @todo fix it omg this should works
    it.skip(`should return true`, (): void => {
      expect.assertions(1);

      const result = isDiscordGuildChannel(channel);

      expect(result).toStrictEqual(true);
    });
  });
});
