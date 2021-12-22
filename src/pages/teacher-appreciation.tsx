import { Grid, Paper, Typography, Link } from '@material-ui/core';
import React from 'react';
import ContainerWrapper from '../client/components/container-wrapper';
import Layout from '../client/components/layout';
import MainSection from '../client/components/main-section';
import NextMUIButton from '../client/components/next-mui-button';
import NextMUILink from '../client/components/next-mui-link';
import SocialBar from '../client/components/social-bar';
import { logPageView } from '../client/lib/analytics';
import { getSiteUrl } from '../client/lib/url-utils';
import { CLASSES, routeIds } from '../shared/constants';

const pageTitle = 'CheersForK12';
const pageDescription = 'While You Teach Our Children, We Want to Help with Yours';
const bannerImage =
  'https://cdn.create-learn.us/images/v2Cheers_Appreciation_Words.png';

const faqData = [
  {
    question: 'How many free camp classes are available?',
    answer:
      'We are offering a total of 250 camp classes, a combined value of over $30,000. We understand the demands are likely much higher. These classes are taught by experienced teachers live online with only up to 4 students per class. We also offer free introductions in coding, AI, and Data Science, as well as free Open Classes led by industry experts. They are always free and are open to everyone.'
  },
  {
    question: 'How many free classes can I register?',
    answer:
      'Each teacher’s family may register up to 2 camps for free. If you have two children, you may sign up for 1 class per child or 2 classes for one child. Only your own children are eligible. Please do not include children of any relatives or friends. We would like to have as many K12 teachers directly benefit from the program as possible.'
  },
  {
    question: 'Do I have to be a public school teacher to qualify?',
    answer:
      'Both public school and public charter school full-time teachers qualify. It must be an accredited K12 school.'
  },
  {
    question: 'How is this different from other free classes Create & Learn offers?',
    answer:
      'At Create & Learn, we offer free small group live introduction classes every day on a range of subjects such as Scratch coding, Python coding, AI, and Data Science. They help students get started on learning these subjects. We also offer free live Open Classes periodically which are led by industry experts and have hundreds of students each time. The Camp Classes go deeper and help students master the subjects. There are only 4 students in each Camp Class.'
  }
];

export default function TeacherAppreciation() {
  React.useEffect(() => logPageView('Cheers for K12'), []);

  return (
    <Layout title={pageTitle} description={pageDescription} image={bannerImage}>
      <ContainerWrapper>
        <img src={bannerImage} alt="Program Landing Image" />
        <MainSection
          header={
            <>
              <Typography variant="h3">{pageTitle}</Typography>
              <Typography variant="h6" gutterBottom color="textSecondary">
                {pageDescription}
              </Typography>
              <SocialBar
                url={getSiteUrl('/cheersfork12')}
                placeholder="Thank you Teachers! - Free Online Coding Class for Teachers Own Children. While You Teach Our Children, We Want to Help with Yours"
                avatarSize={40}
                actionLabel={pageTitle}
                justify="center"
              />
            </>
          }
        >
          <Typography component="div">
            <p>
              A few weeks ago, when millions of kids turned into homeschoolers
              overnight, many parents found out almost immediately that this teacher
              job is much harder than we thought :). Some cried, most gained renewed
              respect and appreciation for the hard work teachers put in day in and
              day out.
            </p>
            <p>
              As an appreciation of all the teachers out there, we are pleased to
              announce our Cheers for K12 program to offer 250 online&nbsp;
              <NextMUILink
                next={{ href: routeIds.camp }}
                color="secondary"
                title="camp classes"
              >
                camp classes
              </NextMUILink>
              {" free for K12 school teachers' families. If you are a K12 teacher, "}
              <NextMUILink
                next={{ href: routeIds.signup }}
                color="secondary"
                title="sign up"
              >
                sign up
              </NextMUILink>
              {' today'}
            </p>
          </Typography>
        </MainSection>
        <MainSection>
          <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }}>
            CheersForK12 Program Details
          </Typography>
          <Typography paragraph>
            {
              "CheersForK12 program offers 250 Camp Classes free to K12 school teachers' own children. If you are a K12 school teacher in the US, you're likely eligible for the program. Just go through the simple steps below to receive your free class."
            }
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            style={{ fontWeight: 'bold' }}
          >
            How to Receive the Free Class
          </Typography>
          <Typography paragraph>
            Here are the 3 simple steps to get your free class:
          </Typography>
          <Typography component="ol">
            <li>
              Sign up for a Create & Learn account&nbsp;
              <NextMUILink color="secondary" next={{ href: routeIds.signup }}>
                https://www.create-learn.us/signup
              </NextMUILink>
            </li>
            <li>
              Verify your teacher status by completing&nbsp;
              <Link
                color="secondary"
                href="https://forms.gle/mbC1n3H5EFCMi1vq6"
                title="Verify teacher form"
              >
                this form
              </Link>
            </li>
            <li>
              After you receive a confirmation email from us, check your Create &
              Learn account for a credit to register for a free camp
            </li>
          </Typography>
        </MainSection>

        <MainSection>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Paper>
                <img src="/images/k12-logo1.png" alt="About Create and Learn" />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }}>
                About Create & Learn
              </Typography>
              <Typography paragraph>
                Create & Learn is based in Silicon Valley and was founded by industry
                experts who previously worked at companies like Google and Apple, and
                are graduates of Stanford University. Our mission is to teach
                students in grades K-12 state-of-the-art computer technologies.
              </Typography>
              <Typography paragraph>
                Our classes cover a broad range of computer science topics such as
                coding, artificial intelligence, and robotics. We also place a strong
                focus on creativity, critical thinking, and problem solving skills.
              </Typography>
              <Typography paragraph>
                All of our classes run live online via video conferencing and are led
                by experienced teachers. Each Camp Class includes 4 one hour-long
                sessions and meets 2-3 sessions per week. There are only up to 4
                students in each Camp Class. There are multiple camps starting every
                week throughout the week.
              </Typography>
            </Grid>
          </Grid>
          <Typography>
            Teachers have always been a very important part of Create & Learn. For
            every enthusiastic young coder that keeps learning, there are great
            teachers that guide their way.
          </Typography>
        </MainSection>

        <MainSection
          header={<Typography variant="h4">Frequently Asked Questions</Typography>}
        >
          {faqData.map((faq, index) => (
            <React.Fragment key={index}>
              <Typography variant="subtitle1">{`Q: ${faq.question}`}</Typography>
              <Typography variant="body1" paragraph>{`A: ${faq.answer}`}</Typography>
            </React.Fragment>
          ))}
          <React.Fragment>
            <Typography variant="subtitle1">
              Q: As a public school teacher, can I use this free camp offering for my
              own classroom? In other words, can YOU all teach my students?
            </Typography>
            <Typography variant="body1" paragraph>
              A: We do offer a school pilot program, providing one free course for up
              to 24 students. Please indicate your interest&nbsp;
              <Link
                href="https://forms.gle/89HcfgKZLE6kmyXJ8"
                color="secondary"
                title="School Pilot with Create & Learn"
              >
                here.
              </Link>
            </Typography>
          </React.Fragment>
        </MainSection>

        <div style={{ textAlign: 'center' }}>
          <NextMUIButton
            color="primary"
            variant="contained"
            size="large"
            next={{ href: { pathname: '/', hash: CLASSES } }}
          >
            Signup for Free Introduction Classes & Open Classes
          </NextMUIButton>
        </div>
      </ContainerWrapper>
    </Layout>
  );
}
