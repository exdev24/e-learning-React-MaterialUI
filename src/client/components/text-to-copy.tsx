import {
  FormControl,
  IconButton,
  InputAdornment,
  InputBase,
  InputLabel,
  makeStyles
} from '@material-ui/core';
import { FileCopy } from '@material-ui/icons';
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const useStyles = makeStyles(theme => ({
  wrapper: {
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    position: 'relative',
    marginTop: theme.spacing(2)
  },
  input: {
    padding: '10px 14px',
    fontWeight: theme.typography.fontWeightMedium,
    fontFamily:
      'SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace'
  }
}));

export default function TextToCopy(props: {
  label?: string;
  content: string;
  onCopy: () => void;
}) {
  const classes = useStyles({});

  return (
    <div className={classes.wrapper}>
      <FormControl variant="outlined" fullWidth>
        {props.label && (
          <InputLabel disableAnimation variant="outlined" shrink>
            {props.label}
          </InputLabel>
        )}
        <InputBase
          readOnly
          value={props.content}
          className={classes.input}
          endAdornment={
            <InputAdornment position="end">
              <CopyToClipboard text={props.content} onCopy={props.onCopy}>
                <IconButton color="secondary">
                  <FileCopy />
                </IconButton>
              </CopyToClipboard>
            </InputAdornment>
          }
        />
      </FormControl>
    </div>
  );
}
