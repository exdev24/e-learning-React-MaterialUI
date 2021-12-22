import {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemTextProps
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import React from 'react';

interface Props extends ListItemTextProps {
  Icon: React.ElementType;
}

export default function InfoListItem({ Icon, ...textProps }: Props) {
  return (
    <ListItem disableGutters>
      <ListItemIcon>
        <Icon style={{ color: red[600] }} />
      </ListItemIcon>
      <ListItemText {...textProps} />
    </ListItem>
  );
}
