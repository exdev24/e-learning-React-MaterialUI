import { useQuery } from '@apollo/react-hooks';
import {
  Box,
  Button,
  Card,
  CardMedia,
  Dialog,
  Grid,
  Hidden,
  MenuItem,
  Select,
  Typography
} from '@material-ui/core';
import { pink } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import ContainerWrapper from '../client/components/container-wrapper';
import Layout from '../client/components/layout';
import PreflightCheck from '../client/components/preflight-check';
import SocialBar from '../client/components/social-bar';
import TechnewsArchives from '../client/components/technews-archives';
import TechnewsArticles from '../client/components/technews-articles';
import {
  MonthlyStats,
  TechnewsQuery,
  TechnewsQueryResult
} from '../client/graphql/technews-queries';
import { logEvent } from '../client/lib/analytics';
import { getSiteUrl } from '../client/lib/url-utils';
import { routeIds } from '../shared/constants';
import { QueryArgs } from '../types';

const shareMessage =
  'Check this out! Carefully curated technology news for kids grades K-12. It is an awesome way to get kids excited about science and technologies and keep them interested';
const title = 'Tech News for the Young Curious Minds';
const description =
  'Rockets are heading to Mars. Artificial intelligence is creating arts and music. Genome technologies are finding new ways to help us stay healthy. So many tech developments happen everyday. We are sharing the most exciting ones with you here. Enjoy!';

const useStyles = makeStyles(theme => ({
  header: {
    backgroundColor: theme.palette.background.default,
    paddingTop: '25%'
  },

  headline: {
    color: pink.A700,
    '&:after': {
      content: '" "',
      height: 3,
      maxWidth: 150,
      display: 'block',
      backgroundColor: theme.palette.secondary.light,
      marginTop: theme.spacing(2)
    }
  },

  dropdown: {
    borderRadius: 4,
    backgroundColor: theme.palette.primary.main,
    width: '100%',
    textTransform: 'capitalize'
  },

  icon: {
    color: theme.palette.common.white
  },
  select: {
    color: theme.palette.common.white,
    padding: theme.spacing(1, 2),
    width: '100%'
  },

  submit: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    width: '100%',
    marginTop: theme.spacing(4)
  },

  contact: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(3),
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.secondary.contrastText
  }
}));

interface TeachnewsVars extends QueryArgs.Articles {
  withStats: boolean;
}

export default function Technews(props: { month?: string }) {
  const classes = useStyles(props);
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [area, setArea] = React.useState('');
  const [grade, setGrade] = React.useState('');
  const [monthlyStats, setMonthlyStats] = React.useState<MonthlyStats[]>();

  const variables: TeachnewsVars = {
    withStats: !monthlyStats
  };

  if (props.month) {
    variables.selectedMonth = props.month;
  } else {
    variables.limit = 30;
  }

  const result = useQuery<TechnewsQueryResult, TeachnewsVars>(TechnewsQuery, {
    variables,
    onCompleted(data) {
      if (data.articlesStats) {
        setMonthlyStats(data.articlesStats);
      }
    }
  });

  if (!result.data) {
    return <PreflightCheck error={result.error} loading={result.loading} />;
  }

  const { articles } = result.data;
  const areaOptions: Record<string, boolean> = {};
  const gradeOptions: Record<string, boolean> = {};

  articles.forEach(article => {
    article.areas.forEach(value => {
      areaOptions[value] = true;
    });
    article.grades.forEach(value => {
      gradeOptions[value] = true;
    });
  });

  return (
    <Layout title={title} description={description} image={bannerImageUrl}>
      <ContainerWrapper>
        <Dialog
          maxWidth="sm"
          fullWidth
          open={isModalOpen}
          onClose={() => setModalOpen(false)}
        >
          <iframe
            src="https://cdn.forms-content.sg-form.com/c8b06de3-275d-11ea-a164-6248bee80de7"
            frameBorder="0"
            style={{ height: 540, display: 'block' }}
          />
        </Dialog>
        <CardMedia image={bannerImageUrl} className={classes.header} />
        <SocialBar
          url={getSiteUrl(routeIds.technews)}
          placeholder={shareMessage}
          actionLabel="Technews"
          justify="flex-end"
          style={{ marginTop: 8 }}
        >
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => setModalOpen(true)}
          >
            Subscribe
          </Button>
        </SocialBar>
        <Typography variant="h4" className={classes.headline}>
          {title}
        </Typography>
        <Box mt={3} mb={4}>
          {description}
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Age Group:
            </Typography>
            <Select
              value={grade}
              onChange={evt => {
                const grade = evt.target.value as string;
                setGrade(grade);
                logEvent('UpdateSetting', {
                  label: 'Filter Technews',
                  variant: grade
                });
              }}
              disableUnderline={true}
              className={classes.dropdown}
              classes={{
                select: classes.select,
                icon: classes.icon
              }}
            >
              <MenuItem value="">All</MenuItem>
              {Object.keys(gradeOptions).map(value => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Category:
            </Typography>
            <Select
              value={area}
              onChange={evt => {
                const area = evt.target.value as string;
                setArea(area);
                logEvent('UpdateSetting', {
                  label: 'Filter Technews',
                  variant: area
                });
              }}
              disableUnderline={true}
              className={classes.dropdown}
              classes={{
                select: classes.select,
                icon: classes.icon
              }}
            >
              <MenuItem value="">All</MenuItem>
              {Object.keys(areaOptions).map(value => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
            <Hidden smDown implementation="css">
              <TechnewsArchives monthlyStats={monthlyStats} />
              <Card className={classes.contact}>
                <Typography variant="h5" color="inherit" gutterBottom>
                  Submit News
                </Typography>
                <Typography gutterBottom color="inherit">
                  Seen a tech news you are very excited about? We would love to hear
                  it too!
                </Typography>
                <Button
                  variant="contained"
                  className={classes.submit}
                  href="https://docs.google.com/forms/d/1bzbNK1rrarrvE6PkhakRJPUNOHmbNyK0ei2MvZH036Y/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share News
                </Button>
              </Card>
            </Hidden>
          </Grid>
          <Grid item xs={12} sm={9}>
            <TechnewsArticles area={area} grade={grade} articles={articles} />
          </Grid>
        </Grid>
      </ContainerWrapper>
    </Layout>
  );
}
