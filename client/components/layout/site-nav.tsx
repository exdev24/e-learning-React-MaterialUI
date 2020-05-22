import { Box, Button, Hidden, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { socialLinks } from 'common';
import React from 'react';
import { CLASSES, routeIds } from '../../../shared/constants';
import { useTranslation } from '../../../shared/i18n';
import { AccountContext } from '../../context/account';
import NextMUIButton from '../next-mui-button';
import SideDrawer from './side-drawer';
import TopNav from './top-nav';
import { useRouter } from 'next/router';

export default function SiteNav() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = React.useContext(AccountContext);

  const [isDrawerOpen, setDrawerOpen] = React.useState(false);
  const closeDrawer = () => setDrawerOpen(false);
  const openDrawer = () => setDrawerOpen(true);

  React.useEffect(closeDrawer, [router.asPath]);

  return (
    <>
      <TopNav>
        <Hidden implementation="css" smDown>
          <Box display="flex">
            <NextMUIButton next={{ href: { pathname: '/', hash: CLASSES } }}>
              {t('menu.classes')}
            </NextMUIButton>
            <NextMUIButton next={{ href: routeIds.technews }}>
              {t('menu.technews')}
            </NextMUIButton>
            <Button href={socialLinks.blog}>{t('menu.blog')}</Button>
            {user ? (
              <NextMUIButton next={{ href: routeIds.account }}>
                {t('menu.account')}
              </NextMUIButton>
            ) : (
              <NextMUIButton
                variant="outlined"
                color="secondary"
                className="register"
                next={{ href: routeIds.signup }}
              >
                {t('menu.auth')}
              </NextMUIButton>
            )}
          </Box>
        </Hidden>
        <IconButton
          color="inherit"
          onClick={openDrawer}
          style={{ marginLeft: 'auto' }}
        >
          <MenuIcon />
        </IconButton>
      </TopNav>
      <SideDrawer
        user={user}
        closeDrawer={closeDrawer}
        isDrawerOpen={isDrawerOpen}
      />
    </>
  );
}
