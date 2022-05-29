import { Checkout } from "./checkout";
import { Item } from "./item";
import { BulkPurchasePricingRule } from "./pricing-rules/bulk-purchase-pricing-rule";
import { BuyMultipleGetOneFreePricingRule } from "./pricing-rules/buy-multiple-get-one-free-pricing-rule";

const superIpad = new Item("ipd", "Super iPad", 549.99);
const macBookPro = new Item("mbp", "MacBook Pro", 1399.99);
const appleTV = new Item("atv", "Apple TV", 109.5);
const vgaAdapter = new Item("vga", "VGA adapter", 30.0);

const checkoutFactory = () => {
  const appleTvSpecial = new BuyMultipleGetOneFreePricingRule(appleTV, 2);
  const superIpadSpecial = new BulkPurchasePricingRule(superIpad, 4, 499.99);

  return new Checkout([appleTvSpecial, superIpadSpecial]);
};

test("example scenario 1", () => {
  const co = checkoutFactory();
  co.scan(appleTV);
  co.scan(appleTV);
  co.scan(appleTV);
  co.scan(vgaAdapter);
  expect(co.total()).toBe(249);
});

test("example scenario 2", () => {
  const co = checkoutFactory();
  co.scan(appleTV);
  co.scan(superIpad);
  co.scan(superIpad);
  co.scan(appleTV);
  co.scan(superIpad);
  co.scan(superIpad);
  co.scan(superIpad);
  expect(co.total()).toBe(2718.95);
});
