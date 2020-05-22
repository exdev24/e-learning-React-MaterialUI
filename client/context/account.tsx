import { useQuery } from '@apollo/react-hooks';
import { Settings } from 'luxon';
import React from 'react';
import { UserWithChildren } from '../graphql/data-models';
import { GetUserChildrenQuery, UserChildrenResponse } from '../graphql/user-queries';
import { identify } from '../lib/analytics';

//https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
const timezoneAlias = {
  'America/Montreal': 'America/Toronto',
  'Asia/Chongqing': 'Asia/Shanghai',
  'Asia/Harbin': 'Asia/Shanghai'
};

export const AccountContext = React.createContext<{
  user?: UserWithChildren;
  setUser: (user: UserWithChildren) => void;
  localZone: string;
}>({
  localZone: Settings.defaultZoneName,
  setUser() {} // eslint-disable-line
});

export const AccountProvider = (props: { children: React.ReactNode }) => {
  const { data, client } = useQuery<UserChildrenResponse>(GetUserChildrenQuery);
  let localZone = Settings.defaultZoneName;
  if (localZone in timezoneAlias) {
    localZone = timezoneAlias[localZone];
  }

  return (
    <AccountContext.Provider
      value={{
        localZone,
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
