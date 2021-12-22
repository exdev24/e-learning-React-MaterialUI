import { Avatar, AvatarProps } from '@material-ui/core';
import { defaultAvatarUrl } from 'cl-common';
import React from 'react';
import { Author } from '../../types';

interface Props extends AvatarProps {
  user?:
    | Author
    | {
        avatar: string;
        fullName: string;
      };
}

function UserAvatar({ user, ...avatarProps }: Props) {
  let avatarUrl = '';
  let name = '';

  if (user) {
    if (user.avatar) {
      avatarUrl = user.avatar;
    } else {
      name = 'name' in user ? user.name : user.fullName;
    }
  } else {
    avatarUrl = defaultAvatarUrl;
  }

  return avatarUrl ? (
    <Avatar src={avatarUrl} {...avatarProps} />
  ) : (
    <Avatar {...avatarProps}>{name.charAt(0)}</Avatar>
  );
}

export default React.memo(UserAvatar);
