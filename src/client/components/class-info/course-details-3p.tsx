import { Grid, List, Paper } from '@material-ui/core';
import { deepOrange } from '@material-ui/core/colors';
import {
  FaceRounded,
  InfoRounded,
  QueryBuilderRounded,
  SubjectRounded
} from '@material-ui/icons';
import dynamic from 'next/dynamic';
import React from 'react';
import { ClassLite, Course } from '../../graphql/data-models';
import { darken, lighten } from '../../lib/color';
import ClassListingRow from './class-listing-row';
import CollapsibleList from './collapsible-list';
import InfoListItem from './info-list-item';

const CourseCard = dynamic(() => import('./course-card'), { ssr: false });

interface Props {
  themeColor?: string;
  course: Course;
  klasses: ClassLite[];
}

export default function CourseDetails3rdParty(props: Props) {
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
          color={
            props.themeColor
              ? { 500: lighten(props.themeColor), 700: darken(props.themeColor) }
              : deepOrange
          }
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
                primary={`${props.course.duration} Minutes Per Session`}
              />

              {props.course.info && (
                <InfoListItem Icon={InfoRounded} primary={props.course.info} />
              )}
            </List>
          }
        >
          <CollapsibleList
            items={props.klasses}
            emptyMessage="No active classes are listed, please check back later"
            itemRenderer={klass => (
              <ClassListingRow
                key={klass.id}
                klass={klass}
                price={props.course.price}
              />
            )}
          />
        </CourseCard>
      </Grid>
    </Grid>
  );
}
