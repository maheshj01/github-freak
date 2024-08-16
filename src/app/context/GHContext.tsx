import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import React, { createContext, useContext, useState } from 'react';

const GET_USER_DATA = gql`
  query GetUserData($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      email
      createdAt
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              weekday
              date
              contributionCount
              color
            }
          }
          months {
            name
            year
            firstDay
            totalWeeks
          }
        }
      }
    }
  }
`;

export function useGitHubContributionsQuery(username: string, fromDate: Date, toDate: Date) {
  return useQuery(GET_USER_DATA, {
    variables: {
      login: username,
      from: fromDate.toISOString(),
      to: toDate.toISOString()
    },
    fetchPolicy: 'cache-and-network',
  });
}


interface ContributionData {
  [year: number]: any;
}

interface GHContextType {
  contributions: { [username: string]: ContributionData };
  setContributions: (username: string, year: number, data: any, error: any, loading: any) => void;
}

const GHContext = createContext<GHContextType | undefined>(undefined);

export const GHContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contributions, setContributionsState] = useState<{ [username: string]: ContributionData }>({});

  const setContributions = (username: string, year: number, data: any) => {
    setContributionsState((prev) => ({
      ...prev,
      [username]: {
        ...(prev[username] || {}),
        [year]: data,
      },
    }));
  };

  return (
    <GHContext.Provider value={{ contributions, setContributions }}>
      {children}
    </GHContext.Provider>
  );
};

export const useGitHubContributions = () => {
  const context = useContext(GHContext);
  if (!context) {
    throw new Error('useGitHubContributions must be used within a GHContextProvider');
  }
  return context;
};
