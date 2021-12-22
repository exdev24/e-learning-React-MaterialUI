import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { amber } from '@material-ui/core/colors';
import { DateTime } from 'luxon';
import React from 'react';
import { ClassLite, Course } from '../../graphql/data-models';
import { getListableClassGroups } from '../../lib/class-list-helper';

interface Props {
  course: Course;
  klasses: ClassLite[];
  handleSelect: (c: ClassLite) => void;
  selectedId?: string;
}

export default class GroupedClassListing extends React.PureComponent<Props> {
  renderItem(klass: ClassLite, idx: number) {
    const start = DateTime.fromISO(klass.startDate);
    const end = DateTime.fromISO(klass.endDate);

    if (start.hour < 8 || start.hour > 20) {
      return null;
    }

    const selected = klass.id === this.props.selectedId;

    return (
      <TableRow key={klass.id} selected={selected}>
        <TableCell>
          {idx === 0 && (
            <>
              <Typography
                color="secondary"
                variant="h6"
                style={{ fontWeight: 'bold' }}
              >
                {start.weekdayShort}
              </Typography>
              <Typography color="secondary" variant="caption">
                {start.toLocaleString(DateTime.DATE_MED)}
              </Typography>
            </>
          )}
        </TableCell>
        <TableCell>
          <div>{start.toFormat('t - ') + end.toFormat('t')}</div>
          <Typography variant="caption" color="textSecondary">
            {start.offsetNameLong}
          </Typography>
        </TableCell>
        <TableCell align="right">
          {klass.isFull ? (
            <Button variant="contained" disabled size="small">
              Class is Full
            </Button>
          ) : (
            <Button
              color="primary"
              size="small"
              className="select"
              variant={selected ? 'text' : 'contained'}
              onClick={this.props.handleSelect.bind(this, klass)}
            >
              Select
            </Button>
          )}
        </TableCell>
      </TableRow>
    );
  }

  render() {
    const { klasses } = this.props;

    if (klasses.length === 0) {
      return (
        <Box my={3} p={2} style={{ backgroundColor: amber[600], color: 'white' }}>
          New sessions will be announced soon!
        </Box>
      );
    }

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell variant="head">Date</TableCell>
            <TableCell variant="head">Hours</TableCell>
            <TableCell variant="head" />
          </TableRow>
        </TableHead>
        <TableBody>
          {getListableClassGroups(klasses).map(group =>
            group.map(this.renderItem, this)
          )}
        </TableBody>
      </Table>
    );
  }
}
