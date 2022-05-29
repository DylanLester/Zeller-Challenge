import cases from "jest-in-case";
import { Checkout } from "../checkout";
import { Item } from "../item";
import { BuyMultipleGetOneFreePricingRule } from "./buy-multiple-get-one-free-pricing-rule";

const item = new Item("abc", "An item", 10);
const requiredQuantity = 2;
const rule = new BuyMultipleGetOneFreePricingRule(item, requiredQuantity);

test("should construct object correctly", () => {
  expect(rule.item).toBe(item);
  expect(rule.requiredQuantity).toBe(requiredQuantity);
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
        return co;
      },
    },
    {
      name: "correct number of items but not matching SKU",
      input: () => {
        const co = new Checkout([rule]);
        co.scan(item);
        co.scan(new Item("not abc", "An item", 10));
        return co;
      },
    },
  ]
);

cases<{ name: string; input: () => Checkout; output: number }>(
  "should produce the same discount for applicable checkout's regardless of item quantity",
  (opts) => {
    const discount = rule.getDiscount(opts.input());
    expect(discount).toBe(opts.output);
  },
  [
    {
      name: "3 valid items",
      input: () => {
        const co = new Checkout([rule]);
        co.scan(item);
        co.scan(item);
        co.scan(item);
        return co;
      },
      output: item.price,
    },
    {
      name: "4 valid items",
      input: () => {
        const co = new Checkout([rule]);
        co.scan(item);
        co.scan(item);
        co.scan(item);
        return co;
      },
      output: item.price,
    },
  ]
);

test("should ignore unrelated items when getting discount", () => {
  const co = new Checkout([rule]);
  co.scan(item);
  co.scan(item);
  co.scan(item);
  co.scan(new Item("not abc", "An item", 10));
  co.scan(new Item("not abc", "An item", 10));
  co.scan(new Item("not abc", "An item", 10));
  co.scan(new Item("not abc123", "An item", 10));
  const discount = rule.getDiscount(co);
  expect(discount).toBe(item.price);
});
