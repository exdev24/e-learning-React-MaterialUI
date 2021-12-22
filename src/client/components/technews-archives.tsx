import {
  Box,
  List,
  ListItem,
  ListItemSecondaryAction,
  makeStyles,
  Typography
} from '@material-ui/core';
import { DateTime } from 'luxon';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { routeIds } from '../../shared/constants';
import { MonthlyStats } from '../graphql/technews-queries';

const useStyles = makeStyles(theme => ({
  title: {
    ...theme.typography.subtitle1,
    padding: theme.spacing(0, 2)
  },

  count: {
    ...theme.typography.caption,
    color: theme.palette.text.secondary
  },

  menu: {
    color: 'inherit'
  },

  activeMenu: {
    color: theme.palette.primary.dark,
    cursor: 'default'
  }
}));

interface Props {
  monthlyStats?: MonthlyStats[];
}

export default function TechnewsArchives(props: Props) {
  const classes = useStyles(props);
  const router = useRouter();
  const selected = router.query && router.query.month;

  return (
    <Box my={3} pt={2}>
      <h4 className={classes.title}>Archives</h4>
      <List dense={true}>
        <NextLink href={routeIds.technews}>
          <ListItem button className={selected ? classes.menu : classes.activeMenu}>
            <Typography color="inherit" variant="subtitle2">
              Latest Articles
            </Typography>
          </ListItem>
        </NextLink>
        {props.monthlyStats &&
          props.monthlyStats.map(item => {
            const dt = DateTime.fromISO(item.month);
            const month = dt.toISODate();
            return (
              <ListItem button key={item.month}>
                <NextLink
                  href={{
                    pathname: routeIds.technews,
                    query: {
                      month: dt.toISODate()
                    }
                  }}
                >
                  <Typography
                    display="inline"
                    variant="subtitle2"
                    color={month === selected ? 'primary' : 'inherit'}
                  >
                    {dt.toFormat('LLLL yyyy')}
                  </Typography>
                </NextLink>
                <ListItemSecondaryAction className={classes.count}>
                  ({item.count})
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
      </List>
    </Box>
  );
}
