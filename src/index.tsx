import { ApolloProvider } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import AnimatedButton from './app/_components/AnimatedButton';
import { ThemeSwitcher } from './app/_components/ThemeSwitcher';
import { AppThemeProvider } from './app/context/AppThemeProvider';
import { store } from './app/redux/store';
import App from './app/routes/App';
import GHStats from './app/routes/GHStats';
import YearInGithub from './app/routes/YearInGithub';
import { client } from './app/services/ApolloClient';
import Constants from './constants';
import ErrorRoute from './error';
import './index.css';
import reportWebVitals from './reportWebVitals';

const Layout = () => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const isLastWeekOfYear = date.getMonth() === 11 && date.getDate() >= Constants.kDaysAfterInLastMonth;
  const isBaseRoute = window.location.pathname === '/';
  const isYearRoute = window.location.pathname.startsWith('/year');
  const showYearButton = isLastWeekOfYear && !isBaseRoute && !isYearRoute;
  return (
    <div className='relative'>
      <div className="fixed top-5 right-2 flex items-center w-full">
        <div className='ml-32' />
        <div />
        <div className=' grow flex justify-end'>
          {showYearButton && <AnimatedButton onClick={() => {
            // Get current username from URL if on a user's stats page
            const pathParts = window.location.pathname.split('/').filter(Boolean);
            const username = pathParts.length === 1 && !['year'].includes(pathParts[0]) ? pathParts[0] : null;
            if (username) {
              window.location.href = `/year/${currentYear}/${username}`;
            } else {
              window.location.href = `/year/${currentYear}`;
            }
          }}>
            Year in Github
          </AnimatedButton>
          }
        </div>
        <ThemeSwitcher />
      </div>
      <Outlet />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorRoute />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "/year/:year/:username",
        element: <YearInGithub />,
      },
      {
        path: "/:username",
        element: <GHStats />,
      },
      {
        path: "/year/:year",
        element: <YearInGithub />,
      }
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <AppThemeProvider storageKey="react-ui-theme">
          <RouterProvider router={router} />
        </AppThemeProvider>
      </ApolloProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
