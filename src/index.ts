import { BulkPurchasePricingRule } from "./pricing-rules/bulk-purchase-pricing-rule";
import { Checkout } from "./checkout";
import { Item } from "./item";
import { BuyMultipleGetOneFreePricingRule } from "./pricing-rules/buy-multiple-get-one-free-pricing-rule";

const superIpad = new Item("ipd", "Super iPad", 549.99);
const macBookPro = new Item("mbp", "MacBook Pro", 1399.99);
const appleTV = new Item("atv", "Apple TV", 109.5);
const vgaAdapter = new Item("vga", "VGA adapter", 30.0);

const appleTvSpecial = new BuyMultipleGetOneFreePricingRule(appleTV, 2);
const superIpadSpecial = new BulkPurchasePricingRule(superIpad, 4, 499.99);

const co = new Checkout([appleTvSpecial, superIpadSpecial]);
co.scan(superIpad);
co.scan(superIpad);
co.scan(superIpad);
co.scan(superIpad);
co.scan(superIpad);
const total = co.total();

console.log("total", total);
