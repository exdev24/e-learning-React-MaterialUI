import { useApolloClient } from '@apollo/react-hooks';
import { makeStyles, Typography } from '@material-ui/core';
import gql from 'graphql-tag';
import React from 'react';
import Dropzone from 'react-dropzone-uploader';
import { mediaTypes } from '../../../shared/constants';
import { QueryArgs } from '../../../types';

interface Props {
  onChange: (fileUrl: string, added: boolean) => void;
  maxFiles?: number;
}

const UserUploadQuery = gql`
  query($name: String!, $type: String!) {
    userUpload(name: $name, type: $type) {
      fileUrl
      uploadUrl
    }
  }
`;

interface UserUploadQueryResult {
  userUpload: {
    fileUrl: string;
    uploadUrl: string;
  };
}

const useStyles = makeStyles(theme => ({
  dropzone: {
    padding: 0,
    border: `1px inset ${theme.palette.divider}`
  },
  inputLabel: {
    display: 'block',
    padding: theme.spacing(1),
    textAlign: 'center',
    cursor: 'pointer'
  },
  inputLabelWithFiles: {
    display: 'none'
  },
  previewImage: {
    maxWidth: 160,
    maxHeight: 90
  }
}));

const maxSize = 20;

export default function PhotoSelector(props: Props) {
  const classes = useStyles(props);
  const client = useApolloClient();

  let maxFiles = 1;
  let multiple = false;
  let placeholder = 'Select an Image or Video';

  if (props.maxFiles > 1) {
    maxFiles = props.maxFiles;
    multiple = true;
    placeholder = `Select up to ${maxFiles} Images or Videos`;
  }

  return (
    <Dropzone
      maxFiles={maxFiles}
      multiple={multiple}
      classNames={classes}
      accept={Object.keys(mediaTypes).join(',')}
      maxSizeBytes={maxSize * 1024 * 1024}
      inputContent={
        <div key="dropzone-preview">
          <Typography variant="subtitle1" color="secondary">
            {placeholder}
          </Typography>
          <Typography variant="subtitle2">
            Drag a file into this box or select from your device.
          </Typography>
        </div>
      }
      getUploadParams={opts =>
        client
          .query<UserUploadQueryResult, QueryArgs.UserUpload>({
            query: UserUploadQuery,
            variables: {
              name: opts.file.name,
              type: opts.file.type
            }
          })
          .then(result => ({
            method: 'PUT',
            body: opts.file,
            url: result.data.userUpload.uploadUrl,
            meta: {
              fileUrl: result.data.userUpload.fileUrl
            }
          }))
      }
      onChangeStatus={(result, status) => {
        if (status === 'done') {
          props.onChange(result.meta['fileUrl'] as string, true);
          return;
        }

        if (status === 'removed') {
          props.onChange(result.meta['fileUrl'] as string, false);
          return;
        }
      }}
    />
  );
}
