import { useQuery } from '@apollo/react-hooks';
import { Box, Button, ButtonGroup, Grid, LinearProgress } from '@material-ui/core';
import React from 'react';
import AccountNavs from '../../client/components/account-navs';
import AddProjectModal from '../../client/components/my-projects/add-project-modal';
import EditProjectModal from '../../client/components/my-projects/edit-project-modal';
import ProjectCard from '../../client/components/my-projects/project-card';
import NextMUIButton from '../../client/components/next-mui-button';
import PreflightCheck from '../../client/components/preflight-check';
import StudentCard from '../../client/components/user-info/student-card';
import { Project } from '../../client/graphql/data-models';
import {
  StudentProjectsQuery,
  StudentProjectsResult
} from '../../client/graphql/user-queries';
import { getMakerLink } from '../../client/lib/url-utils';
import { IDVars } from '../../types';

export default function MyProjectsPage(props: { sid: string }) {
  const [isAddingProject, setAdding] = React.useState(false);
  const [selected, selectProject] = React.useState<Project>(null);
  const onClose = () => selectProject(null);

  const result = useQuery<StudentProjectsResult, IDVars>(StudentProjectsQuery, {
    variables: { id: props.sid }
  });

  if (result.error) {
    return <PreflightCheck error={result.error} />;
  }

  if (!result.data || !result.data.student) {
    return (
      <AccountNavs>
        <LinearProgress />
      </AccountNavs>
    );
  }

  const { student } = result.data;

  return (
    <AccountNavs>
      {isAddingProject && (
        <AddProjectModal onClose={() => setAdding(false)} studentId={student.id} />
      )}
      {selected && <EditProjectModal open project={selected} onClose={onClose} />}
      <StudentCard student={student} />
      <Box textAlign="right" my={4}>
        <ButtonGroup color="primary" variant="outlined">
          <Button onClick={() => setAdding(true)}>Add a Project</Button>
          <NextMUIButton next={getMakerLink(student)}>
            View Public Portfolio
          </NextMUIButton>
        </ButtonGroup>
      </Box>

      {student.projects.length === 0 ? (
        <Box
          p={4}
          my={4}
          textAlign="center"
          borderRadius={4}
          border="1px dashed #ddd"
        >
          Show your talent and creativity by submitting a course project
        </Box>
      ) : (
        <Grid container spacing={4}>
          {student.projects.map(project => (
            <Grid key={project.id} item xs={12} md={6}>
              <ProjectCard
                project={project}
                onClickEdit={() => selectProject(project)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </AccountNavs>
  );
}
