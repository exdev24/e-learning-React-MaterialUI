import { Box, Grid, Typography } from '@material-ui/core';
import React from 'react';
import MainSection from '../main-section';

export interface People {
  name: string;
  avatar: string;
  headline: string;
  bullets: string[];
}

export const allMembers: People[] = [
  {
    name: 'Jessie Jiang',
    avatar: '/team/jessie.jpg',
    headline: 'Jessie loves learning and she has a 12 year old daughter.',
    bullets: [
      'Founder, CEO',
      'Previously Product Director, Google',
      'Stanford MBA, UCLA Computer Science Phd'
    ]
  },
  {
    name: 'Yuanzong Qiu',
    avatar: '/team/yuanzong.png',
    headline:
      'YZ loves hiking and travelling and his toddler recently started to develop independent intelligence.',
    bullets: [
      'Co-Founder, Head of Engineering',
      'Previously Senior Software Engineer Uber, Apple, and Amazon',
      'University of Florida, CS MS'
    ]
  },
  {
    name: 'Joanne Christina da Luz',
    avatar: '/team/joanne.jpg',
    headline:
      'Joanne loves food, soccer, and live music, in that order (or all at once, if possible!)',
    bullets: [
      'Lead Program Manager, Teaching & Learning Innovation',
      'Previously Director and Learning Engineer, Educents, Know Yourself, Design Tech High',
      'Stanford MEd, Mills MBA, UCSD BA'
    ]
  },
  {
    name: 'Darwin Bonifacio',
    avatar: '/team/darwin.jpg',
    headline: 'Darwin is a proud husband and father of two.',
    bullets: [
      'Senior Manager - Strategic Partnerships',
      'Built the largest Youth Coding Program in Oregon',
      'Launched Amazon Future Engineer in the Portland Metro',
      'Proud Husband & Father of two'
    ]
  },
  {
    name: 'Karen Zhang',
    avatar: '/team/karen.jpeg',
    headline: 'Karen loves snowboarding and the outdoors.',
    bullets: [
      'Marketing Manager',
      'Formerly Brand Manager at Procter & Gamble',
      'Senior Marketing Manager at Ermenegildo Zegna'
    ]
  }
];

function Member(props: People) {
  return (
    <Grid item xs={12} sm={6}>
      <Box boxShadow={2} borderRadius={4} style={{ float: 'left' }}>
        <img
          src={props.avatar}
          alt={props.name}
          style={{ width: 128, height: 128 }}
        />
      </Box>
      <div style={{ marginLeft: 128, minHeight: 128 }}>
        <Typography variant="h6" style={{ paddingLeft: '1rem' }}>
          {props.name}
        </Typography>
        <Typography component="ul" variant="subtitle2">
          {props.bullets.map((bullet, idx) => (
            <li key={idx}>{bullet}</li>
          ))}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
          style={{ paddingLeft: '1rem' }}
        >
          {props.headline}
        </Typography>
      </div>
    </Grid>
  );
}

function OurTeam() {
  return (
    <MainSection
      header={
        <>
          <Typography variant="h4" gutterBottom>
            Create & Learn Team
          </Typography>
          <Typography variant="h6" color="textSecondary">
            We are tech experts, parents, and educators. We are passionate about
            education and helping kids reach their full potential.
          </Typography>
        </>
      }
    >
      <Grid spacing={4} container>
        {allMembers.map((member, idx) => (
          <Member key={idx} {...member} />
        ))}
      </Grid>
    </MainSection>
  );
}

export default React.memo(OurTeam);
