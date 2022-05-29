import { Checkout } from "../checkout";

export interface PricingRule {
  getDiscount(checkout: Checkout): number;
}
