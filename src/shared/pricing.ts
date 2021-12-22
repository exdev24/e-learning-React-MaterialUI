import { CouponType, coursePerUnitPrice, regularPerUnitPrice } from 'cl-common';
import { IDVars, Promotion } from '../types';

interface ClassWithCourse extends IDVars {
  course: {
    level: number;
    price: number;
  };
}

interface PriceChange {
  result: number;
  used: number;
}

export interface PriceBreakdown {
  listingPrice: number;
  price: number;
  usedCredit: number;
  courseDiscount: number;
  promoDiscount: number;
}

export function formatCents(cents: number) {
  return '$' + (cents / 100).toFixed(2);
}

export const savingPerUnitInPacakge = regularPerUnitPrice - coursePerUnitPrice;
export const savingPercentageInPackage = Math.round(
  (savingPerUnitInPacakge / regularPerUnitPrice) * 100
);

export function getPackagePrice(courses: ClassWithCourse['course'][]) {
  return [courses.length * regularPerUnitPrice, courses.length * coursePerUnitPrice];
}

export function getTotalPriceInCents(klasses: ClassWithCourse[]) {
  let price = 0;

  if (klasses.length === 1) {
    price = klasses[0].course.price;
  } else {
    price = klasses.reduce((total, k) => total + k.course.price, 0);
  }

  return price * 100;
}

export function applyCredit(
  priceInCents: number,
  amountInCents: number
): PriceChange {
  if (amountInCents <= 0) {
    throw Error('discount should be larger than 0');
  }

  return amountInCents < priceInCents
    ? {
        result: priceInCents - amountInCents,
        used: amountInCents
      }
    : {
        result: 0,
        used: priceInCents
      };
}

export function applyPromo(
  priceInCents: number,
  promo: Promotion,
  bundleSize: number
): PriceChange {
  let amount = promo.amount;

  if (bundleSize > 1 && promo.amountInPackage) {
    amount = promo.amountInPackage;
  }

  if (promo.type === CouponType.AmountOff) {
    return applyCredit(priceInCents, Math.floor(amount * 100));
  }

  let amountUsed = 0;
  if (amount >= 0 && amount <= 100) {
    amountUsed = Math.floor((priceInCents * amount) / 100);
  }

  return {
    result: priceInCents - amountUsed,
    used: amountUsed
  };
}

export function describeCoupon(promo: Promotion, bundleSize: number) {
  let amount = promo.amount;

  if (bundleSize > 1 && promo.amountInPackage) {
    amount = promo.amountInPackage;
  }

  if (promo.type === CouponType.AmountOff) {
    return `$${amount} off`;
  }

  return amount >= 100 ? 'Free' : `${amount}% off`;
}

// scenario 1, user buys a single class for $129
// scenario 2, user buys multiple level classes for $129 * count, this is the old upsale flow
// scenario 3, user buys the whole series for $95 * count, this is the new course price
export function getPriceBreakdown(
  klasses: ClassWithCourse[],
  opts: {
    balanceInCents: number;
    promotion?: Promotion;
    wholePackage?: boolean;
  }
): PriceBreakdown {
  const listingPrice = getTotalPriceInCents(klasses);

  let price = listingPrice;
  let usedCredit = 0;
  let courseDiscount = 0;
  let promoDiscount = 0;

  if (price > 0) {
    if (opts.promotion) {
      const promoData = applyPromo(price, opts.promotion, klasses.length);
      promoDiscount = promoData.used;
      price = promoData.result;
    } else if (opts.wholePackage) {
      const wholeCoursePrice = klasses.length * coursePerUnitPrice * 100;
      courseDiscount = price - wholeCoursePrice;
      price = wholeCoursePrice;
    }
  }

  if (price > 0 && opts.balanceInCents > 0) {
    const pc = applyCredit(price, opts.balanceInCents);
    price = pc.result;
    usedCredit = pc.used;
  }

  return {
    price,
    listingPrice,
    usedCredit,
    courseDiscount,
    promoDiscount
  };
}
