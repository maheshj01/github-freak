import { ApolloClient, InMemoryCache, createHttpLink, gql, useQuery } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: 'https://api.github.com/graphql',
});

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
  }`;

const authLink = setContext((_, { headers }) => {
    const token = process.env.REACT_APP_GITHUB_TOKEN;
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        }
    }
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});


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