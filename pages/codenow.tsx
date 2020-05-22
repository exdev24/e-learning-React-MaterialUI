import { Box, Button, DialogContent, Typography } from '@material-ui/core';
import React from 'react';
import BetterWay from '../client/components/about/better-way';
import CustomerSays from '../client/components/about/customer-says';
import InSchools from '../client/components/about/in-schools';
import TalingPoints, { keyBullets } from '../client/components/about/talking-points';
import ClassListingCTA from '../client/components/class-listing-cta';
import Layout from '../client/components/layout';
import MainHeader from '../client/components/main-header';
import MainSection from '../client/components/main-section';
import ModalWrapper from '../client/components/modal-wrapper';
import CourseListing from '../client/components/squeeze/course-listing';
import { logPageView } from '../client/lib/analytics';
import { CLASSES, contactEmail, routeIds, salesList } from '../shared/constants';

const title = "Power Up Your Kids' Future \n with Tech Classes They Love";
const ctaLabel = 'View Courses';

export default function CodeNow() {
  const [showFinePrints, setShowFinePrints] = React.useState(false);

  React.useEffect(() => logPageView('SalesSqueeze'), []);

  return (
    <Layout basic title={title}>
      <ModalWrapper
        open={showFinePrints}
        onClose={() => setShowFinePrints(false)}
      >
        <DialogContent>
          <Typography paragraph>
            {`If at anytime you feel like our classes aren't fun enough for your kids, or that they are not learning as much as you expected, or you think they are just following instructions without much critical thinking, simply email us at ${contactEmail} and we will return 100% of all of your money back immediately — no questions asked.`}
          </Typography>
          <Typography paragraph>
            {`If you aren't satisfied we would not feel right keeping your money, so we make it very easy to get a full refund. And just to be clear, there are no strings attached, no forms to fill out, nothing to prove and we promise we won't question you. Please email us anytime at ${contactEmail} if you have questions.`}
          </Typography>
        </DialogContent>
      </ModalWrapper>
      <MainHeader>
        <Typography
          variant="h3"
          color="inherit"
          align="center"
          gutterBottom
          style={{ whiteSpace: 'pre-line' }}
        >
          {title}
        </Typography>
        <Typography variant="h5" color="inherit" align="center">
          Artificial Intelligence, Robotics, Coding and more
        </Typography>
        <ClassListingCTA label={ctaLabel} />
      </MainHeader>
      <MainSection
        maxWidth="md"
        header={
          <>
            <Typography variant="h5" gutterBottom>
              Brought to You by Senior Tech & Education Experts Who Worked at Google,
              Apple, Stanford
            </Typography>
            <Button
              href="https://youtu.be/CyWDrRRK5Z0"
              target="_blank"
              rel="noopener noreferrer"
              color="secondary"
              variant="contained"
            >
              Meet the Founder
            </Button>
          </>
        }
      >
        <TalingPoints bullets={keyBullets} />
        <ClassListingCTA label={ctaLabel} />
      </MainSection>
      <MainSection>
        <BetterWay />
      </MainSection>
      <MainSection id={CLASSES}>
        <CourseListing courseIds={salesList} cta="Check Schedule & Enroll" />
      </MainSection>
      <CustomerSays />
      <InSchools includeVideo={false} />
      <MainSection
        maxWidth="md"
        style={{ textAlign: 'center' }}
        header={
          <Typography variant="h4">Like It or Not, Our Kids Will Grow Up</Typography>
        }
      >
        <Typography variant="h6" color="textSecondary">
          And, it is up to us, as parents, to make sure, even if it seems far in the
          future, that when they do grow up, they are equipped with the skills needed
          to be successful in this new and ever changing world. But will they? That
          depends on the decisions YOU make today.
        </Typography>
        <ClassListingCTA label="Sign Up for a Class" />
        <Box mt={5} display="flex" justifyContent="center" alignItems="center">
          <Typography variant="subtitle1">Not sure if it is a good fit?</Typography>
          <Button href={routeIds.vschool + '#' + CLASSES} color="primary">
            Try a Free Session
          </Button>
        </Box>
      </MainSection>
    </Layout>
  );
}
