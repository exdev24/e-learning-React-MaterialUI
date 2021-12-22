import gql from 'graphql-tag';
import { Project, ProjectFragment, User } from './data-models';
import { IDVars } from '../../types';

export interface Reaction extends IDVars {
  content: string;
  createdAt: string;
  user: Pick<User, 'id' | 'firstName'>;
}

export interface ProjectDetailsResult {
  project: Project & {
    student: {
      id: string;
      name: string;
      avatar: string;
    };
    reactions: Reaction[];
  };
}

export const ProjectDetailsQuery = gql`
  ${ProjectFragment}
  query($id: ID!) {
    project(id: $id) {
      ...ProjectFragment
      student {
        id
        name
        avatar
      }
      reactions {
        id
        content
        createdAt
        user {
          id
          firstName
        }
      }
    }
  }
`;

export const AllFeaturedProjectListQuery = gql`
  ${ProjectFragment}
  query($featured: Boolean) {
    projects(featured: $featured) {
      ...ProjectFragment
      student {
        id
        name
        avatar
      }
    }
  }
`;

export const AddReactionMutation = gql`
  mutation($projectId: ID!, $content: String!) {
    addReaction(projectId: $projectId, content: $content) {
      id
    }
  }
`;

export const DeleteReactionMutation = gql`
  mutation($id: ID!) {
    deleteReaction(id: $id)
  }
`;
