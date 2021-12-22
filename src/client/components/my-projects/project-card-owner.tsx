import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import React from 'react';
import { Project, Student } from '../../graphql/data-models';
import { useMutation } from '@apollo/react-hooks';
import { IDVars } from '../../../types';
import { StudentProjectsQuery } from '../../graphql/user-queries';
import { DeleteProjectMutation } from '../../../pages/my-projects/[sid]';
import { useAlert } from 'react-alert';
import ProjectCard from './project-card';

interface Props {
  project: Project;
  student: Student;
  onClickEdit: () => void;
}

export default function ProjectCardOwner({ student, project, onClickEdit }: Props) {
  const alert = useAlert();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleEdit = () => {
    onClickEdit();
    setAnchorEl(null);
  };

  const [deleteProject, deleteResult] = useMutation<any, IDVars>(
    DeleteProjectMutation,
    {
      onCompleted: () => {
        setAnchorEl(null);
      },
      onError() {
        alert.error('fail to delete project, please fix error and try again');
      },
      variables: {
        id: project.id
      },
      refetchQueries: [
        {
          query: StudentProjectsQuery,
          variables: { id: student.id }
        }
      ]
    }
  );

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={() => deleteProject()} disabled={deleteResult.loading}>
          Delete
        </MenuItem>
      </Menu>
      <ProjectCard
        project={project}
        headerProps={{
          subheader: project.published
            ? 'Published Publicly'
            : 'Private to Yourself',
          action: (
            <IconButton onClick={handleClickMenu}>
              <MoreVert />
            </IconButton>
          )
        }}
      />
    </>
  );
}
