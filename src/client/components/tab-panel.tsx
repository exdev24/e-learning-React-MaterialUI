import React from 'react';
import { Typography } from '@material-ui/core';

interface Props<T> {
  children?: React.ReactNode;
  tabName: T;
  openTab: T;
}

export default function TabPanel<T>(props: Props<T>) {
  const { children, openTab, tabName, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={openTab !== tabName}
      id={`simple-tabpanel-${tabName}`}
      aria-labelledby={`simple-tab-${tabName}`}
      {...other}
    >
      {children}
    </Typography>
  );
}
