import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { defaultBannerUrl, twitterHandle } from '../../../shared/constants';
import { useTranslation } from '../../../shared/i18n';
import { getSiteUrl } from '../../lib/url-utils';

export interface HeadProps {
  title?: string;
  description?: string;
  image?: string;
  pathname?: string;
  noIndex?: boolean;
  links?: { key: string; rel: 'stylesheet'; href: string }[];
}

const defaultTitle = 'Best Online Kids Coding Classes - Robotics, Minecraft, AI...';
const defaultDescription =
  'Do you want your children to learn coding at the pace of innovation? Join our classes with live instructors delivering fun, interactive, cutting-edge lessons in AI, Robotics, Data Science, and more.';

export default function HtmlHead(props: HeadProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const title = props.title || defaultTitle;
  const description = props.description || defaultDescription;
  const url = getSiteUrl(props.pathname || router.asPath);
  const image = props.image || defaultBannerUrl;

  return (
    <Head>
      <title>
        {title} | {t('site_name')}
      </title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {props.noIndex && <meta name="robots" content="noindex" />}
      {props.links &&
        props.links.map(link => (
          <link key={link.key} rel={link.rel} href={link.href} />
        ))}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={t('site_name')} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      <meta property="twitter:card" content="summary" />
      <meta property="twitter:site" content={'@' + twitterHandle} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:image" content={image} />
    </Head>
  );
}
