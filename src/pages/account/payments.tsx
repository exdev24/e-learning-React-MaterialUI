import { useQuery } from '@apollo/react-hooks';
import {
  Card,
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import { TrendingDown, TrendingUp } from '@material-ui/icons';
import { create } from 'braintree-web-drop-in';
import React from 'react';
import AccountNavs from '../../client/components/account-navs';
import PreflightCheck from '../../client/components/preflight-check';
import PasswordCheck from '../../client/components/user-info/password-check';
import {
  GetUserWithCreditsQuery,
  UserWithCreditsResponse
} from '../../client/graphql/user-queries';
import { formatCents } from '../../shared/pricing';

export default function AccountPayments() {
  const [isPasswordChecked, setPasswordCheck] = React.useState(false);
  const vault = React.useRef<HTMLDivElement>(null);

  const userResult = useQuery<UserWithCreditsResponse>(GetUserWithCreditsQuery, {
    returnPartialData: true
  });

  if (!userResult.data || !userResult.data.user) {
    return <PreflightCheck loading={userResult.loading} error={userResult.error} />;
  }

  const user = userResult.data.user;
  const credits = user?.credits || [];

  return (
    <AccountNavs>
      <Card elevation={0}>
        <CardHeader
          title={
            isPasswordChecked
              ? 'Your Payment Profiles'
              : 'Enter Password to Edit Payments'
          }
        />
        <div ref={vault} />
        {isPasswordChecked ? null : (
          <PasswordCheck
            email={user.email}
            setPasswordCheck={checked => {
              setPasswordCheck(checked);
              if (checked) {
                create({
                  authorization: user.braintreeToken,
                  container: vault.current,
                  vaultManager: true,
                  paypal: {
                    flow: 'vault'
                  },
                  card: {
                    cardholderName: true,
                    overrides: {}
                  }
                });
              }
            }}
          />
        )}
      </Card>

      {credits.length > 0 && (
        <Card style={{ marginTop: 40 }}>
          <CardHeader
            title={user ? `Credit Balance: ${formatCents(user.balanceInCents)}` : ''}
          />
          <List disablePadding dense>
            {credits.map(credit => (
              <ListItem key={credit.id} dense>
                <ListItemIcon>
                  {credit.cents > 0 ? (
                    <TrendingUp style={{ color: 'green' }} />
                  ) : (
                    <TrendingDown style={{ color: 'red' }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={formatCents(credit.cents)}
                  secondary={credit.reason}
                />
              </ListItem>
            ))}
          </List>
        </Card>
      )}
    </AccountNavs>
  );
}
