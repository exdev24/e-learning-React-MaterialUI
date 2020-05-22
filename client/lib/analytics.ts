import { Topic } from 'common';
import { User } from '../graphql/data-models';
import { segmentOpts } from '../runtime';
import isBrowser from 'is-browser';

declare global {
  interface Window {
    analytics: any;
  }
}

interface Event {
  action:
    | 'AddToCart'
    | 'ApplyCoupon'
    | 'CompleteRegistration'
    | 'InitiateCheckout'
    | 'SubmitFeedback'
    | 'Purchase'
    | 'StartTrial'
    | 'Share'
    | 'Subscribe'
    | 'UpdateSetting'
    | 'ViewSchedule'
    | 'ViewContent';
  properties: Partial<{
    label: string;
    currency: string;
    value: number;
    variant: string;
    subject: Topic;
    content_name: string;
    content_ids: string[];
    content_type: 'product' | 'product_group';
  }>;
}

export const segmentSnippet = `
  !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="https://cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.1.0";
  analytics.load("${segmentOpts.key}");
  }}();
`;

export function resetAnalytics() {
  if (segmentOpts.enabled && isBrowser) {
    window.analytics.reset();
  }
}

export function identify(user: User) {
  if (segmentOpts.enabled && isBrowser) {
    window.analytics.identify(user.id, {
      email: user.email
    });
  }
}

export function logEvent(action: Event['action'], payload: Event['properties']) {
  if (payload.value && !payload.currency) {
    payload.currency = 'USD';
  }
  if (segmentOpts.enabled && isBrowser) {
    window.analytics.track(action, payload);
  }
}

export function logPageView(page: string, payload?: Event['properties']) {
  if (segmentOpts.enabled && isBrowser) {
    window.analytics.page(page, payload);
  }
}
