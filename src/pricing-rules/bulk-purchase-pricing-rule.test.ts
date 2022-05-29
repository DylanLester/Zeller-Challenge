import cases from "jest-in-case";
import { Checkout } from "../checkout";
import { Item } from "../item";
import { BulkPurchasePricingRule } from "./bulk-purchase-pricing-rule";

const item = new Item("abc", "An item", 10);
const requiredQuantity = 4;
const discount = 1;
const rule = new BulkPurchasePricingRule(item, requiredQuantity, discount);

test("should construct object correctly", () => {
  expect(rule.item).toBe(item);
  expect(rule.requiredQuantity).toBe(requiredQuantity);
  expect(rule.discountItemPrice).toBe(1);
});

cases<{ name: string; input: () => Checkout }>(
  "should produce a discount of 0 for non-applicable checkout's",
  (opts) => {
    const discount = rule.getDiscount(opts.input());
    expect(discount).toBe(0);
  },
  [
    {
      name: "no items",
      input: () => {
        const co = new Checkout([rule]);
        return co;
      },
    },
    {
      name: "items under required quantity",
      input: () => {
        const co = new Checkout([rule]);
        co.scan(item);
        co.scan(item);
        co.scan(item);
        co.scan(item);
        return co;
      },
    },
    {
      name: "correct number of items but not matching SKU",
      input: () => {
        const co = new Checkout([rule]);
        co.scan(item);
        co.scan(item);
        co.scan(item);
        co.scan(new Item("not abc", "An item", 10));
        return co;
      },
    },
  ]
);

cases<{ name: string; input: () => Checkout; output: number }>(
  "should produce a discount for applicable checkout's",
  (opts) => {
    const discount = rule.getDiscount(opts.input());
    expect(discount).toBe(opts.output);
  },
  [
    {
      name: "4 valid items",
      input: () => {
        const co = new Checkout([rule]);
        co.scan(item);
        co.scan(item);
        co.scan(item);
        co.scan(item);
        co.scan(item);
        return co;
      },
      output: 45,
    },
    {
      name: "5 valid items",
      input: () => {
        const co = new Checkout([rule]);
        co.scan(item);
        co.scan(item);
        co.scan(item);
        co.scan(item);
        co.scan(item);
        co.scan(item);
        return co;
      },
      output: 54,
    },
  ]
);

test("should ignore unrelated items when getting discount", () => {
  const co = new Checkout([rule]);
  co.scan(item);
  co.scan(item);
  co.scan(item);
  co.scan(item);
  co.scan(item);
  co.scan(new Item("not abc", "An item", 10));
  co.scan(new Item("not abc", "An item", 10));
  co.scan(new Item("not abc123", "An item", 10));
  const discount = rule.getDiscount(co);
  expect(discount).toBe(45);
});
