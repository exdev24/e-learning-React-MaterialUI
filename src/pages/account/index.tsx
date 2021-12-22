import { useQuery } from '@apollo/react-hooks';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  DialogContent,
  IconButton
} from '@material-ui/core';
import { AddOutlined } from '@material-ui/icons';
import { AvatarGroup } from '@material-ui/lab';
import { useRouter } from 'next/router';
import React from 'react';
import AccountNavs from '../../client/components/account-navs';
import ModalWrapper from '../../client/components/modal-wrapper';
import PreflightCheck from '../../client/components/preflight-check';
import UserAvatar from '../../client/components/user-avatar';
import AccountSummary from '../../client/components/user-info/account-summary';
import AddStudentForm from '../../client/components/user-info/add-student-form';
import {
  UserSummaryQuery,
  UserSummaryResult
} from '../../client/graphql/user-queries';
import { getMyClassesLink } from '../../client/lib/url-utils';

export default function AccountPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);

  const result = useQuery<UserSummaryResult>(UserSummaryQuery, {
    fetchPolicy: 'cache-and-network'
  });

  if (!result.data || !result.data.user) {
    return <PreflightCheck error={result.error} loading={result.loading} />;
  }

  const { children } = result.data.user;

  if (children.length > 0) {
    return (
      <AccountNavs>
        <ModalWrapper
          open={isEditing}
          title="Add a Student"
          onClose={() => setIsEditing(false)}
          maxWidth="md"
        >
          <DialogContent>
            <AddStudentForm
              submitLabel="Save"
              onCompleted={data => {
                setIsEditing(false);
                const studentLink = getMyClassesLink(data.student);
                router.push(studentLink.href, studentLink.as);
              }}
            />
          </DialogContent>
        </ModalWrapper>
        {children.map(child => (
          <AccountSummary key={child.id} student={child} />
        ))}
        <AvatarGroup style={{ justifyContent: 'flex-end' }}>
          {children.map(child => (
            <UserAvatar user={child} key={child.id} />
          ))}
          <Avatar>
            <IconButton color="secondary" onClick={() => setIsEditing(true)}>
              <AddOutlined />
            </IconButton>
          </Avatar>
        </AvatarGroup>
      </AccountNavs>
    );
  }

  return (
    <AccountNavs>
      <Card>
        <CardHeader title="Add a Student" />
        <CardContent>
          <AddStudentForm
            submitLabel="Save"
            onCompleted={data => {
              const studentLink = getMyClassesLink(data.student);
              router.push(studentLink.href, studentLink.as);
            }}
          />
        </CardContent>
      </Card>
    </AccountNavs>
  );
}
