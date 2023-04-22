import fetch from 'node-fetch';

const baseURL = 'https://api.paystack.co';

const request = async ({ url, body = {}, method = 'get' }) => {

  const { PAYSTACK_SECRET_KEY } = process.env;

  try {
    let response: any = await fetch(`${baseURL}/${url}`, {
      body: Object.keys(body).length ? JSON.stringify(body) : undefined,
      method,
      headers: {
        authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'content-type': 'application/json',
        'cache-control': 'no-cache'
      },
    });

    response = await response.json();

    return response;
  } catch (error) {
    return {
      status: false,
      message: 'An error occured calling paystack',
    };
  }
};

const paystack = () => {
    const initializePayment = async (form) => {
      const { status, message, data } = await request({
        url: 'transaction/initialize', 
        body: form, 
        method: 'post'
      });

      return { status, message, data };
    };
  
    const verifyPayment = async (ref) => {
      const { status, message, data } = await request({
        url: `transaction/verify/${encodeURIComponent(ref)}`,
        method: 'post'
      });

      return { status, message, data };
    };
  
    return { initializePayment, verifyPayment };
  };
  
  export { paystack };