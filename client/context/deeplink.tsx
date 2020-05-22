import React from 'react';
import { Deeplink } from '../../types';
import { NextRouter } from 'next/router';

export const DeeplinkContext = React.createContext<Deeplink>({});

export class DeeplinkProvider extends React.Component<
  { router: NextRouter; children: React.ReactNode },
  Deeplink
> {
  constructor(props) {
    super(props);
    this.state = {
      email: this.getValue('email'),
      name: this.getValue('name'),
      coupon: this.getValue('coupon')
    };
  }

  getValue(key: string) {
    const value = this.props.router.query[key];
    return Array.isArray(value) ? value[0] : value || '';
  }

  render() {
    return (
      <DeeplinkContext.Provider value={this.state}>
        {this.props.children}
      </DeeplinkContext.Provider>
    );
  }
}
