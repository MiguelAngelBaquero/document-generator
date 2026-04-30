import cors from 'cors';

const ACCEPTED_ORIGINS = [
  `http://localhost:${process.env.PORT}`,
  `https://localhost:${process.env.PORT}`,
  `https://document-generator-pi.vercel.app`,
];

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => {
  return cors({
    origin: (origin, callback) => {
      // Permitir si está en la lista de orígenes explícitos, o si no tiene origin (Postman/Local)
      if (acceptedOrigins.includes(origin) || !origin) {
        return callback(null, true);
      }
      
      // Permitir dinámicamente todas las URLs generadas por Vercel (Previews y Producción)
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
  });
};
