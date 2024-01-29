import axios from "axios";

// stripe payment

export const handleFreeSubscription = async () => {
  const response = await axios.post(
    "http://localhost:8090/api/v1/stripe/free-plan",
    {},
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

export const createStripePaymentIntentAPI = async (data) => {
  const response = await axios.post(
    "http://localhost:8090/api/v1/stripe/payment",
    { amount: data?.amount, subscriptionPlan: data?.plan },
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

export const verifyPaymentAPI = async (paymentID) => {
  const response = await axios.post(
    `http://localhost:8090/api/v1/stripe/verify-payment/${paymentID}`,
    {},
    {
      withCredentials: true,
    }
  );
  return response?.data;
};
