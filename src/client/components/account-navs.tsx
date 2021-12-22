import { Divider, Grid, Hidden, List, ListSubheader } from '@material-ui/core';
import {
  CardGiftcardOutlined,
  CollectionsOutlined,
  CreditCardOutlined,
  LibraryBooksOutlined,
  SettingsOutlined
} from '@material-ui/icons';
import { useRouter } from 'next/router';
import React from 'react';
import { routeIds } from '../../shared/constants';
import { AccountContext } from '../context/account';
import { getMyClassesLink, getMyProjectsLink } from '../lib/url-utils';
import AccountNavItem from './account-nav-item';
import ContainerWrapper from './container-wrapper';
import Layout from './layout';
import PreflightCheck from './preflight-check';

export default function AccountNavs(props: { children: React.ReactNode }) {
  const router = useRouter();
  const account = React.useContext(AccountContext);

  if (!account.user) {
    return <PreflightCheck statusCode={401} />;
  }

  return (
    <Layout noIndex title="Account">
      <ContainerWrapper>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            {account.user.children.map(child => (
              <List
                component="nav"
                dense
                disablePadding
                key={child.id}
                subheader={<ListSubheader>{child.name}</ListSubheader>}
              >
                <AccountNavItem
                  {...getMyClassesLink(child)}
                  asPath={router.asPath}
                  label="Class Schedules"
                  className="class_schedules"
                  Icon={LibraryBooksOutlined}
                />
                <AccountNavItem
                  {...getMyProjectsLink(child)}
                  asPath={router.asPath}
                  label="Portfolio"
                  Icon={CollectionsOutlined}
                />
              </List>
            ))}
            <Divider style={{ margin: '1em 0' }} />
            <Hidden smDown>
              <List component="nav" dense disablePadding>
                <AccountNavItem
                  href={routeIds.accountSettings}
                  asPath={router.asPath}
                  label="Settings"
                  subtitle="Account & Password"
                  Icon={SettingsOutlined}
                />
                <AccountNavItem
                  href={routeIds.refer}
                  asPath={router.asPath}
                  label="Refer a Friend"
                  subtitle="Share & Earn"
                  Icon={CardGiftcardOutlined}
                />
                <AccountNavItem
                  label="Payments"
                  subtitle="Cards and Credits"
                  asPath={router.asPath}
                  Icon={CreditCardOutlined}
                  href={routeIds.payments}
                />
              </List>
            </Hidden>
          </Grid>
          <Grid item xs={12} md={9}>
            {props.children}
          </Grid>
        </Grid>
      </ContainerWrapper>
    </Layout>
  );
}
