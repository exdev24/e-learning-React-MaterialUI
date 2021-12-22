import { CountryCode } from 'libphonenumber-js';

export interface CountryOption {
  countryCode: CountryCode;
  countryNameEn: string;
  countryNameLocal?: string;
  region: string;
  flag: string;
}

export const countryList: CountryOption[] = [
  {
    countryNameEn: 'Andorra',
    countryNameLocal: 'Andorra',
    countryCode: 'AD',
    region: 'Europe',
    flag: '🇦🇩'
  },
  {
    countryNameEn: 'Afghanistan',
    countryNameLocal:
      'د افغانستان اسلامي دولتدولت اسلامی افغانستان, جمهوری اسلامی افغانستان',
    countryCode: 'AF',
    region: 'Asia & Pacific',
    flag: '🇦🇫'
  },
  {
    countryNameEn: 'Antigua and Barbuda',
    countryNameLocal: 'Antigua and Barbuda',
    countryCode: 'AG',
    region: 'South/Latin America',
    flag: '🇦🇬'
  },
  {
    countryNameEn: 'Anguilla',
    countryNameLocal: 'Anguilla',
    countryCode: 'AI',
    region: 'South/Latin America',
    flag: '🇦🇮'
  },
  {
    countryNameEn: 'Albania',
    countryNameLocal: 'Shqipëria',
    countryCode: 'AL',
    region: 'Europe',
    flag: '🇦🇱'
  },
  {
    countryNameEn: 'Armenia',
    countryNameLocal: 'Հայաստան',
    countryCode: 'AM',
    region: 'Europe',
    flag: '🇦🇲'
  },
  {
    countryNameEn: 'Angola',
    countryNameLocal: 'Angola',
    countryCode: 'AO',
    region: 'Africa',
    flag: '🇦🇴'
  },
  {
    countryNameEn: 'Argentina',
    countryNameLocal: 'Argentina',
    countryCode: 'AR',
    region: 'South/Latin America',
    flag: '🇦🇷'
  },
  {
    countryNameEn: 'American Samoa',
    countryNameLocal: 'American Samoa',
    countryCode: 'AS',
    region: 'Asia & Pacific',
    flag: '🇦🇸'
  },
  {
    countryNameEn: 'Austria',
    countryNameLocal: 'Österreich',
    countryCode: 'AT',
    region: 'Europe',
    flag: '🇦🇹'
  },
  {
    countryNameEn: 'Australia',
    countryNameLocal: 'Australia',
    countryCode: 'AU',
    region: 'Asia & Pacific',
    flag: '🇦🇺'
  },
  {
    countryNameEn: 'Aruba',
    countryNameLocal: 'Aruba',
    countryCode: 'AW',
    region: 'South/Latin America',
    flag: '🇦🇼'
  },
  {
    countryNameEn: 'Åland Islands',
    countryNameLocal: 'Åland',
    countryCode: 'AX',
    region: 'Europe',
    flag: '🇦🇽'
  },
  {
    countryNameEn: 'Azerbaijan',
    countryNameLocal: 'Azərbaycan',
    countryCode: 'AZ',
    region: 'Asia & Pacific',
    flag: '🇦🇿'
  },
  {
    countryNameEn: 'Bosnia and Herzegovina',
    countryNameLocal: 'Bosna i Hercegovina',
    countryCode: 'BA',
    region: 'Europe',
    flag: '🇧🇦'
  },
  {
    countryNameEn: 'Barbados',
    countryNameLocal: 'Barbados',
    countryCode: 'BB',
    region: 'South/Latin America',
    flag: '🇧🇧'
  },
  {
    countryNameEn: 'Bangladesh',
    countryNameLocal: 'গণপ্রজাতন্ত্রী বাংলাদেশ',
    countryCode: 'BD',
    region: 'Asia & Pacific',
    flag: '🇧🇩'
  },
  {
    countryNameEn: 'Belgium',
    countryNameLocal: 'België, Belgique, Belgien',
    countryCode: 'BE',
    region: 'Europe',
    flag: '🇧🇪'
  },
  {
    countryNameEn: 'Burkina Faso',
    countryNameLocal: 'Burkina Faso',
    countryCode: 'BF',
    region: 'Africa',
    flag: '🇧🇫'
  },
  {
    countryNameEn: 'Bulgaria',
    countryNameLocal: 'България',
    countryCode: 'BG',
    region: 'Europe',
    flag: '🇧🇬'
  },
  {
    countryNameEn: 'Bahrain',
    countryNameLocal: 'البحرين',
    countryCode: 'BH',
    region: 'Arab States',
    flag: '🇧🇭'
  },
  {
    countryNameEn: 'Burundi',
    countryNameLocal: 'Burundi',
    countryCode: 'BI',
    region: 'Africa',
    flag: '🇧🇮'
  },
  {
    countryNameEn: 'Benin',
    countryNameLocal: 'Bénin',
    countryCode: 'BJ',
    region: 'Africa',
    flag: '🇧🇯'
  },
  {
    countryNameEn: 'Saint Barthélemy',
    countryNameLocal: 'Saint-Barthélemy',
    countryCode: 'BL',
    region: 'South/Latin America',
    flag: '🇧🇱'
  },
  {
    countryNameEn: 'Bermuda',
    countryNameLocal: 'Bermuda',
    countryCode: 'BM',
    region: 'North America',
    flag: '🇧🇲'
  },
  {
    countryNameEn: 'Brunei Darussalam',
    countryNameLocal: 'Brunei Darussalam',
    countryCode: 'BN',
    region: 'Asia & Pacific',
    flag: '🇧🇳'
  },
  {
    countryNameEn: 'Bolivia (Plurinational State of)',
    countryNameLocal: 'Bolivia, Bulibiya, Volívia, Wuliwya',
    countryCode: 'BO',
    region: 'South/Latin America',
    flag: '🇧🇴'
  },
  {
    countryNameEn: 'Bonaire, Sint Eustatius and Saba',
    countryNameLocal: 'Caribisch Nederland',
    countryCode: 'BQ',
    region: 'Unknown',
    flag: '🇧🇶'
  },
  {
    countryNameEn: 'Brazil',
    countryNameLocal: 'Brasil',
    countryCode: 'BR',
    region: 'South/Latin America',
    flag: '🇧🇷'
  },
  {
    countryNameEn: 'Bhutan',
    countryNameLocal: 'འབྲུག་ཡུལ',
    countryCode: 'BT',
    region: 'Asia & Pacific',
    flag: '🇧🇹'
  },
  {
    countryNameEn: 'Botswana',
    countryNameLocal: 'Botswana',
    countryCode: 'BW',
    region: 'Africa',
    flag: '🇧🇼'
  },
  {
    countryNameEn: 'Belarus',
    countryNameLocal: 'Беларусь',
    countryCode: 'BY',
    region: 'Europe',
    flag: '🇧🇾'
  },
  {
    countryNameEn: 'Belize',
    countryNameLocal: 'Belize',
    countryCode: 'BZ',
    region: 'South/Latin America',
    flag: '🇧🇿'
  },
  {
    countryNameEn: 'Canada',
    countryNameLocal: 'Canada',
    countryCode: 'CA',
    region: 'North America',
    flag: '🇨🇦'
  },
  {
    countryNameEn: 'Switzerland',
    countryNameLocal: 'Schweiz, Suisse, Svizzera, Svizra',
    countryCode: 'CH',
    region: 'Europe',
    flag: '🇨🇭'
  },
  {
    countryNameEn: "Côte d'Ivoire",
    countryNameLocal: "Côte d'Ivoire",
    countryCode: 'CI',
    region: 'Africa',
    flag: '🇨🇮'
  },
  {
    countryNameEn: 'Chile',
    countryNameLocal: 'Chile',
    countryCode: 'CL',
    region: 'South/Latin America',
    flag: '🇨🇱'
  },
  {
    countryNameEn: 'Cameroon',
    countryNameLocal: 'Cameroun, Cameroon',
    countryCode: 'CM',
    region: 'Africa',
    flag: '🇨🇲'
  },
  {
    countryNameEn: 'China',
    countryNameLocal: '中国',
    countryCode: 'CN',
    region: 'Asia & Pacific',
    flag: '🇨🇳'
  },
  {
    countryNameEn: 'Colombia',
    countryNameLocal: 'Colombia',
    countryCode: 'CO',
    region: 'South/Latin America',
    flag: '🇨🇴'
  },
  {
    countryNameEn: 'Costa Rica',
    countryNameLocal: 'Costa Rica',
    countryCode: 'CR',
    region: 'South/Latin America',
    flag: '🇨🇷'
  },
  {
    countryNameEn: 'Cuba',
    countryNameLocal: 'Cuba',
    countryCode: 'CU',
    region: 'South/Latin America',
    flag: '🇨🇺'
  },
  {
    countryNameEn: 'Cabo Verde',
    countryNameLocal: 'Cabo Verde',
    countryCode: 'CV',
    region: 'Africa',
    flag: '🇨🇻'
  },
  {
    countryNameEn: 'Curaçao',
    countryNameLocal: 'Curaçao',
    countryCode: 'CW',
    region: 'Unknown',
    flag: '🇨🇼'
  },
  {
    countryNameEn: 'Christmas Island',
    countryNameLocal: 'Christmas Island',
    countryCode: 'CX',
    region: 'Asia & Pacific',
    flag: '🇨🇽'
  },
  {
    countryNameEn: 'Cyprus',
    countryNameLocal: 'Κύπρος, Kibris',
    countryCode: 'CY',
    region: 'Europe',
    flag: '🇨🇾'
  },
  {
    countryNameEn: 'Germany',
    countryNameLocal: 'Deutschland',
    countryCode: 'DE',
    region: 'Europe',
    flag: '🇩🇪'
  },
  {
    countryNameEn: 'Djibouti',
    countryNameLocal: 'Djibouti, جيبوتي, Jabuuti, Gabuutih',
    countryCode: 'DJ',
    region: 'Arab States',
    flag: '🇩🇯'
  },
  {
    countryNameEn: 'Denmark',
    countryNameLocal: 'Danmark',
    countryCode: 'DK',
    region: 'Europe',
    flag: '🇩🇰'
  },
  {
    countryNameEn: 'Dominica',
    countryNameLocal: 'Dominica',
    countryCode: 'DM',
    region: 'South/Latin America',
    flag: '🇩🇲'
  },
  {
    countryNameEn: 'Algeria',
    countryNameLocal: 'الجزائر',
    countryCode: 'DZ',
    region: 'Arab States',
    flag: '🇩🇿'
  },
  {
    countryNameEn: 'Ecuador',
    countryNameLocal: 'Ecuador',
    countryCode: 'EC',
    region: 'South/Latin America',
    flag: '🇪🇨'
  },
  {
    countryNameEn: 'Estonia',
    countryNameLocal: 'Eesti',
    countryCode: 'EE',
    region: 'Europe',
    flag: '🇪🇪'
  },
  {
    countryNameEn: 'Egypt',
    countryNameLocal: 'مصر',
    countryCode: 'EG',
    region: 'Arab States',
    flag: '🇪🇬'
  },
  {
    countryNameEn: 'Western Sahara',
    countryNameLocal: 'Sahara Occidental',
    countryCode: 'EH',
    region: 'Africa',
    flag: '🇪🇭'
  },
  {
    countryNameEn: 'Eritrea',
    countryNameLocal: 'ኤርትራ, إرتريا, Eritrea',
    countryCode: 'ER',
    region: 'Africa',
    flag: '🇪🇷'
  },
  {
    countryNameEn: 'Spain',
    countryNameLocal: 'España',
    countryCode: 'ES',
    region: 'Europe',
    flag: '🇪🇸'
  },
  {
    countryNameEn: 'Ethiopia',
    countryNameLocal: 'ኢትዮጵያ, Itoophiyaa',
    countryCode: 'ET',
    region: 'Africa',
    flag: '🇪🇹'
  },
  {
    countryNameEn: 'Finland',
    countryNameLocal: 'Suomi',
    countryCode: 'FI',
    region: 'Europe',
    flag: '🇫🇮'
  },
  {
    countryNameEn: 'Fiji',
    countryNameLocal: 'Fiji',
    countryCode: 'FJ',
    region: 'Asia & Pacific',
    flag: '🇫🇯'
  },
  {
    countryNameEn: 'Micronesia (Federated States of)',
    countryNameLocal: 'Micronesia',
    countryCode: 'FM',
    region: 'Asia & Pacific',
    flag: '🇫🇲'
  },
  {
    countryNameEn: 'France',
    countryNameLocal: 'France',
    countryCode: 'FR',
    region: 'Europe',
    flag: '🇫🇷'
  },
  {
    countryNameEn: 'Gabon',
    countryNameLocal: 'Gabon',
    countryCode: 'GA',
    region: 'Africa',
    flag: '🇬🇦'
  },
  {
    countryNameEn: 'Grenada',
    countryNameLocal: 'Grenada',
    countryCode: 'GD',
    region: 'South/Latin America',
    flag: '🇬🇩'
  },
  {
    countryNameEn: 'Georgia',
    countryNameLocal: 'საქართველო',
    countryCode: 'GE',
    region: 'Europe',
    flag: '🇬🇪'
  },
  {
    countryNameEn: 'French Guiana',
    countryNameLocal: 'Guyane française',
    countryCode: 'GF',
    region: 'South/Latin America',
    flag: '🇬🇫'
  },
  {
    countryNameEn: 'Guernsey',
    countryNameLocal: 'Guernsey',
    countryCode: 'GG',
    region: 'Europe',
    flag: '🇬🇬'
  },
  {
    countryNameEn: 'Ghana',
    countryNameLocal: 'Ghana',
    countryCode: 'GH',
    region: 'Africa',
    flag: '🇬🇭'
  },
  {
    countryNameEn: 'Gibraltar',
    countryNameLocal: 'Gibraltar',
    countryCode: 'GI',
    region: 'Europe',
    flag: '🇬🇮'
  },
  {
    countryNameEn: 'Greenland',
    countryNameLocal: 'Kalaallit Nunaat, Grønland',
    countryCode: 'GL',
    region: 'Europe',
    flag: '🇬🇱'
  },
  {
    countryNameEn: 'Guinea',
    countryNameLocal: 'Guinée',
    countryCode: 'GN',
    region: 'Africa',
    flag: '🇬🇳'
  },
  {
    countryNameEn: 'Guadeloupe',
    countryNameLocal: 'Guadeloupe',
    countryCode: 'GP',
    region: 'South/Latin America',
    flag: '🇬🇵'
  },
  {
    countryNameEn: 'Equatorial Guinea',
    countryNameLocal: 'Guiena ecuatorial, Guinée équatoriale, Guiné Equatorial',
    countryCode: 'GQ',
    region: 'Africa',
    flag: '🇬🇶'
  },
  {
    countryNameEn: 'Greece',
    countryNameLocal: 'Ελλάδα',
    countryCode: 'GR',
    region: 'Europe',
    flag: '🇬🇷'
  },
  {
    countryNameEn: 'Guatemala',
    countryNameLocal: 'Guatemala',
    countryCode: 'GT',
    region: 'South/Latin America',
    flag: '🇬🇹'
  },
  {
    countryNameEn: 'Guam',
    countryNameLocal: 'Guam, Guåhån',
    countryCode: 'GU',
    region: 'Asia & Pacific',
    flag: '🇬🇺'
  },
  {
    countryNameEn: 'Guinea-Bissau',
    countryNameLocal: 'Guiné-Bissau',
    countryCode: 'GW',
    region: 'Africa',
    flag: '🇬🇼'
  },
  {
    countryNameEn: 'Guyana',
    countryNameLocal: 'Guyana',
    countryCode: 'GY',
    region: 'South/Latin America',
    flag: '🇬🇾'
  },
  {
    countryNameEn: 'Hong Kong',
    countryNameLocal: '香港, Hong Kong',
    countryCode: 'HK',
    region: 'Asia & Pacific',
    flag: '🇭🇰'
  },
  {
    countryNameEn: 'Honduras',
    countryNameLocal: 'Honduras',
    countryCode: 'HN',
    region: 'South/Latin America',
    flag: '🇭🇳'
  },
  {
    countryNameEn: 'Croatia',
    countryNameLocal: 'Hrvatska',
    countryCode: 'HR',
    region: 'Europe',
    flag: '🇭🇷'
  },
  {
    countryNameEn: 'Haiti',
    countryNameLocal: 'Haïti, Ayiti',
    countryCode: 'HT',
    region: 'South/Latin America',
    flag: '🇭🇹'
  },
  {
    countryNameEn: 'Hungary',
    countryNameLocal: 'Magyarország',
    countryCode: 'HU',
    region: 'Europe',
    flag: '🇭🇺'
  },
  {
    countryNameEn: 'Indonesia',
    countryNameLocal: 'Indonesia',
    countryCode: 'ID',
    region: 'Asia & Pacific',
    flag: '🇮🇩'
  },
  {
    countryNameEn: 'Ireland',
    countryNameLocal: 'Ireland, Éire',
    countryCode: 'IE',
    region: 'Europe',
    flag: '🇮🇪'
  },
  {
    countryNameEn: 'Israel',
    countryNameLocal: 'ישראל',
    countryCode: 'IL',
    region: 'Europe',
    flag: '🇮🇱'
  },
  {
    countryNameEn: 'Isle of Man',
    countryNameLocal: 'Isle of Man',
    countryCode: 'IM',
    region: 'Europe',
    flag: '🇮🇲'
  },
  {
    countryNameEn: 'India',
    countryNameLocal: 'भारत, India',
    countryCode: 'IN',
    region: 'Asia & Pacific',
    flag: '🇮🇳'
  },
  {
    countryNameEn: 'Iraq',
    countryNameLocal: 'العراق, Iraq',
    countryCode: 'IQ',
    region: 'Arab States',
    flag: '🇮🇶'
  },
  {
    countryNameEn: 'Iran (Islamic Republic of)',
    countryNameLocal: 'ایران',
    countryCode: 'IR',
    region: 'Asia & Pacific',
    flag: '🇮🇷'
  },
  {
    countryNameEn: 'Iceland',
    countryNameLocal: 'Ísland',
    countryCode: 'IS',
    region: 'Europe',
    flag: '🇮🇸'
  },
  {
    countryNameEn: 'Italy',
    countryNameLocal: 'Italia',
    countryCode: 'IT',
    region: 'Europe',
    flag: '🇮🇹'
  },
  {
    countryNameEn: 'Jersey',
    countryNameLocal: 'Jersey',
    countryCode: 'JE',
    region: 'Europe',
    flag: '🇯🇪'
  },
  {
    countryNameEn: 'Jamaica',
    countryNameLocal: 'Jamaica',
    countryCode: 'JM',
    region: 'South/Latin America',
    flag: '🇯🇲'
  },
  {
    countryNameEn: 'Jordan',
    countryNameLocal: 'الأُرْدُن',
    countryCode: 'JO',
    region: 'Arab States',
    flag: '🇯🇴'
  },
  {
    countryNameEn: 'Japan',
    countryNameLocal: '日本',
    countryCode: 'JP',
    region: 'Asia & Pacific',
    flag: '🇯🇵'
  },
  {
    countryNameEn: 'Kenya',
    countryNameLocal: 'Kenya',
    countryCode: 'KE',
    region: 'Africa',
    flag: '🇰🇪'
  },
  {
    countryNameEn: 'Kyrgyzstan',
    countryNameLocal: 'Кыргызстан, Киргизия',
    countryCode: 'KG',
    region: 'Asia & Pacific',
    flag: '🇰🇬'
  },
  {
    countryNameEn: 'Cambodia',
    countryNameLocal: 'កម្ពុជា',
    countryCode: 'KH',
    region: 'Asia & Pacific',
    flag: '🇰🇭'
  },
  {
    countryNameEn: 'North Korea',
    countryNameLocal: '조선민주주의인민공화국',
    countryCode: 'KP',
    region: 'Asia',
    flag: '🇰🇵'
  },
  {
    countryNameEn: 'South Korea',
    countryNameLocal: '대한민국',
    countryCode: 'KR',
    region: 'Asia',
    flag: '🇰🇷'
  },
  {
    countryNameEn: 'Kiribati',
    countryNameLocal: 'Kiribati',
    countryCode: 'KI',
    region: 'Asia & Pacific',
    flag: '🇰🇮'
  },
  {
    countryNameEn: 'Saint Kitts and Nevis',
    countryNameLocal: 'Saint Kitts and Nevis',
    countryCode: 'KN',
    region: 'South/Latin America',
    flag: '🇰🇳'
  },
  {
    countryNameEn: 'Kuwait',
    countryNameLocal: 'الكويت',
    countryCode: 'KW',
    region: 'Arab States',
    flag: '🇰🇼'
  },
  {
    countryNameEn: 'Kazakhstan',
    countryNameLocal: 'Қазақстан, Казахстан',
    countryCode: 'KZ',
    region: 'Asia & Pacific',
    flag: '🇰🇿'
  },
  {
    countryNameEn: 'Lebanon',
    countryNameLocal: 'لبنان, Liban',
    countryCode: 'LB',
    region: 'Arab States',
    flag: '🇱🇧'
  },
  {
    countryNameEn: 'Saint Lucia',
    countryNameLocal: 'Saint Lucia',
    countryCode: 'LC',
    region: 'South/Latin America',
    flag: '🇱🇨'
  },
  {
    countryNameEn: 'Liechtenstein',
    countryNameLocal: 'Liechtenstein',
    countryCode: 'LI',
    region: 'Europe',
    flag: '🇱🇮'
  },
  {
    countryNameEn: 'Sri Lanka',
    countryNameLocal: 'ශ්‍රී ලංකා, இலங்கை',
    countryCode: 'LK',
    region: 'Asia & Pacific',
    flag: '🇱🇰'
  },
  {
    countryNameEn: 'Liberia',
    countryNameLocal: 'Liberia',
    countryCode: 'LR',
    region: 'Africa',
    flag: '🇱🇷'
  },
  {
    countryNameEn: 'Lesotho',
    countryNameLocal: 'Lesotho',
    countryCode: 'LS',
    region: 'Africa',
    flag: '🇱🇸'
  },
  {
    countryNameEn: 'Lithuania',
    countryNameLocal: 'Lietuva',
    countryCode: 'LT',
    region: 'Europe',
    flag: '🇱🇹'
  },
  {
    countryNameEn: 'Luxembourg',
    countryNameLocal: 'Lëtzebuerg, Luxembourg, Luxemburg',
    countryCode: 'LU',
    region: 'Europe',
    flag: '🇱🇺'
  },
  {
    countryNameEn: 'Latvia',
    countryNameLocal: 'Latvija',
    countryCode: 'LV',
    region: 'Europe',
    flag: '🇱🇻'
  },
  {
    countryNameEn: 'Libya',
    countryNameLocal: 'ليبيا',
    countryCode: 'LY',
    region: 'Arab States',
    flag: '🇱🇾'
  },
  {
    countryNameEn: 'Morocco',
    countryNameLocal: 'Maroc, ⵍⵎⵖⵔⵉⴱ, المغرب',
    countryCode: 'MA',
    region: 'Arab States',
    flag: '🇲🇦'
  },
  {
    countryNameEn: 'Monaco',
    countryNameLocal: 'Monaco',
    countryCode: 'MC',
    region: 'Europe',
    flag: '🇲🇨'
  },
  {
    countryNameEn: 'Montenegro',
    countryNameLocal: 'Crna Gora, Црна Гора',
    countryCode: 'ME',
    region: 'Europe',
    flag: '🇲🇪'
  },
  {
    countryNameEn: 'Saint Martin (French part)',
    countryNameLocal: 'Saint-Martin',
    countryCode: 'MF',
    region: 'South/Latin America',
    flag: '🇲🇫'
  },
  {
    countryNameEn: 'Madagascar',
    countryNameLocal: 'Madagasikara, Madagascar',
    countryCode: 'MG',
    region: 'Africa',
    flag: '🇲🇬'
  },
  {
    countryNameEn: 'Mali',
    countryNameLocal: 'Mali',
    countryCode: 'ML',
    region: 'Africa',
    flag: '🇲🇱'
  },
  {
    countryNameEn: 'Myanmar',
    countryNameLocal: 'မြန်မာ',
    countryCode: 'MM',
    region: 'Asia & Pacific',
    flag: '🇲🇲'
  },
  {
    countryNameEn: 'Mongolia',
    countryNameLocal: 'Монгол Улс',
    countryCode: 'MN',
    region: 'Asia & Pacific',
    flag: '🇲🇳'
  },
  {
    countryNameEn: 'Macao',
    countryNameLocal: '澳門, Macau',
    countryCode: 'MO',
    region: 'Asia & Pacific',
    flag: '🇲🇴'
  },
  {
    countryNameEn: 'Martinique',
    countryNameLocal: 'Martinique',
    countryCode: 'MQ',
    region: 'South/Latin America',
    flag: '🇲🇶'
  },
  {
    countryNameEn: 'Mauritania',
    countryNameLocal: 'موريتانيا, Mauritanie',
    countryCode: 'MR',
    region: 'Arab States',
    flag: '🇲🇷'
  },
  {
    countryNameEn: 'Montserrat',
    countryNameLocal: 'Montserrat',
    countryCode: 'MS',
    region: 'South/Latin America',
    flag: '🇲🇸'
  },
  {
    countryNameEn: 'Malta',
    countryNameLocal: 'Malta',
    countryCode: 'MT',
    region: 'Europe',
    flag: '🇲🇹'
  },
  {
    countryNameEn: 'Mauritius',
    countryNameLocal: 'Maurice, Mauritius',
    countryCode: 'MU',
    region: 'Africa',
    flag: '🇲🇺'
  },
  {
    countryNameEn: 'Maldives',
    countryCode: 'MV',
    region: 'Asia & Pacific',
    flag: '🇲🇻'
  },
  {
    countryNameEn: 'Malawi',
    countryNameLocal: 'Malawi',
    countryCode: 'MW',
    region: 'Africa',
    flag: '🇲🇼'
  },
  {
    countryNameEn: 'Mexico',
    countryNameLocal: 'México',
    countryCode: 'MX',
    region: 'South/Latin America',
    flag: '🇲🇽'
  },
  {
    countryNameEn: 'Malaysia',
    countryCode: 'MY',
    region: 'Asia & Pacific',
    flag: '🇲🇾'
  },
  {
    countryNameEn: 'Mozambique',
    countryNameLocal: 'Mozambique',
    countryCode: 'MZ',
    region: 'Africa',
    flag: '🇲🇿'
  },
  {
    countryNameEn: 'Namibia',
    countryNameLocal: 'Namibia',
    countryCode: 'NA',
    region: 'Africa',
    flag: '🇳🇦'
  },
  {
    countryNameEn: 'New Caledonia',
    countryNameLocal: 'Nouvelle-Calédonie',
    countryCode: 'NC',
    region: 'Asia & Pacific',
    flag: '🇳🇨'
  },
  {
    countryNameEn: 'Norfolk Island',
    countryNameLocal: 'Norfolk Island',
    countryCode: 'NF',
    region: 'Asia & Pacific',
    flag: '🇳🇫'
  },
  {
    countryNameEn: 'Nigeria',
    countryNameLocal: 'Nigeria',
    countryCode: 'NG',
    region: 'Africa',
    flag: '🇳🇬'
  },
  {
    countryNameEn: 'Nicaragua',
    countryNameLocal: 'Nicaragua',
    countryCode: 'NI',
    region: 'South/Latin America',
    flag: '🇳🇮'
  },
  {
    countryNameEn: 'Norway',
    countryNameLocal: 'Norge, Noreg',
    countryCode: 'NO',
    region: 'Europe',
    flag: '🇳🇴'
  },
  {
    countryNameEn: 'Nepal',
    countryCode: 'NP',
    region: 'Asia & Pacific',
    flag: '🇳🇵'
  },
  {
    countryNameEn: 'Nauru',
    countryNameLocal: 'Nauru',
    countryCode: 'NR',
    region: 'Asia & Pacific',
    flag: '🇳🇷'
  },
  {
    countryNameEn: 'Niue',
    countryNameLocal: 'Niue',
    countryCode: 'NU',
    region: 'Asia & Pacific',
    flag: '🇳🇺'
  },
  {
    countryNameEn: 'New Zealand',
    countryNameLocal: 'New Zealand',
    countryCode: 'NZ',
    region: 'Asia & Pacific',
    flag: '🇳🇿'
  },
  {
    countryNameEn: 'Oman',
    countryNameLocal: 'سلطنة عُمان',
    countryCode: 'OM',
    region: 'Arab States',
    flag: '🇴🇲'
  },
  {
    countryNameEn: 'Panama',
    countryNameLocal: 'Panama',
    countryCode: 'PA',
    region: 'South/Latin America',
    flag: '🇵🇦'
  },
  {
    countryNameEn: 'Peru',
    countryNameLocal: 'Perú',
    countryCode: 'PE',
    region: 'South/Latin America',
    flag: '🇵🇪'
  },
  {
    countryNameEn: 'French Polynesia',
    countryNameLocal: 'Polynésie française',
    countryCode: 'PF',
    region: 'Asia & Pacific',
    flag: '🇵🇫'
  },
  {
    countryNameEn: 'Papua New Guinea',
    countryNameLocal: 'Papua New Guinea',
    countryCode: 'PG',
    region: 'Asia & Pacific',
    flag: '🇵🇬'
  },
  {
    countryNameEn: 'Pakistan',
    countryNameLocal: 'پاکستان',
    countryCode: 'PK',
    region: 'Asia & Pacific',
    flag: '🇵🇰'
  },
  {
    countryNameEn: 'Poland',
    countryNameLocal: 'Polska',
    countryCode: 'PL',
    region: 'Europe',
    flag: '🇵🇱'
  },
  {
    countryNameEn: 'Saint Pierre and Miquelon',
    countryNameLocal: 'Saint-Pierre-et-Miquelon',
    countryCode: 'PM',
    region: 'North America',
    flag: '🇵🇲'
  },
  {
    countryNameEn: 'Puerto Rico',
    countryNameLocal: 'Puerto Rico',
    countryCode: 'PR',
    region: 'South/Latin America',
    flag: '🇵🇷'
  },
  {
    countryNameEn: 'Palestine, State of',
    countryNameLocal: 'Palestinian Territory',
    countryCode: 'PS',
    region: 'Arab States',
    flag: '🇵🇸'
  },
  {
    countryNameEn: 'Portugal',
    countryNameLocal: 'Portugal',
    countryCode: 'PT',
    region: 'Europe',
    flag: '🇵🇹'
  },
  {
    countryNameEn: 'Palau',
    countryNameLocal: 'Palau',
    countryCode: 'PW',
    region: 'Asia & Pacific',
    flag: '🇵🇼'
  },
  {
    countryNameEn: 'Paraguay',
    countryNameLocal: 'Paraguay',
    countryCode: 'PY',
    region: 'South/Latin America',
    flag: '🇵🇾'
  },
  {
    countryNameEn: 'Qatar',
    countryNameLocal: 'قطر',
    countryCode: 'QA',
    region: 'Arab States',
    flag: '🇶🇦'
  },
  {
    countryNameEn: 'Réunion',
    countryNameLocal: 'La Réunion',
    countryCode: 'RE',
    region: 'Asia & Pacific',
    flag: '🇷🇪'
  },
  {
    countryNameEn: 'Romania',
    countryNameLocal: 'România',
    countryCode: 'RO',
    region: 'Europe',
    flag: '🇷🇴'
  },
  {
    countryNameEn: 'Serbia',
    countryNameLocal: 'Србија',
    countryCode: 'RS',
    region: 'Europe',
    flag: '🇷🇸'
  },
  {
    countryNameEn: 'Russia',
    countryNameLocal: 'Россия',
    countryCode: 'RU',
    region: 'Europe',
    flag: '🇷🇺'
  },
  {
    countryNameEn: 'Rwanda',
    countryNameLocal: 'Rwanda',
    countryCode: 'RW',
    region: 'Africa',
    flag: '🇷🇼'
  },
  {
    countryNameEn: 'Saudi Arabia',
    countryNameLocal: 'السعودية',
    countryCode: 'SA',
    region: 'Arab States',
    flag: '🇸🇦'
  },
  {
    countryNameEn: 'Solomon Islands',
    countryNameLocal: 'Solomon Islands',
    countryCode: 'SB',
    region: 'Asia & Pacific',
    flag: '🇸🇧'
  },
  {
    countryNameEn: 'Seychelles',
    countryNameLocal: 'Seychelles',
    countryCode: 'SC',
    region: 'Africa',
    flag: '🇸🇨'
  },
  {
    countryNameEn: 'Sweden',
    countryNameLocal: 'Sverige',
    countryCode: 'SE',
    region: 'Europe',
    flag: '🇸🇪'
  },
  {
    countryNameEn: 'Singapore',
    countryNameLocal: 'Singapore',
    countryCode: 'SG',
    region: 'Asia & Pacific',
    flag: '🇸🇬'
  },
  {
    countryNameEn: 'Saint Helena, Ascension and Tristan da Cunha',
    countryNameLocal: 'Saint Helena',
    countryCode: 'SH',
    region: 'Africa',
    flag: '🇸🇭'
  },
  {
    countryNameEn: 'Slovenia',
    countryNameLocal: 'Slovenija',
    countryCode: 'SI',
    region: 'Europe',
    flag: '🇸🇮'
  },
  {
    countryNameEn: 'Svalbard and Jan Mayen',
    countryNameLocal: 'Svalbard and Jan Mayen',
    countryCode: 'SJ',
    region: 'Europe',
    flag: '🇸🇯'
  },
  {
    countryNameEn: 'Slovakia',
    countryNameLocal: 'Slovensko',
    countryCode: 'SK',
    region: 'Europe',
    flag: '🇸🇰'
  },
  {
    countryNameEn: 'Sierra Leone',
    countryNameLocal: 'Sierra Leone',
    countryCode: 'SL',
    region: 'Africa',
    flag: '🇸🇱'
  },
  {
    countryNameEn: 'San Marino',
    countryNameLocal: 'San Marino',
    countryCode: 'SM',
    region: 'Europe',
    flag: '🇸🇲'
  },
  {
    countryNameEn: 'Senegal',
    countryNameLocal: 'Sénégal',
    countryCode: 'SN',
    region: 'Africa',
    flag: '🇸🇳'
  },
  {
    countryNameEn: 'Somalia',
    countryNameLocal: 'Somalia, الصومال',
    countryCode: 'SO',
    region: 'Arab States',
    flag: '🇸🇴'
  },
  {
    countryNameEn: 'Suriname',
    countryNameLocal: 'Suriname',
    countryCode: 'SR',
    region: 'South/Latin America',
    flag: '🇸🇷'
  },
  {
    countryNameEn: 'South Sudan',
    countryNameLocal: 'South Sudan',
    countryCode: 'SS',
    region: 'Africa',
    flag: '🇸🇸'
  },
  {
    countryNameEn: 'Sao Tome and Principe',
    countryNameLocal: 'São Tomé e Príncipe',
    countryCode: 'ST',
    region: 'Africa',
    flag: '🇸🇹'
  },
  {
    countryNameEn: 'El Salvador',
    countryNameLocal: 'El Salvador',
    countryCode: 'SV',
    region: 'South/Latin America',
    flag: '🇸🇻'
  },
  {
    countryNameEn: 'Sint Maarten (Dutch part)',
    countryNameLocal: 'Sint Maarten',
    countryCode: 'SX',
    region: 'Unknown',
    flag: '🇸🇽'
  },
  {
    countryNameEn: 'Syrian Arab Republic',
    countryNameLocal: 'سوريا, Sūriyya',
    countryCode: 'SY',
    region: 'Asia & Pacific',
    flag: '🇸🇾'
  },
  {
    countryNameEn: 'Chad',
    countryNameLocal: 'Tchad, تشاد',
    countryCode: 'TD',
    region: 'Africa',
    flag: '🇹🇩'
  },
  {
    countryNameEn: 'Togo',
    countryNameLocal: 'Togo',
    countryCode: 'TG',
    region: 'Africa',
    flag: '🇹🇬'
  },
  {
    countryNameEn: 'Thailand',
    countryNameLocal: 'ประเทศไทย',
    countryCode: 'TH',
    region: 'Asia & Pacific',
    flag: '🇹🇭'
  },
  {
    countryNameEn: 'Tajikistan',
    countryCode: 'TJ',
    region: 'Asia & Pacific',
    flag: '🇹🇯'
  },
  {
    countryNameEn: 'Tokelau',
    countryNameLocal: 'Tokelau',
    countryCode: 'TK',
    region: 'Asia & Pacific',
    flag: '🇹🇰'
  },
  {
    countryNameEn: 'Timor-Leste',
    countryNameLocal: "Timor-Leste, Timor Lorosa'e",
    countryCode: 'TL',
    region: 'Asia & Pacific',
    flag: '🇹🇱'
  },
  {
    countryNameEn: 'Turkmenistan',
    countryNameLocal: 'Türkmenistan',
    countryCode: 'TM',
    region: 'Asia & Pacific',
    flag: '🇹🇲'
  },
  {
    countryNameEn: 'Tunisia',
    countryNameLocal: 'تونس, Tunisie',
    countryCode: 'TN',
    region: 'Arab States',
    flag: '🇹🇳'
  },
  {
    countryNameEn: 'Tonga',
    countryNameLocal: 'Tonga',
    countryCode: 'TO',
    region: 'Asia & Pacific',
    flag: '🇹🇴'
  },
  {
    countryNameEn: 'Turkey',
    countryNameLocal: 'Türkiye',
    countryCode: 'TR',
    region: 'Europe',
    flag: '🇹🇷'
  },
  {
    countryNameEn: 'Trinidad and Tobago',
    countryNameLocal: 'Trinidad and Tobago',
    countryCode: 'TT',
    region: 'South/Latin America',
    flag: '🇹🇹'
  },
  {
    countryNameEn: 'Tuvalu',
    countryNameLocal: 'Tuvalu',
    countryCode: 'TV',
    region: 'Asia & Pacific',
    flag: '🇹🇻'
  },
  {
    countryNameEn: 'United Republic of Tanzania',
    countryNameLocal: 'Tanzania',
    countryCode: 'TZ',
    region: 'Africa',
    flag: '🇹🇿'
  },
  {
    countryNameEn: 'Ukraine',
    countryNameLocal: 'Україна',
    countryCode: 'UA',
    region: 'Europe',
    flag: '🇺🇦'
  },
  {
    countryNameEn: 'Uganda',
    countryNameLocal: 'Uganda',
    countryCode: 'UG',
    region: 'Africa',
    flag: '🇺🇬'
  },
  {
    countryNameEn: 'United States of America',
    countryNameLocal: 'United States of America',
    countryCode: 'US',
    region: 'North America',
    flag: '🇺🇸'
  },
  {
    countryNameEn: 'Uruguay',
    countryNameLocal: 'Uruguay',
    countryCode: 'UY',
    region: 'South/Latin America',
    flag: '🇺🇾'
  },
  {
    countryNameEn: 'Uzbekistan',
    countryCode: 'UZ',
    region: 'Asia & Pacific',
    flag: '🇺🇿'
  },
  {
    countryNameEn: 'Saint Vincent and the Grenadines',
    countryNameLocal: 'Saint Vincent and the Grenadines',
    countryCode: 'VC',
    region: 'South/Latin America',
    flag: '🇻🇨'
  },
  {
    countryNameEn: 'Venezuela (Bolivarian Republic of)',
    countryNameLocal: 'Venezuela',
    countryCode: 'VE',
    region: 'South/Latin America',
    flag: '🇻🇪'
  },
  {
    countryNameEn: 'Virgin Islands (British)',
    countryNameLocal: 'British Virgin Islands',
    countryCode: 'VG',
    region: 'South/Latin America',
    flag: '🇻🇬'
  },
  {
    countryNameEn: 'Virgin Islands (U.S.)',
    countryNameLocal: 'United States Virgin Islands',
    countryCode: 'VI',
    region: 'South/Latin America',
    flag: '🇻🇮'
  },
  {
    countryNameEn: 'Vietnam',
    countryNameLocal: 'Việt Nam',
    countryCode: 'VN',
    region: 'Asia & Pacific',
    flag: '🇻🇳'
  },
  {
    countryNameEn: 'Vanuatu',
    countryNameLocal: 'Vanuatu',
    countryCode: 'VU',
    region: 'Asia & Pacific',
    flag: '🇻🇺'
  },
  {
    countryNameEn: 'Wallis and Futuna',
    countryNameLocal: 'Wallis-et-Futuna',
    countryCode: 'WF',
    region: 'Asia & Pacific',
    flag: '🇼🇫'
  },
  {
    countryNameEn: 'Samoa',
    countryNameLocal: 'Samoa',
    countryCode: 'WS',
    region: 'Asia & Pacific',
    flag: '🇼🇸'
  },
  {
    countryNameEn: 'Yemen',
    countryNameLocal: 'اليَمَن',
    countryCode: 'YE',
    region: 'Arab States',
    flag: '🇾🇪'
  },
  {
    countryNameEn: 'Mayotte',
    countryNameLocal: 'Mayotte',
    countryCode: 'YT',
    region: 'Africa',
    flag: '🇾🇹'
  },
  {
    countryNameEn: 'South Africa',
    countryNameLocal: 'South Africa',
    countryCode: 'ZA',
    region: 'Africa',
    flag: '🇿🇦'
  },
  {
    countryNameEn: 'Zambia',
    countryNameLocal: 'Zambia',
    countryCode: 'ZM',
    region: 'Africa',
    flag: '🇿🇲'
  },
  {
    countryNameEn: 'Zimbabwe',
    countryNameLocal: 'Zimbabwe',
    countryCode: 'ZW',
    region: 'Africa',
    flag: '🇿🇼'
  },
  {
    countryNameEn: 'Eswatini',
    countryNameLocal: 'Swaziland',
    countryCode: 'SZ',
    region: 'Africa',
    flag: '🇸🇿'
  },
  {
    countryNameEn: 'North Macedonia',
    countryNameLocal: 'Македонија',
    countryCode: 'MK',
    region: 'Europe',
    flag: '🇲🇰'
  },
  {
    countryNameEn: 'Philippines',
    countryNameLocal: 'Philippines',
    countryCode: 'PH',
    region: 'Asia & Pacific',
    flag: '🇵🇭'
  },
  {
    countryNameEn: 'Netherlands',
    countryNameLocal: 'Nederland',
    countryCode: 'NL',
    region: 'Europe',
    flag: '🇳🇱'
  },
  {
    countryNameEn: 'United Arab Emirates',
    countryNameLocal: 'دولة الإمارات العربيّة المتّحدة',
    countryCode: 'AE',
    region: 'Arab States',
    flag: '🇦🇪'
  },
  {
    countryNameEn: 'Republic of Moldova',
    countryNameLocal: 'Moldova, Молдавия',
    countryCode: 'MD',
    region: 'Europe',
    flag: '🇲🇩'
  },
  {
    countryNameEn: 'Gambia',
    countryNameLocal: 'The Gambia',
    countryCode: 'GM',
    region: 'Africa',
    flag: '🇬🇲'
  },
  {
    countryNameEn: 'Dominican Republic',
    countryNameLocal: 'República Dominicana',
    countryCode: 'DO',
    region: 'South/Latin America',
    flag: '🇩🇴'
  },
  {
    countryNameEn: 'Sudan',
    countryNameLocal: 'السودان',
    countryCode: 'SD',
    region: 'Arab States',
    flag: '🇸🇩'
  },
  {
    countryNameEn: "Lao People's Democratic Republic",
    countryNameLocal: 'ປະຊາຊົນລາວ',
    countryCode: 'LA',
    region: 'Asia & Pacific',
    flag: '🇱🇦'
  },
  {
    countryNameEn: 'Taiwan, Province of China',
    countryNameLocal: 'Taiwan',
    countryCode: 'TW',
    region: 'Asia & Pacific',
    flag: '🇹🇼'
  },
  {
    countryNameEn: 'Republic of the Congo',
    countryNameLocal: 'République du Congo',
    countryCode: 'CG',
    region: 'Africa',
    flag: '🇨🇬'
  },
  {
    countryNameEn: 'Czechia',
    countryNameLocal: 'Česká republika',
    countryCode: 'CZ',
    region: 'Europe',
    flag: '🇨🇿'
  },
  {
    countryNameEn: 'United Kingdom',
    countryNameLocal: 'Great Britain',
    countryCode: 'GB',
    region: 'Europe',
    flag: '🇬🇧'
  },
  {
    countryNameEn: 'Niger',
    countryNameLocal: 'Niger',
    countryCode: 'NE',
    region: 'Africa',
    flag: '🇳🇪'
  }
];
