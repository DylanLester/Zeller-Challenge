import { Item } from "./item";
import { PricingRule } from "./pricing-rules/pricing-rule";

export class Checkout {
  pricingRules: PricingRule[];
  items: Item[] = [];

  constructor(pricingRules: PricingRule[] = []) {
    this.pricingRules = pricingRules;
  }

  public scan(item: Item): void {
    this.items.push(item);
  }

  public total(): number {
    const discount = this.pricingRules
      .map((pricingRule) => pricingRule.getDiscount(this))
      .reduce((acc, curr) => acc + curr, 0);
    const rawTotal = this.items.reduce((acc, curr) => acc + curr.price, 0);
    const total = rawTotal - discount;
    return Math.max(total, 0);
  }
}
