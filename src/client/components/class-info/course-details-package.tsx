import { Grid, List, Paper } from '@material-ui/core';
import { orange } from '@material-ui/core/colors';
import {
  FaceRounded,
  PaymentRounded,
  QueryBuilderRounded,
  SubjectRounded
} from '@material-ui/icons';
import React from 'react';
import { getPackagePrice, savingPercentageInPackage } from '../../../shared/pricing';
import { ClassLite, SubjectWithCourses } from '../../graphql/data-models';
import DiscountPricing from '../discount-pricing';
import ClassListingRow from './class-listing-row';
import CollapsibleList from './collapsible-list';
import CourseCard from './course-card';
import InfoListItem from './info-list-item';

export default function CourseDetailsPackage(props: {
  subject: SubjectWithCourses;
  klasses?: ClassLite[];
}) {
  const courses = props.subject.courses.filter(
    c => c.level > 0 && c.level <= props.subject.exitLevel
  );

  if (courses.length === 0 || courses[0].level !== 1) {
    return null;
  }

  const grades = courses[courses.length - 1].grades.join(' - ');
  const totalWeeks = courses.length * 4;
  const [listingPrice, promoPrice] = getPackagePrice(courses);

  const klasses = props.klasses?.filter(k => {
    if (k.courseId !== courses[0].id || k.isFull) {
      return false;
    }

    return k.isCamp || k.isWeekly;
  });

  return (
    <Grid container spacing={4} id="all">
      <Grid item xs={12} sm={4}>
        <Paper>
          <img src={props.subject.thumbnail} alt={props.subject.name} />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={8}>
        <CourseCard
          color={orange}
          name={`${props.subject.name} (Units 1 - ${props.subject.exitLevel})`}
          content={
            <List disablePadding dense>
              <InfoListItem Icon={FaceRounded} primary={`Grades ${grades}`} />
              <InfoListItem
                Icon={QueryBuilderRounded}
                primary={`${props.subject.exitLevel} Units / ${totalWeeks} Weeks`}
                secondary="Each unit consists of four 1-hour sessions"
              />
              {courses.map(course => (
                <InfoListItem
                  key={course.id}
                  Icon={SubjectRounded}
                  secondary={course.description}
                  primary={
                    <a
                      href={'#' + course.id}
                      style={{ fontWeight: 'bold', textDecoration: 'underline' }}
                    >
                      {props.subject.name} - Unit {course.level}
                    </a>
                  }
                />
              ))}
              <InfoListItem
                Icon={PaymentRounded}
                primary={
                  <DiscountPricing
                    priceInCents={promoPrice * 100}
                    badge={`${savingPercentageInPackage}% Off`}
                  >
                    <del>${listingPrice}</del>
                  </DiscountPricing>
                }
              />
            </List>
          }
        >
          {klasses && (
            <CollapsibleList
              items={klasses}
              emptyMessage="New schedules will be announced soon"
              itemRenderer={klass => (
                <ClassListingRow
                  key={klass.id}
                  klass={klass}
                  unitCount={props.subject.exitLevel}
                  price={listingPrice}
                  wholePackage
                />
              )}
            />
          )}
        </CourseCard>
      </Grid>
    </Grid>
  );
}
