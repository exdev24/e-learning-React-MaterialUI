import { Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from '../../../shared/i18n';
import MainSection from '../main-section';

const testimonials = [
  {
    title: 'From Kids',
    icon: 'https://cdn.create-learn.us/images/students.jpeg',
    color: 'rgb(194, 215, 152)',
    quotes: [
      ['It is now my favorite subject.', '5th Grader in Palo Alto Unified'],
      [
        'I wish I can take more of these classes soon.',
        '4th Grader in Sunnyvale School District'
      ],
      [
        'I want to do more, even if it is the same classes. It was so much fun.',
        '4th Grader in Fremont Unified'
      ]
    ]
  },
  {
    title: 'From Educators',
    icon: 'https://cdn.create-learn.us/images/educator.jpeg',
    color: 'rgb(114, 190, 248)',
    quotes: [
      [
        'I have seen many data science curriculum. This by far is most relevant and relatable to kids.',
        'Tech Manager @ Digital Nest'
      ],
      [
        'After using the data science slides in class, I believe every classroom should use them with their students.',
        'Teacher @ Palo Alto Unified'
      ]
    ]
  },
  {
    title: 'From Parents',
    icon: 'https://cdn.create-learn.us/images/parents.jpeg',
    color: 'rgb(227, 168, 189)',
    quotes: [
      [
        'The content is fantastic. My son could never have learned it elsewhere.',
        'Engineer @ Google'
      ],
      ['What you teach is pioneering.', 'Machine Learning Researcher @ Apple'],
      [
        'My daughter loves this class because it is so relatable.',
        'Data Scientist @ Stanford Health'
      ]
    ]
  }
];

const useStyles = makeStyles(theme => ({
  avatar: {
    backgroundColor: theme.palette.grey[100],
    borderRadius: '50%',
    overflow: 'hidden',
    borderWidth: 8,
    borderStyle: 'solid'
  },

  squareBox: {
    position: 'relative',
    overflow: 'hidden',
    maxWidth: 128,
    margin: '15px auto',
    '&:before': {
      content: '""',
      display: 'block',
      paddingTop: '100%'
    },
    '& $avatar': {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  },

  title: {
    fontWeight: theme.typography.fontWeightMedium,
    textAlign: 'center',
    margin: theme.spacing(2, 0)
  },

  quote: {
    textAlign: 'center',
    color: theme.palette.text.hint
  }
}));

export default function CustomerSays(props: { stripe?: boolean }) {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <MainSection
      stripe={props.stripe}
      header={
        <>
          <Typography variant="h4" gutterBottom>
            {t('customers.title')}
          </Typography>
          <Typography variant="h6" color="textSecondary">
            {t('customers.subtitle')}
          </Typography>
        </>
      }
    >
      <Grid container>
        {testimonials.map((testimonial, idx) => (
          <Grid item xs={12} md={4} key={idx}>
            <div className={classes.squareBox}>
              <div
                className={classes.avatar}
                style={{ borderColor: testimonial.color }}
              >
                <img src={testimonial.icon} alt={testimonial.title} />
              </div>
            </div>
            <Typography
              variant="subtitle1"
              className={classes.title}
              style={{ color: testimonial.color }}
            >
              {testimonial.title}
            </Typography>
            {testimonial.quotes.map((quote, idx) => (
              <blockquote className={classes.quote} key={idx}>
                <Typography variant="body2" color="textPrimary">
                  {quote[0]}
                </Typography>
                <small>{quote[1]}</small>
              </blockquote>
            ))}
          </Grid>
        ))}
      </Grid>
    </MainSection>
  );
}
