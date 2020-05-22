import { InputAdornment, TextField } from '@material-ui/core';
import { SvgIconComponent } from '@material-ui/icons';
import React from 'react';

interface Props {
  id: string;
  label: string;
  Icon: SvgIconComponent;
}

function HostedField({ id, label, Icon }: Props) {
  return (
    <TextField
      fullWidth
      label={label}
      InputLabelProps={{
        htmlFor: id
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Icon />
          </InputAdornment>
        ),
        // eslint-disable-next-line react/display-name
        inputComponent: (props: any) => <div className={props.className} id={id} />
      }}
    />
  );
}

export default React.memo(HostedField);
