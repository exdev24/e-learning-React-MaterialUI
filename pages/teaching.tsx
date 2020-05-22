import React from 'react';
import Layout from '../client/components/layout';
import PDFEmbed from '../client/components/pdf';
import { Pdfs } from '../shared/constants';

export default function TeachingPage() {
  return (
    <Layout basic title="Teacher Catalog">
      <PDFEmbed page="TeacherCatalog" url={Pdfs.TeacherCatalog} />
    </Layout>
  );
}
