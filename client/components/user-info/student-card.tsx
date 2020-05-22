import {
  Button,
  Card,
  CardHeader,
  CardMedia,
  IconButton,
  useTheme
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import React from 'react';
import { defaultCoverUrl } from '../../../shared/constants';
import { Student } from '../../graphql/data-models';
import { getMyClassesLink } from '../../lib/url-utils';
import NextMUILink from '../next-mui-link';
import UserAvatar from '../user-avatar';
import DeleteStudentModal from './delete-student-modal';
import EditCoverModal from './edit-cover-modal';
import EditStudentModal from './edit-student-modal';

enum ModalMode {
  default,
  editProfile,
  editCover,
  delete
}

export default function StudentCards(props: { student: Student }) {
  const theme = useTheme();
  const [mode, setMode] = React.useState(ModalMode.default);
  const onClose = () => setMode(ModalMode.default);

  return (
    <Card>
      {mode === ModalMode.editProfile && (
        <EditStudentModal
          student={props.student}
          onClose={onClose}
          onDelete={() => setMode(ModalMode.delete)}
        />
      )}
      {mode === ModalMode.delete && (
        <DeleteStudentModal student={props.student} onClose={onClose} />
      )}
      {mode === ModalMode.editCover && (
        <EditCoverModal student={props.student} onClose={onClose} />
      )}
      <CardMedia
        image={props.student.cover || defaultCoverUrl}
        style={{
          height: 160,
          position: 'relative'
        }}
      >
        <Button
          variant="outlined"
          size="small"
          color="inherit"
          onClick={() => setMode(ModalMode.editCover)}
          style={{
            margin: theme.spacing(2),
            backgroundColor: theme.palette.grey[300]
          }}
        >
          Update Cover Photo
        </Button>
      </CardMedia>
      <CardHeader
        avatar={<UserAvatar user={props.student} />}
        title={
          <NextMUILink
            next={getMyClassesLink(props.student)}
            color="secondary"
            variant="h6"
            noWrap
          >
            {props.student.name}
          </NextMUILink>
        }
        action={
          <IconButton onClick={() => setMode(ModalMode.editProfile)}>
            <MoreVert />
          </IconButton>
        }
      />
    </Card>
  );
}
