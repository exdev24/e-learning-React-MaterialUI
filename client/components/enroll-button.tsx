import React from 'react';
import { routeIds } from '../../shared/constants';
import { useTranslation } from '../../shared/i18n';
import { AccountContext } from '../context/account';
import { ClassLite } from '../graphql/data-models';
import { getEnrollLink } from '../lib/url-utils';
import NextMUIButton from './next-mui-button';

export default function EnrollButton(props: {
  klass: ClassLite;
  isTrial?: boolean;
  wholePackage?: boolean;
}) {
  const account = React.useContext(AccountContext);
  const { t } = useTranslation();

  const enrollLink = getEnrollLink(props.klass, {
    wholePackage: props.wholePackage
  });

  let label = '';
  if (props.isTrial) {
    label = t('cta.enroll_trial');
  } else if (props.wholePackage) {
    label = t('cta.enroll_package');
  } else {
    label = t('cta.enroll');
  }

  return (
    <NextMUIButton
      color="primary"
      variant="contained"
      size="small"
      className="enroll_free"
      next={
        account.user
          ? enrollLink
          : {
              href: {
                pathname: routeIds.signin,
                query: {
                  next: enrollLink.as.toString()
                }
              }
            }
      }
    >
      {label}
    </NextMUIButton>
  );
}
