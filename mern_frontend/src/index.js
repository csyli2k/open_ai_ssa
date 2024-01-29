import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider, useAuth } from "./AuthContext/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

//stripe configuration
const stripePromise = loadStripe(
  "pk_test_51Oa6oLLLkswx1AOfzzlldkG2GDG5mt0wAVncPbYwFpDvX6b4FNQD5FQrlNeNzmBqojfENgvZt7BzwZMW4igbBkti00zfk1b88X"
);
const options = {
  mode: "payment",
  currency: "usd",
  amount: 5000,
};
const root = ReactDOM.createRoot(document.getElementById("root"));

const queryClient = new QueryClient();
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Elements stripe={stripePromise} options={options}>
          <App />
        </Elements>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
