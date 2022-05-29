import { Checkout } from "./checkout";
import { Item } from "./item";
import { BulkPurchasePricingRule } from "./pricing-rules/bulk-purchase-pricing-rule";
import { BuyMultipleGetOneFreePricingRule } from "./pricing-rules/buy-multiple-get-one-free-pricing-rule";

test("should construct object correctly (empty)", () => {
  const co = new Checkout();
  expect(co.pricingRules).toEqual([]);
  expect(co.items).toEqual([]);
});

test("should construct object correctly", () => {
  const rules = [
    new BuyMultipleGetOneFreePricingRule(new Item("abc", "An item", 10), 2),
  ];
  const co = new Checkout(rules);
  expect(co.pricingRules).toBe(rules);
  expect(co.items).toEqual([]);
});

test("should add items to checkout via scan", () => {
  const co = new Checkout();
  const item = new Item("abc", "An item", 10);

  expect(co.items).toEqual([]);
  co.scan(item);
  expect(co.items).toEqual([item]);
});

test("should add items to checkout via scan", () => {
  const co = new Checkout();
  const item = new Item("abc", "An item", 10);

  expect(co.items).toEqual([]);
  co.scan(item);
  expect(co.items).toEqual([item]);
});

test("should apply discounts from pricing rules when generating total", () => {
  const item = new Item("ipd", "Super iPad", 549.99);
  const rule = new BulkPurchasePricingRule(item, 4, 499.99);
  const co = new Checkout([rule]);

  const ruleGetDiscountSpy = jest.spyOn(rule, "getDiscount");

  co.scan(item);
  co.scan(item);
  co.scan(item);
  co.scan(item);
  co.scan(item);
  expect(co.total()).toBe(2499.95);
  expect(ruleGetDiscountSpy).toHaveBeenCalledTimes(1);
  expect(ruleGetDiscountSpy).toHaveBeenCalledWith(co);
});

test.todo("tests with more rules");
test.todo("tests without rules");
test.todo("tests wherein the discount exceeds the total price");
