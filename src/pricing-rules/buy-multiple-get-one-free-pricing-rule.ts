import { Checkout } from "../checkout";
import { Item } from "../item";
import { PricingRule } from "./pricing-rule";

export class BuyMultipleGetOneFreePricingRule implements PricingRule {
  item: Item;
  requiredQuantity: number;

  constructor(item: Item, requiredQuantity: number) {
    this.item = item;
    this.requiredQuantity = requiredQuantity;
  }

  public getDiscount(checkout: Checkout): number {
    const applicableItems = checkout.items.filter(
      (item) => item.sku === this.item.sku
    );

    const isRuleApplicable = applicableItems.length > this.requiredQuantity;
    if (!isRuleApplicable) return 0;

    return this.item.price;
  }
}
