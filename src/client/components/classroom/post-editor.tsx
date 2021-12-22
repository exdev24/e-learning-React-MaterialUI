import { useMutation } from '@apollo/react-hooks';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  IconButton
} from '@material-ui/core';
import { lightBlue } from '@material-ui/core/colors';
import { AttachFileSharp } from '@material-ui/icons';
import { ApolloError, PureQueryOptions } from 'apollo-client';
import { Editor, EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import React from 'react';
import { MutationArgs } from '../../../types';
import { AddThreadMutation } from '../../graphql/classroom-queries';
import CLButton from '../cl-button';
import PhotoUploader from '../pictures/photo-uploader';

export default function PostEditor(props: {
  studentId: string;
  classId: string;
  onError: (err: ApolloError) => void;
  refetchQuery: PureQueryOptions;
}) {
  const [attachments, setAttachments] = React.useState<string[]>([]);
  const [expanded, setExpanded] = React.useState(false);
  const emptyState = React.useMemo(() => EditorState.createEmpty(), []);
  const [editorState, setEditorState] = React.useState(emptyState);
  const editorRef = React.useRef<Editor>(null);

  const resetEditor = () => {
    setAttachments([]);
    setExpanded(false);
    setEditorState(emptyState);
  };

  const [addThread, addThreadState] = useMutation<any, MutationArgs.AddThread>(
    AddThreadMutation,
    {
      onError: props.onError,
      onCompleted: resetEditor,
      refetchQueries: [props.refetchQuery]
    }
  );

  const editorContent = editorState.getCurrentContent();

  return (
    <Card>
      <CardContent
        onClick={() => editorRef.current?.focus()}
        style={{
          minHeight: 96,
          backgroundColor: lightBlue[50],
          padding: 16,
          borderBottom: '1px solid lightGrey'
        }}
      >
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={setEditorState}
          placeholder="Share something with your class"
        />
      </CardContent>
      <Collapse in={expanded} unmountOnExit>
        <PhotoUploader
          maxFiles={3}
          onChange={(fileUrl, added) => {
            if (added) {
              setAttachments(attachments.concat(fileUrl));
            } else {
              setAttachments(attachments.filter(file => file !== fileUrl));
            }
          }}
        />
      </Collapse>
      <CardActions>
        <IconButton onClick={() => setExpanded(!expanded)}>
          <AttachFileSharp />
        </IconButton>
        <Button style={{ marginLeft: 'auto' }} onClick={resetEditor}>
          Cancel
        </Button>
        <CLButton
          disabled={!editorContent.hasText()}
          variant="contained"
          color="primary"
          loading={addThreadState.loading}
          onClick={() =>
            addThread({
              variables: {
                studentId: props.studentId,
                classId: props.classId,
                content: stateToHTML(editorContent),
                attachments
              }
            })
          }
        >
          Post
        </CLButton>
      </CardActions>
    </Card>
  );
}
