import cors from 'cors';

const ACCEPTED_ORIGINS = [
  `http://localhost:${process.env.PORT}`,
  `https://localhost:${process.env.PORT}`,
  `https://document-generator-pi.vercel.app`,
];

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => {
  return cors({
    origin: (origin, callback) => {
      // console.debug('Origin:', origin); // Log the origin
      if (acceptedOrigins.includes(origin) || !origin) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
  });
};
