import gql from 'graphql-tag';
import { ClassroomFragment } from './data-models';

export const GetClassroomQuery = gql`
  ${ClassroomFragment}
  query($id: ID!, $studentId: ID) {
    classroom(id: $id, studentId: $studentId) {
      ...ClassroomFragment
    }
  }
`;

export const AddThreadMutation = gql`
  mutation(
    $classId: ID!
    $studentId: ID!
    $content: String!
    $attachments: [String]
  ) {
    addThread(
      classId: $classId
      studentId: $studentId
      content: $content
      attachments: $attachments
    ) {
      id
    }
  }
`;

export const AddProjectThreadMutation = gql`
  mutation(
    $classId: ID!
    $studentId: ID!
    $url: String!
    $preview: String!
    $title: String!
    $description: String!
    $published: Boolean
  ) {
    addProjectThread(
      classId: $classId
      studentId: $studentId
      url: $url
      preview: $preview
      title: $title
      description: $description
      published: $published
    ) {
      id
    }
  }
`;

export const DeleteThreadMutation = gql`
  mutation($id: ID!) {
    deleteThread(id: $id)
  }
`;

export const AddCommentMutation = gql`
  mutation($threadId: ID!, $studentId: ID!, $content: String!) {
    addComment(threadId: $threadId, studentId: $studentId, content: $content) {
      id
    }
  }
`;

export const DeleteCommentMutation = gql`
  mutation($id: ID!) {
    deleteComment(id: $id)
  }
`;
