import {
  Box,
  IconButton,
  InputAdornment,
  TextFieldProps,
  TextField
} from '@material-ui/core';
import { SendRounded } from '@material-ui/icons';
import { Picker } from 'emoji-mart';
import React from 'react';

type Props = TextFieldProps & {
  loading: boolean;
  onSelectEmoji: (emoji: any) => void;
};

export default function EmojiInput({
  loading,
  onSelectEmoji,
  ...inputProps
}: Props) {
  return (
    <Box my={3} boxShadow={1} borderRadius={3}>
      <TextField
        {...inputProps}
        fullWidth
        InputProps={{
          readOnly: !inputProps.onChange,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton type="submit" disabled={loading} color="secondary">
                <SendRounded />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <Picker
        title=""
        showPreview={false}
        showSkinTones={false}
        onSelect={onSelectEmoji}
        style={{
          width: '100%',
          border: '0 none',
          borderRadius: 0
        }}
      />
    </Box>
  );
}
