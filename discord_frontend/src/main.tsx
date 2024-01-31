import React from 'react'
import ReactDOM from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { ApolloProvider } from "@apollo/client"
import { BrowserRouter } from 'react-router-dom'
import client from './config/apolloClient.ts'
import RouterComponent from './routes/routes.tsx'
import './index.css'
import '@mantine/core/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <MantineProvider>
        <BrowserRouter>
          <RouterComponent />
        </BrowserRouter>
      </MantineProvider>
    </ApolloProvider>
  </React.StrictMode>,
)
