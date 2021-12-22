import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  LinearProgress,
  makeStyles,
  Typography
} from '@material-ui/core';
import { pink } from '@material-ui/core/colors';
import { DateTime } from 'luxon';
import React from 'react';
import ExternalLink from '../components/external-link';
import { TechnewsArticle } from '../graphql/technews-queries';
import { logEvent } from '../lib/analytics';

const useStyles = makeStyles(theme => ({
  media: {
    height: 0,
    backgroundColor: theme.palette.grey[200],
    borderBottom: `5px solid ${pink.A700}`,
    transform: 'translate3d(0,0,0)',
    paddingTop: '56.25%' // 16:9
  },
  timestamp: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    color: theme.palette.common.white,
    position: 'absolute',
    padding: '3px 6px',
    top: 6,
    right: 6
  }
}));

interface Props {
  grade: string;
  area: string;
  articles?: TechnewsArticle[];
}

export default function TechnewsArticles(props: Props) {
  const classes = useStyles(props);

  let articles = props.articles;
  if (props.articles && (props.area || props.grade)) {
    articles = props.articles.filter(article => {
      if (props.area && article.areas.indexOf(props.area) < 0) {
        return false;
      }
      if (props.grade && article.grades.indexOf(props.grade) < 0) {
        return false;
      }

      return true;
    });
  }

  if (!articles) {
    return <LinearProgress />;
  }

  return (
    <Grid container spacing={4}>
      {articles.map(article => (
        <Grid item xs={12} md={6} key={article.url}>
          <Card style={{ position: 'relative', borderRadius: 0 }}>
            <CardMedia
              className={classes.media}
              image={article.image}
              title={article.title}
            />
            <Typography className={classes.timestamp} variant="caption">
              {DateTime.fromISO(article.createdAt).toFormat('D')}
            </Typography>
            <CardContent>
              <Typography
                color="textSecondary"
                variant="caption"
                paragraph
                style={{ textTransform: 'uppercase' }}
              >
                {article.domain}
              </Typography>
              <ExternalLink
                variant="subtitle1"
                color="secondary"
                gutterBottom
                href={article.url}
                title={article.title}
                onClick={() =>
                  logEvent('ViewContent', {
                    label: 'TechnewsArticle',
                    variant: article.domain
                  })
                }
              >
                {article.title}
              </ExternalLink>
              <Typography paragraph color="textSecondary">
                {article.summary}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Why we like it
              </Typography>
              <Typography color="textSecondary">{article.comments}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
