import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { ApolloProvider } from '@apollo/client';
import { AppThemeProvider } from './app/context/AppThemeProvider';
import { Outlet } from 'react-router-dom';
import { client } from './app/services/ApolloClient';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorRoute from './error';
import GHStats from './app/routes/GHStats';
import App from './app/routes/App';
import { ThemeSwitcher } from './app/_components/ThemeSwitcher';
import AnimatedButton from './app/_components/AnimatedButton';
import { Provider } from 'react-redux';
import { store } from './app/redux/store';


const Layout = () => {
  const date = new Date();
  const isLastWeekOfYear = date.getMonth() === 11 && date.getDate() >= 24;
  return (
    <div className='relative'>
      <div className="fixed top-5 right-2 flex items-center w-full">
        <div className='ml-32'>

        </div>
        <div />
        <div className=' grow flex justify-end'>
          {isLastWeekOfYear && <AnimatedButton onClick={() => {
            window.location.href = '/year-in-github';
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
