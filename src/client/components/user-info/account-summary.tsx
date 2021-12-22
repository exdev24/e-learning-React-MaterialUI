import {
  Card,
  CardContent,
  GridListTileBar,
  makeStyles,
  Typography
} from '@material-ui/core';
import NextLink from 'next/link';
import React from 'react';
import { CLASSES } from '../../../shared/constants';
import { StudentSummary } from '../../graphql/user-queries';
import { getTopicLink } from '../../lib/url-utils';
import NextMUILink from '../next-mui-link';
import StudentCard from './student-card';
import Upcoming from './upcoming';

const useStyles = makeStyles(theme => ({
  wrapper: {
    marginBottom: theme.spacing(6),
    '&>div': {
      marginBottom: theme.spacing(4)
    }
  },

  carousel: {
    display: 'flex',
    overflow: 'auto',
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
    '&>a': {
      flexShrink: 0,
      width: 280,
      marginRight: theme.spacing(1),
      boxShadow: theme.shadows[2],
      position: 'relative',
      display: 'block',
      cursor: 'pointer',
      '&:last-of-type': {
        marginRight: 0
      }
    }
  },

  gridTileIcon: {
    color: 'rgba(255, 255, 255, 0.87)'
  }
}));

export default function AccountSummary(props: { student: StudentSummary }) {
  const classes = useStyles({});
  const recommendations = props.student.recommendations || [];
  const registrations = props.student.registrations || [];

  if (recommendations.length === 0 && registrations.length === 0) {
    return (
      <div className={classes.wrapper}>
        <StudentCard student={props.student} />
        <Card>
          <CardContent style={{ textAlign: 'center' }}>
            <NextMUILink
              variant="subtitle1"
              next={{ href: { pathname: '/', hash: CLASSES } }}
            >
              Enroll <strong>{props.student.name}</strong> today!
            </NextMUILink>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={classes.wrapper}>
      <StudentCard student={props.student} />
      <Upcoming student={props.student} registrations={registrations} />
      {recommendations.length > 0 && (
        <>
          <Typography variant="h6" color="primary" style={{ marginBottom: 16 }}>
            What other students are learning:
          </Typography>
          <div className={classes.carousel}>
            {recommendations.map(course => (
              <NextLink
                key={course.id}
                passHref
                {...getTopicLink(course.subjectId, {
                  courseId: course.id
                })}
              >
                <a>
                  <img src={course.thumbnail} alt={course.name} />
                  <GridListTileBar title={course.name} />
                </a>
              </NextLink>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
