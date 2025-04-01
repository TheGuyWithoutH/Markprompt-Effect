export class Tier {
  static readonly FREE = new Tier(2);
  static readonly PLUS = new Tier(4);
  static readonly PRO = new Tier(6);
  public readonly limit: number;

  private constructor(limit: number) {
    this.limit = limit;
  }

  static fromNumber(tier: number): Tier {
    switch (tier) {
      case 2:
        return Tier.FREE;
      case 4:
        return Tier.PLUS;
      case 6:
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
