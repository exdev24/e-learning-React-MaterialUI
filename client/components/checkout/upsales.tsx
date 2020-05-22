import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from '@material-ui/core';
import { purple } from '@material-ui/core/colors';
import { TrendingDownRounded } from '@material-ui/icons';
import React from 'react';
import {
  describeCoupon,
  formatCents,
  PriceBreakdown
} from '../../../shared/pricing';
import { KlassWithOffer } from '../../graphql/enrollment-queries';
import DiscountPricing from '../discount-pricing';

interface Props {
  klass: KlassWithOffer;
  priceBreakdown: PriceBreakdown;
  bundleSize: number;
}

export default function Upsales(props: Props) {
  const { offer } = props.klass;

  if (!offer) {
    return null;
  }

  return (
    <List
      dense
      style={{ marginBottom: 24 }}
      subheader={
        <ListSubheader>
          To help strong kids keep up the learning momentum, we have credited your
          account with
        </ListSubheader>
      }
    >
      <ListItem disableGutters>
        <ListItemIcon>
          <TrendingDownRounded style={{ color: purple[600] }} />
        </ListItemIcon>
        <ListItemText
          primary={
            <DiscountPricing
              priceInCents={props.priceBreakdown.price}
              badge={describeCoupon(offer, props.bundleSize)}
            >
              <del>{formatCents(props.priceBreakdown.listingPrice)}</del>
            </DiscountPricing>
          }
          secondary={`Use coupon code ${offer.code}, ${offer.description}.`}
        />
      </ListItem>
    </List>
  );
}
