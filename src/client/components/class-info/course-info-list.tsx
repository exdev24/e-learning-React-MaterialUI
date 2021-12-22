import { List } from '@material-ui/core';
import {
  FaceRounded,
  InfoRounded,
  PaymentRounded,
  QueryBuilderRounded,
  SubjectRounded,
  PeopleOutlineRounded
} from '@material-ui/icons';
import React from 'react';
import { Topic } from 'cl-common';
import { Course } from '../../graphql/data-models';
import InfoListItem from './info-list-item';

export default function CourseInfoList(props: { course: Omit<Course, 'id'> }) {
  const grades = `Grades ${props.course.grades.join('-')}`;

  return (
    <List disablePadding dense>
      <InfoListItem Icon={FaceRounded} primary={grades} />
      <InfoListItem
        Icon={SubjectRounded}
        primary={props.course.description}
        primaryTypographyProps={{ style: { whiteSpace: 'pre-wrap' } }}
      />

      <InfoListItem
        Icon={QueryBuilderRounded}
        primary={`${props.course.duration} Minutes Per Session`}
      />

      {props.course.price > 0 && (
        <InfoListItem
          Icon={PaymentRounded}
          primary={`$${props.course.price} (USD)`}
          secondary="Max Enrollment Per Class: 5 Students"
        />
      )}

      {props.course.subjectId === Topic.WEBINARS && (
        <InfoListItem
          Icon={PeopleOutlineRounded}
          primary="Max Enrollment: 500 Students"
        />
      )}

      {props.course.info && (
        <InfoListItem Icon={InfoRounded} primary={props.course.info} />
      )}
    </List>
  );
}
