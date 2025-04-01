import { Tier } from "./tiers.js";

/**
 * Class representing a user.
 */
class User {
  readonly id: string;
  readonly username: string;
  readonly tier: Tier;

  constructor(id: string, username: string, tier: Tier) {
    this.id = id;
    this.username = username;
    this.tier = tier;
  }

  clone(): User {
    return new User(this.id, this.username, this.tier);
  }
}

export default User;
