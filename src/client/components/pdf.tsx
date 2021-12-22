import PDFObject from 'pdfobject';
import React from 'react';
import { logPageView } from '../lib/analytics';

interface Props {
  url: string;
  page: string;
}

export default class PDFEmbed extends React.PureComponent<Props> {
  embed: React.RefObject<HTMLDivElement>;
  constructor(props: Props) {
    super(props);
    this.embed = React.createRef();
  }

  componentDidMount() {
    logPageView(this.props.page);
    PDFObject.embed(this.props.url, this.embed.current);
  }

  render() {
    return <div style={{ height: '100vh' }} ref={this.embed} />;
  }
}
