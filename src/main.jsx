import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from 'react-redux'
import { store } from './store/index.ts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import "./index.css";
import App from "./App.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is fresh for 5 minutes — no re-fetch during this window
      // Data never goes stale automatically.
      // API only re-fetches when queryKey changes (page/filter/sort)
      // or after add/edit/delete invalidates the cache.
      staleTime: Infinity,
      // Don't re-fetch just because the user switched tabs and came back
      refetchOnWindowFocus: false,
      // Only retry failed requests once (default is 3)
      retry: 1,
    },
  },
})
window.__TANSTACK_QUERY_CLIENT__ = queryClient

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
