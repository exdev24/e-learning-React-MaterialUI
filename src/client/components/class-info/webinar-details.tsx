import { Grid, Paper } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import React from 'react';
import { ClassLite, Course } from '../../graphql/data-models';
import ClassListRow from './class-listing-row';
import CourseCard from './course-card';
import CourseInfoList from './course-info-list';
import { Alert } from '@material-ui/lab';

export default function WebinarDetails(props: {
  course: Course;
  klasses?: ClassLite[];
}) {
  return (
    <Grid
      container
      spacing={4}
      id={props.course.id}
      style={{ marginBottom: '1em', padding: '1em' }}
    >
      <Grid item xs={12} sm={4}>
        <Paper>
          <img src={props.course.thumbnail} alt={props.course.name} />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={8}>
        <CourseCard
          color={green}
          name={props.course.name}
          content={<CourseInfoList course={props.course} />}
        >
          {props.klasses ? (
            props.klasses.map(k => (
              <ClassListRow key={k.id} klass={k} price={props.course.price} />
            ))
          ) : (
            <Alert>Event schedule will be announced soon</Alert>
          )}
        </CourseCard>
      </Grid>
    </Grid>
  );
}
