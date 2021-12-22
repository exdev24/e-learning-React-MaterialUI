import React from 'react';
import { chatbotOpts } from '../../runtime';
import HtmlHead, { HeadProps } from './html-head';
import SiteFooter from './site-footer';
import SiteNav from './site-nav';
import TopNav from './top-nav';

interface Props extends HeadProps {
  children: React.ReactNode;
  basic?: boolean;
  chatWidget?: boolean;
}

declare global {
  interface Window {
    fcWidget?: any;
  }
}

export default class Layout extends React.PureComponent<Props> {
  loadFcWidget = () => {
    window.fcWidget.init({
      token: chatbotOpts.token,
      host: 'https://wchat.freshchat.com'
    });
  };

  componentDidMount() {
    const scriptId = 'freshchat-widget';
    if (!this.props.chatWidget || !chatbotOpts.enabled) {
      return;
    }

    if (document.getElementById(scriptId)) {
      // prevent double loading on different pages
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://wchat.freshchat.com/js/widget.js';
    script.id = scriptId;
    document.body.appendChild(script);
    script.onload = this.loadFcWidget;
  }

  render() {
    const { basic, children, ...headProps } = this.props;
    return (
      <>
        <HtmlHead {...headProps} />
        {basic ? <TopNav /> : <SiteNav />}
        <main>{children}</main>
        <SiteFooter />
      </>
    );
  }
}
