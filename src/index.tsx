import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { ApolloProvider } from '@apollo/client';
import { AppThemeProvider } from './app/context/AppThemeProvider';
import { Outlet, useLocation } from 'react-router-dom';
import { client } from './app/services/ApolloClient';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorRoute from './error';
import GHStats from './app/routes/GHStats';
import App from './app/routes/App';
import { ThemeSwitcher } from './app/_components/ThemeSwitcher';
import { Button } from './app/_components/button';
import { FaGithub } from 'react-icons/fa';


const Layout = () => {
  const location = useLocation();

  return (
    <div className='relative'>
      <div className="fixed top-5 right-2 flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(process.env.REACT_APP_GITHUB_REPO, '_blank')}
        >
          <FaGithub className="mr-2 h-4 w-4" />
          GitHub
        </Button>
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
        path: "/:username",
        element: <GHStats />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AppThemeProvider storageKey="react-ui-theme">
        <RouterProvider router={router} />
      </AppThemeProvider>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
