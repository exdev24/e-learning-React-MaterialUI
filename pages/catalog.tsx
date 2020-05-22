import React from 'react';
import Layout from '../client/components/layout';
import PDFEmbed from '../client/components/pdf';
import { Pdfs } from '../shared/constants';

export default function CatalogPage() {
  return (
    <Layout basic title="Class Catalog">
      <PDFEmbed page="Catalog2020" url={Pdfs.Catalog2020} />
    </Layout>
  );
}
