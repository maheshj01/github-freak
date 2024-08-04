import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

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

export function useGitHubContributions(username: string, fromDate: Date, toDate: Date) {
  return useQuery(GET_USER_DATA, {
    variables: {
      login: username,
      from: fromDate.toISOString(),
      to: toDate.toISOString()
    },
    fetchPolicy: 'cache-and-network',
  });
}