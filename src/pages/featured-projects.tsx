import { useQuery } from '@apollo/react-hooks';
import {
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
  Avatar,
  CardHeader
} from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';

import Layout from '../client/components/layout';
import PreflightCheck from '../client/components/preflight-check';
import ContainerWrapper from '../client/components/container-wrapper';
import { ProjectWithStudent } from '../client/graphql/data-models';
import { AllFeaturedProjectListQuery } from '../client/graphql/project-queries';
import { routeIds, routePrefixes } from '../shared/constants';

export default function FeaturedProjects() {
  const router = useRouter();
  const projectsResult = useQuery<{ projects: ProjectWithStudent[] }, any>(
    AllFeaturedProjectListQuery,
    {
      variables: { featured: true }
    }
  );

  if (!projectsResult.data) {
    return (
      <PreflightCheck
        loading={projectsResult.loading}
        error={projectsResult.error}
      />
    );
  }
  const { projects } = projectsResult.data;
  if (!projects) {
    return <PreflightCheck statusCode={404} />;
  }

  const goToProjectpage = (id: string) => {
    router.push(routeIds.project, routePrefixes.project + id);
  };

  const goToStudentPage = (id: string) => {
    router.push(routePrefixes.myProjects + '[sid]', routePrefixes.myProjects + id);
  };

  return (
    <Layout>
      <ContainerWrapper>
        <CardHeader title="All Featured Projects" />
        <GridList cellHeight={250}>
          {projects.map(project => (
            <GridListTile
              key={project.id}
              onClick={() => goToProjectpage(project.id)}
            >
              <img src={project.preview} alt={project.title} />
              <GridListTileBar
                title={project.title}
                subtitle={<span>by: {project.student.name}</span>}
                actionIcon={
                  <IconButton
                    onClick={evt => {
                      evt.stopPropagation();
                      goToStudentPage(project.student.id);
                    }}
                  >
                    <Avatar src={project.student.avatar} />
                  </IconButton>
                }
              />
            </GridListTile>
          ))}
        </GridList>
      </ContainerWrapper>
    </Layout>
  );
}
