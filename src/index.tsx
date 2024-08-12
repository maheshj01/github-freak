import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { ApolloProvider } from '@apollo/client';
import { AppThemeProvider, themes, useTheme } from './app/context/AppThemeProvider';
import { client } from './app/services/ApolloClient';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorRoute from './error';
import GHStats from './app/routes/GHStats';
import App from './app/routes/App';
import ThemePicker from './app/_components/ThemePicker';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorRoute />
  },
  {
    path: "/:username",
    element: <GHStats />,
    errorElement: <ErrorRoute />
  },
]);


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AppThemeProvider>
        <div className='relative'>
          <RouterProvider router={router} />
          <ThemePicker />
        </div>
      </AppThemeProvider>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
