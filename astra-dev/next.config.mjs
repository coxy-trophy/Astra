const withDotenv = require('next-runtime-dotenv');

module.exports = withDotenv({
  // specify the environment variables that should be exposed to the client side
  publicRuntimeConfig: {
    NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
  },
  // specify the environment variables that should be available on the server side
  serverRuntimeConfig: {
    // you can add server-side configuration here if needed
  },
});
