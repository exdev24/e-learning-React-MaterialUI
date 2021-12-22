import { ParsedUrlQuery } from 'querystring';

const storage_id = '__cltraits__';

type Traits = Partial<{
  landing: string;
  source: string;
  campaign: string;
  initialSource: string;
  initialCampaign: string;
}>;

export function getUserTraits(): Traits {
  try {
    const stored = localStorage.getItem(storage_id);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }

  return {};
}

function getQueryString(key: string, query: ParsedUrlQuery) {
  const val = query[key];
  return Array.isArray(val) ? val.join(' ') : val;
}

export function persistUserTraits(url: string, query: ParsedUrlQuery) {
  const traits = getUserTraits();

  const source = getQueryString('utm_source', query);
  const campaign = getQueryString('utm_campaign', query);

  let changed = false;

  if (!traits.landing) {
    changed = true;
    traits.landing = url;
  }

  if (source) {
    changed = true;
    traits.source = source;
    if (!traits.initialSource) {
      traits.initialSource = source;
    }
  }

  if (campaign) {
    changed = true;
    traits.campaign = campaign;
    if (!traits.initialCampaign) {
      traits.initialCampaign = campaign;
    }
  }

  if (changed) {
    try {
      localStorage.setItem(storage_id, JSON.stringify(traits));
    } catch {
      // ignore
    }
  }
}
