import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  List,
  Paper
} from '@material-ui/core';
import { blue, orange } from '@material-ui/core/colors';
import {
  EventAvailable,
  ExpandMore,
  FaceRounded,
  InfoRounded,
  PaymentRounded,
  QueryBuilderRounded,
  SubjectRounded
} from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { regularPerUnitPrice } from 'cl-common';
import dynamic from 'next/dynamic';
import React from 'react';
import { preferenceFormUrl } from '../../../shared/constants';
import { CourseWithClasses } from '../../graphql/catalog-queries';
import { getTopicLink } from '../../lib/url-utils';
import DiscountPricing from '../discount-pricing';
import ExternalLink from '../external-link';
import NextMUILink from '../next-mui-link';
import ClassListingRow from './class-listing-row';
import InfoListItem from './info-list-item';

const CourseCard = dynamic(() => import('./course-card'), { ssr: false });

interface Props {
  course: CourseWithClasses;
}

export default function CourseDetailsCamp(props: Props) {
  const [expanded, setExpanded] = React.useState(false);

  const grades = `Grades ${props.course.grades.join('-')}`;

  return (
    <Grid id={props.course.id} container spacing={4}>
      <Grid item xs={12} sm={4}>
        <Paper>
          <img src={props.course.thumbnail} alt={props.course.name} />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={8}>
        <CourseCard
          color={blue}
          name={props.course.name}
          content={
            <List disablePadding dense>
              <InfoListItem Icon={FaceRounded} primary={grades} />
              <InfoListItem
                Icon={SubjectRounded}
                primary={props.course.description}
              />

              <InfoListItem
                Icon={QueryBuilderRounded}
                primary="4 Sessions"
                secondary={`${props.course.duration} Minutes Per Session`}
              />

              <InfoListItem
                Icon={PaymentRounded}
                primary={
                  <DiscountPricing
                    priceInCents={regularPerUnitPrice * 50}
                    badge="50% Off"
                  >
                    <del>${regularPerUnitPrice}</del>
                  </DiscountPricing>
                }
                secondary="Max Enrollment Per Class: 4 Students"
              />

              {props.course.info && (
                <InfoListItem Icon={InfoRounded} primary={props.course.info} />
              )}

              <InfoListItem
                Icon={EventAvailable}
                primary={
                  <Button
                    color="primary"
                    size="small"
                    variant="contained"
                    disabled={expanded}
                    onClick={() => {
                      setExpanded(true);
                      if (window.scrollBy) {
                        window.scrollBy({
                          top: 300,
                          behavior: 'smooth'
                        });
                      }
                    }}
                  >
                    Show Camp Schedules
                  </Button>
                }
              />
            </List>
          }
        >
          <Accordion
            square
            expanded={expanded}
            onChange={(evt, expanded) => setExpanded(expanded)}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              style={{ color: orange.A700, fontWeight: 'bold' }}
            >
              {expanded
                ? 'All Camps Before This Date Are Full'
                : 'Show Camp Schedules'}
            </AccordionSummary>
            <AccordionDetails style={{ display: 'block' }}>
              {props.course.upcomingClasses.map(klass => (
                <ClassListingRow
                  key={klass.id}
                  klass={klass}
                  price={props.course.price}
                />
              ))}
              <Alert color="info" style={{ margin: '24px 0' }}>
                <div>
                  {'Do you prefer weekly afterschool classes? '}
                  <NextMUILink
                    next={getTopicLink(props.course.subjectId)}
                    color="secondary"
                    title={props.course.name}
                  >
                    Click here
                  </NextMUILink>
                  {
                    ' to check out our regular class schedule and the free introduction class.'
                  }
                </div>
              </Alert>
              <ExternalLink color="secondary" href={preferenceFormUrl}>
                Need a time that works better? Please tell us your preferences here.
              </ExternalLink>
            </AccordionDetails>
          </Accordion>
        </CourseCard>
      </Grid>
    </Grid>
  );
}
