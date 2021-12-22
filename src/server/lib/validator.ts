import { defaultTimezone } from 'cl-common';
import { getTimezone } from 'countries-and-timezones';
import { MxRecord, resolveMx } from 'dns';
import { suggest, validate } from 'email-butler';
import { CountryCode, parsePhoneNumberFromString } from 'libphonenumber-js/mobile';

export const domains = [
  'aol.com',
  'att.net',
  'comcast.net',
  'facebook.com',
  'gmail.com',
  'gmx.com',
  'googlemail.com',
  'google.com',
  'hotmail.com',
  'hotmail.co.uk',
  'mac.com',
  'me.com',
  'mail.com',
  'msn.com',
  'live.com',
  'sbcglobal.net',
  'verizon.net',
  'yahoo.com',
  'yahoo.co.uk',

  /* Other global domains */
  'email.com',
  'fastmail.fm',
  'games.com' /* AOL */,
  'gmx.net',
  'hush.com',
  'hushmail.com',
  'icloud.com',
  'iname.com',
  'inbox.com',
  'lavabit.com',
  'love.com' /* AOL */,
  'outlook.com',
  'pobox.com',
  'protonmail.ch',
  'protonmail.com',
  'tutanota.de',
  'tutanota.com',
  'tutamail.com',
  'tuta.io',
  'keemail.me',
  'rocketmail.com' /* Yahoo */,
  'safe-mail.net',
  'wow.com' /* AOL */,
  'ygm.com' /* AOL */,
  'ymail.com' /* Yahoo */,
  'zoho.com',
  'yandex.com',

  /* United States ISP domains */
  'bellsouth.net',
  'charter.net',
  'cox.net',
  'earthlink.net',
  'juno.com',
  /* Domains used in Asia */
  'sina.com',
  'sina.cn',
  'qq.com',
  'naver.com',
  'hanmail.net',
  'daum.net',
  'nate.com',
  'yahoo.co.jp',
  'yahoo.co.kr',
  'yahoo.co.id',
  'yahoo.co.in',
  'yahoo.com.sg',
  'yahoo.com.ph',
  '163.com',
  'yeah.net',
  '126.com',
  '21cn.com',
  'aliyun.com',
  'foxmail.com',
  /* Domains used in Canada */
  'yahoo.ca',
  'hotmail.ca',
  'bell.net',
  'shaw.ca',
  'sympatico.ca',
  'rogers.com'
];

export async function validateEmail(email: string): Promise<[boolean, string]> {
  if (!validate(email)) {
    // bad syntax
    return [false, 'Not a valid email address'];
  }

  const domain = email.split('@')[1].toLowerCase();
  if (domains.includes(domain)) {
    // known domains
    return [true, ''];
  }

  const mxRecords = await findValidMx(domain);
  if (mxRecords.length > 0) {
    return [true, ''];
  }

  const suggestion = suggest(email, { domains });
  if (suggestion) {
    return [false, `Do you mean ${suggestion.full}`];
  }

  return [false, 'Not a valid email address'];
}

export function validatePhoneNumber(
  number: string,
  countryCode?: CountryCode
): [boolean, string] {
  const phoneNumber = parsePhoneNumberFromString(number, countryCode || 'US');
  if (phoneNumber && phoneNumber.isValid) {
    return [true, phoneNumber.number as string];
  }

  return [false, ''];
}

async function findValidMx(domain: string): Promise<MxRecord[]> {
  return new Promise(resolve => {
    resolveMx(domain, (err, addresses) => {
      if (err || !addresses) {
        resolve([]);
      } else {
        resolve(addresses.filter(addr => addr.exchange));
      }
    });
  });
}

export function getValidTimezone(zone: string) {
  const tz = getTimezone(zone);
  if (tz) {
    return tz.aliasOf || zone;
  } else {
    return defaultTimezone;
  }
}
