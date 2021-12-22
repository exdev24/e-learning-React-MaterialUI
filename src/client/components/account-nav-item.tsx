import { ListItem, ListItemIcon, ListItemText, SvgIcon } from '@material-ui/core';
import NextLink, { LinkProps } from 'next/link';
import React from 'react';

interface NavProps extends LinkProps {
  label: string;
  subtitle?: string;
  asPath: string;
  Icon: typeof SvgIcon;
  className?: string;
}

export default function AccountNavItem({
  label,
  subtitle,
  Icon,
  asPath,
  className,
  ...linkProps
}: NavProps) {
  const isActive = asPath === linkProps.href || asPath === linkProps.as;

  return (
    <NextLink {...linkProps}>
      <ListItem button className={className}>
        <ListItemIcon>
          <Icon color={isActive ? 'secondary' : 'action'} />
        </ListItemIcon>
        <ListItemText
          primary={label}
          primaryTypographyProps={{
            color: isActive ? 'secondary' : 'inherit',
            style: { fontWeight: isActive ? 700 : 400 }
          }}
          secondary={subtitle}
        />
      </ListItem>
    </NextLink>
  );
}
