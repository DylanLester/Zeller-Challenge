import { Checkout } from "../checkout";
import { Item } from "../item";
import { PricingRule } from "./pricing-rule";

export class BulkPurchasePricingRule implements PricingRule {
  item: Item;
  requiredQuantity: number;
  discountItemPrice: number;

  constructor(item: Item, requiredQuantity: number, discountItemPrice: number) {
    this.item = item;
    this.requiredQuantity = requiredQuantity;
    this.discountItemPrice = discountItemPrice;
  }

  public getDiscount(checkout: Checkout): number {
    const applicableItems = checkout.items.filter(
      (item) => item.sku === this.item.sku
    );

    const isRuleApplicable = applicableItems.length > this.requiredQuantity;
    if (!isRuleApplicable) return 0;

    const rawItemsTotal = applicableItems.length * this.item.price;
    const discountedItemsTotal =
      applicableItems.length * this.discountItemPrice;
    return rawItemsTotal - discountedItemsTotal;
  }
}
