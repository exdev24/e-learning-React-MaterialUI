import { useQuery } from '@apollo/react-hooks';
import {
  Avatar,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader
} from '@material-ui/core';
import { socialLinks } from 'common';
import NextLink from 'next/link';
import React from 'react';
import { routeIds } from '../../../shared/constants';
import { useTranslation } from '../../../shared/i18n';
import {
  SubjectListQuery,
  SubjectListQueryResult
} from '../../graphql/catalog-queries';
import { UserWithChildren } from '../../graphql/data-models';
import { resetAnalytics } from '../../lib/analytics';
import { getMyClassesLink, getTopicLink } from '../../lib/url-utils';

interface Props {
  user?: UserWithChildren;
  isDrawerOpen: boolean;
  closeDrawer: () => void;
}

export default function SideDrawer({ closeDrawer, isDrawerOpen, user }: Props) {
  const { t } = useTranslation();
  const result = useQuery<SubjectListQueryResult>(SubjectListQuery, {
    skip: !isDrawerOpen,
    ssr: false
  });

  const subjects = result.data?.subjects;

  return (
    <Drawer anchor="right" open={isDrawerOpen} onClose={closeDrawer}>
      {user && (
        <List dense={true}>
          <NextLink href={routeIds.account}>
            <ListItem button>
              <ListItemAvatar>
                <Avatar>{user.firstName.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={t('menu.greeting', user)}
                secondary={user.email}
              />
            </ListItem>
          </NextLink>
          {user.children.map(child => (
            <NextLink key={child.id} {...getMyClassesLink(child)}>
              <ListItem button>
                <ListItemText primary={child.name} secondary="Class Schedules" />
              </ListItem>
            </NextLink>
          ))}
        </List>
      )}
      <Divider />
      {subjects && (
        <List dense={true}>
          <ListSubheader disableSticky>Classes</ListSubheader>
          {subjects.map(subject => (
            <NextLink key={subject.id} {...getTopicLink(subject.id)}>
              <ListItem style={{ maxWidth: 180, cursor: 'pointer' }}>
                <ListItemText
                  primary={subject.name}
                  primaryTypographyProps={{
                    color: 'textPrimary',
                    display: 'block'
                  }}
                  secondary={subject.headline}
                />
              </ListItem>
            </NextLink>
          ))}
        </List>
      )}
      <Divider />
      <List dense={true}>
        <NextLink href="/">
          <ListItem button>
            <ListItemText primary={t('menu.home')} />
          </ListItem>
        </NextLink>
        <NextLink href={routeIds.about}>
          <ListItem button>
            <ListItemText primary={t('menu.about')} />
          </ListItem>
        </NextLink>
        <NextLink href={routeIds.refer}>
          <ListItem button>
            <ListItemText primary={t('menu.byf')} />
          </ListItem>
        </NextLink>
        <NextLink href={routeIds.technews}>
          <ListItem button>
            <ListItemText primary={t('menu.technews')} />
          </ListItem>
        </NextLink>
        <ListItem button component="a" href={socialLinks.blog}>
          <ListItemText primary={t('menu.blog')} />
        </ListItem>
        {user ? (
          <>
            <NextLink href={routeIds.accountSettings}>
              <ListItem button>
                <ListItemText primary={t('menu.settings')} />
              </ListItem>
            </NextLink>
            <ListItem
              button
              onClick={() => {
                resetAnalytics();
                window.location.assign(routeIds.signout);
              }}
            >
              <ListItemText>{t('cta.logout')}</ListItemText>
            </ListItem>
          </>
        ) : (
          <>
            <NextLink href={routeIds.signin}>
              <ListItem button>
                <ListItemText>{t('cta.signin')}</ListItemText>
              </ListItem>
            </NextLink>
            <NextLink href={routeIds.signup}>
              <ListItem button>
                <ListItemText>{t('cta.signup')}</ListItemText>
              </ListItem>
            </NextLink>
          </>
        )}
      </List>
    </Drawer>
  );
}
