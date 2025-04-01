export class Tier {
  static readonly FREE = new Tier(1);
  static readonly PLUS = new Tier(2);
  static readonly PRO = new Tier(3);
  public readonly limit: number;

  private constructor(limit: number) {
    this.limit = limit;
  }

  static fromString(tier: string): Tier {
    switch (tier) {
      case "FREE":
        return Tier.FREE;
      case "PLUS":
        return Tier.PLUS;
      case "PRO":
        return Tier.PRO;
      default:
        throw new Error(`Unknown tier: ${tier}`);
    }
  }

  toString(): string {
    switch (this) {
      case Tier.FREE:
        return "FREE";
      case Tier.PLUS:
        return "PLUS";
      case Tier.PRO:
        return "PRO";
      default:
        throw new Error(`Unknown tier: ${this}`);
    }
  }
}
