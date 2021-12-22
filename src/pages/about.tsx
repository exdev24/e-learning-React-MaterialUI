import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import Bullet from '../client/components/about/bullet';
import OurTeam from '../client/components/about/our-team';
import EmbedVideo from '../client/components/embed-video';
import Layout from '../client/components/layout';
import MainSection from '../client/components/main-section';
import NextMUIButton from '../client/components/next-mui-button';
import { CLASSES } from '../shared/constants';

const bannerCopy = {
  title: 'Are your kids ready for the future?',
  subtitle: 'The Bigger Picture Of STEM Learning',
  content:
    "The world is changing quickly. But education systems are slow to adapt. It is in every parent's and teacher's hand to help our kids grow up happy, successful, and achieving their full potential."
};

const heroCopy = {
  title: 'The Whole-Brain Approach',
  subtitle: 'From Learning to Creating',
  image: {
    src: 'https://d1gkbsep9lajkq.cloudfront.net/blooms-min.png',
    style: {
      maxHeight: 300,
      display: 'block',
      margin: '0 auto'
    }
  },
  paragraphs: [
    "At Create & Learn, we take the whole-brain approach to STEAM learning. This means kids not only have hands-on experiences with latest technologies such as AI and Data Science, but more importantly,  we bring them all the way to the highest tier of learning which is to develop kids' creativity and critical thinking skills.",
    'This is why we are Create & Learn - from learning all the way to creating.'
  ]
};

const highlights: {
  title: string;
  image: { src: string; style?: React.CSSProperties };
  paragraphs: string[];
}[] = [
  {
    title: 'Have fun and see the world!',
    image: {
      src: 'https://d1gkbsep9lajkq.cloudfront.net/healthy-people.png',
      style: {
        maxWidth: 250,
        display: 'block',
        margin: '0 auto'
      }
    },
    paragraphs: [
      "We employ effective and creative <a href='https://www.media.mit.edu/groups/lifelong-kindergarten/overview/' target='_blank'>learning approaches advocated by MIT Media Lab</a> in every aspect of our curriculum design. In addition, we teach real-world technologies in context so kids can easily relate to them. And Fun goes far beyond being fun. :) Kids develop a deeper understanding when the learning process is relevant, relatable, and fun to them.",
      'Students also get a lot of opportunities to express their views and develop communication skills.'
    ]
  },
  {
    title: 'Critical Thinking & Creativity',
    image: {
      src: 'https://d1gkbsep9lajkq.cloudfront.net/top-skills-min.png',
      style: {
        display: 'block',
        margin: '0 auto',
        boxShadow:
          '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)'
      }
    },
    paragraphs: [
      "According to the <a href='https://www.weforum.org/agenda/2016/01/the-10-skills-you-need-to-thrive-in-the-fourth-industrial-revolution/' target='_blank'>World Economic Forum</a>, the top skills required for the future are higher order thinking skills such as problem-solving, creativity, and critical thinking. Unfortunately, studies show that only 4% of classroom work in the US schools require these skills.",
      'Problem-solving, creativity, and critical thinking are core parts of every single class at Create & Learn.'
    ]
  },
  {
    title: 'Learn Latest Technologies',
    image: {
      src: 'https://d1gkbsep9lajkq.cloudfront.net/creative-build.png',
      style: { display: 'block', margin: '0 auto' }
    },
    paragraphs: [
      "By 2045, <a href='https://en.wikipedia.org/wiki/Technological_singularity' target='_blank'>$1000 is expected to purchase more computational power than all the humans combined</a>. While technologies continue to evolve, many fundamental principles stay relatively the same.  And the exposure to a diverse set of technologies will build the knowledge base for creativity and growing curiosity."
    ]
  }
];

export default class AboutUs extends React.Component {
  renderParagraphs(paragraphs: string[]) {
    return (
      <Typography
        paragraph
        color="textSecondary"
        variant="subtitle1"
        component="div"
        dangerouslySetInnerHTML={{
          __html: paragraphs.map(text => `<p>${text}</p>`).join('')
        }}
      />
    );
  }

  render() {
    return (
      <Layout title="About Us">
        <MainSection
          stripe
          header={
            <>
              <Typography variant="h4" gutterBottom>
                {bannerCopy.title}
              </Typography>
              <Typography variant="h5" color="textSecondary">
                {bannerCopy.subtitle}
              </Typography>
            </>
          }
        >
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={7}>
              <EmbedVideo src="https://www.youtube-nocookie.com/embed/2h5p54kKgyU" />
            </Grid>
            <Grid item xs={12} md={5}>
              <Typography variant="subtitle1" style={{ marginBottom: 32 }}>
                {bannerCopy.content}
              </Typography>
              <NextMUIButton
                color="secondary"
                size="large"
                variant="contained"
                next={{
                  href: {
                    hash: CLASSES,
                    pathname: '/'
                  }
                }}
              >
                Act Now!
              </NextMUIButton>
            </Grid>
          </Grid>
        </MainSection>
        <MainSection
          header={
            <>
              <Typography variant="h4" gutterBottom>
                {heroCopy.title}
              </Typography>
              <Typography variant="h5" color="textSecondary">
                {heroCopy.subtitle}
              </Typography>
            </>
          }
        >
          <Bullet alignLeft={false} image={heroCopy.image} title={heroCopy.title}>
            {this.renderParagraphs(heroCopy.paragraphs)}
          </Bullet>
        </MainSection>
        {highlights.map((highlight, idx) => (
          <MainSection key={idx} stripe={idx % 2 === 0}>
            <Bullet
              alignLeft={idx % 2 === 0}
              image={highlight.image}
              title={highlight.title}
            >
              <Typography variant="h5" align="center" style={{ marginBottom: 32 }}>
                {highlight.title}
              </Typography>
              {this.renderParagraphs(highlight.paragraphs)}
            </Bullet>
          </MainSection>
        ))}
        <OurTeam />
      </Layout>
    );
  }
}
