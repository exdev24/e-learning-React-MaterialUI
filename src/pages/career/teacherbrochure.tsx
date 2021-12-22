import React from 'react';
import Layout from '../../client/components/layout';
import PDFEmbed from '../../client/components/pdf';
import { Pdfs } from '../../shared/constants';

export default function TeacherBrochurePage() {
  return (
    <Layout basic title="Teacher Brochure">
      <PDFEmbed page="TeacherBrochure" url={Pdfs.TeacherBrochure} />
    </Layout>
  );
}
