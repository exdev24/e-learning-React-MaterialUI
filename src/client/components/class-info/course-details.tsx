import { Grid, Paper } from '@material-ui/core';
import { blue, green } from '@material-ui/core/colors';
import React from 'react';
import { ClassLite, Course } from '../../graphql/data-models';
import ClassListingRow from './class-listing-row';
import CollapsibleList from './collapsible-list';
import CourseCard from './course-card';
import CourseInfoList from './course-info-list';

interface Props {
  course: Course;
  klasses?: ClassLite[];
}

export default class CourseDetails extends React.PureComponent<Props> {
  render() {
    const { course } = this.props;

    let hasOpen = false;
    const klasses = this.props.klasses?.filter(k => {
      if (k.courseId !== course.id) {
        return false;
      }

      if (k.isFull) {
        return hasOpen;
      }

      hasOpen = true;
      return true;
    });

    return (
      <Grid
        container
        spacing={4}
        id={course.id}
        style={{ marginBottom: '1em', padding: '1em' }}
      >
        <Grid item xs={12} sm={4}>
          <Paper>
            <img src={course.thumbnail} alt={course.name} />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={8}>
          <CourseCard
            color={course.price === 0 ? green : blue}
            name={course.name}
            content={<CourseInfoList course={course} />}
          >
            {klasses && (
              <CollapsibleList
                items={klasses}
                emptyMessage="New schedules will be announced soon"
                itemRenderer={klass => (
                  <ClassListingRow
                    key={klass.id}
                    klass={klass}
                    price={course.price}
                  />
                )}
              />
            )}
          </CourseCard>
        </Grid>
      </Grid>
    );
  }
}
