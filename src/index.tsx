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


const Layout = () => {
  const location = useLocation();

  return (
    <div className='relative'>
      {/* {location.pathname !== '/' && <ThemePicker />} */}
      <ThemeSwitcher />
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
