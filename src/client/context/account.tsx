import { useQuery } from '@apollo/react-hooks';
import { defaultTimezone } from 'cl-common';
import { Settings } from 'luxon';
import React from 'react';
import { UserWithChildren } from '../graphql/data-models';
import { GetUserChildrenQuery, UserChildrenResponse } from '../graphql/user-queries';
import { identify } from '../lib/analytics';

export const AccountContext = React.createContext<{
  user?: UserWithChildren;
  setUser: (user: UserWithChildren) => void;
  localZone: string;
}>({
  localZone: defaultTimezone,
  setUser() {} // eslint-disable-line
});

export const AccountProvider = (props: { children: React.ReactNode }) => {
  const { data, client } = useQuery<UserChildrenResponse>(GetUserChildrenQuery);

  return (
    <AccountContext.Provider
      value={{
        localZone: Settings.defaultZoneName,
        user: data?.user,
        setUser(user: UserWithChildren) {
          identify(user);
          client.writeQuery({
            query: GetUserChildrenQuery,
            data: { user }
          });
        }
      }}
    >
      {props.children}
    </AccountContext.Provider>
  );
};
