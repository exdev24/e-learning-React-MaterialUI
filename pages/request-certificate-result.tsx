import { Box, Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Star } from '@material-ui/icons';
import * as typeformEmbed from '@typeform/embed';
import React from 'react';
import Layout from '../client/components/layout';

const useStyles = makeStyles(theme => ({
  star: {
    color: '#FEDD16',
    fontSize: '3.5rem'
  },
  mainStar: {
    color: '#FEDD16',
    fontSize: '5rem'
  },
  header: {
    fontWeight: theme.typography.fontWeightBold,
    textTransform: 'capitalize',
    textAlign: 'center',
    margin: theme.spacing(2, 0),
    fontSize: '1.85rem'
  },
  subHeader: {
    fontWeight: theme.typography.fontWeightBold,
    textTransform: 'uppercase',
    textAlign: 'center',
    fontSize: '1.3rem',
    lineHeight: '1.5rem'
  },
  form: {
    height: '40vh',
    maxHeight: 640
  }
}));

export default function RequestCertificateResult() {
  const formUrl = 'https://developerplatform.typeform.com/to/NbGKXu';
  const form = React.createRef<HTMLDivElement>();
  const classes = useStyles({});

  React.useEffect(() => {
    typeformEmbed.makeWidget(form.current, formUrl);
  }, [form]);

  return (
    <Layout basic title="Request course certificate">
      <Container maxWidth="md">
        <Box pt={6} textAlign="center">
          <Star className={classes.star} />
          <Star className={classes.mainStar} />
          <Star className={classes.star} />
        </Box>
        <Typography variant="h4" className={classes.header}>
          Certificate of achievement
        </Typography>
        <Typography variant="h6" className={classes.subHeader}>
          Delivered to you <br /> by email in 2-3 days
        </Typography>
        <div ref={form} className={classes.form} />
      </Container>
    </Layout>
  );
}
