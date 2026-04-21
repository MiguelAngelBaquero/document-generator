import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { corsMiddleware } from './middlewares/cors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ?? 3000;
const NODE_ENV = process.env.NODE_ENV ?? 'development';

app.use(corsMiddleware());
app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/generate-docs', (req, res) => {
  try {
    const templateDir = path.join(__dirname, 'templates');

    if (!fs.existsSync(templateDir)) {
      return res.status(404).json({
        error: 'El directorio de plantillas no fue encontrado en el servidor',
      });
    }

    // Leer todos los archivos docx del directrio
    const files = fs
      .readdirSync(templateDir)
      .filter((f) => f.endsWith('.docx'));

    if (files.length === 0) {
      return res.status(404).json({
        error: 'No existen plantillas docx dispobibles en el directorio',
      });
    }

    // Crear un nuevo Zip genérico para empaquetarlos
    const archiveZip = new PizZip();

    files.forEach((templateName) => {
      const templatePath = path.join(templateDir, templateName);
      // Cargar el documento de manera binaria
      const content = fs.readFileSync(templatePath, 'binary');

      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      // Setear los datos en la plantilla (que vienen del frontend en JSON)
      doc.render(req.body);

      const docBuf = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE',
      });

      // Extraer el nombre base sin extension para nombrarlo en el zip interior
      const baseName = path.parse(templateName).name;
      const parsedUser = req.body.NOMBRE
        ? req.body.NOMBRE.replace(/\s+/g, '_')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
        : 'Generado';
      // Nombrar archivo individual de esta forma: ej. "Documento_Jose_Hernandez_CONTRATO_DE_PRESTACION.docx"
      const docUniqueName = `${parsedUser}_${baseName}.docx`;

      // Añadir el docx procesado al contenedor global zip
      archiveZip.file(docUniqueName, docBuf);
    });

    // Generar el empaquetado final comprimido
    const finalBuf = archiveZip.generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    const parsedUserGlobal = req.body.NOMBRE
      ? req.body.NOMBRE.replace(/\s+/g, '_')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
      : 'Generados';
    const fileName = `DOCUMENTOS_${parsedUserGlobal}_${req.body.ANIO || new Date().getFullYear()}.zip`;

    // Enviar respuesta iterada como un solo application/zip
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

    res.send(finalBuf);
  } catch (error) {
    console.error('Error al generar los documentos:', error);
    res.status(500).json({
      error: 'Error interno o de procesamiento de al menos una plantilla.',
    });
  }
});

// implementacion para desplegar la app en vercel
if (NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.info(
      `Server is running on http://localhost:${PORT}; evironment: ${NODE_ENV}`,
    );
  });
}

// implementacion para desplegar la app en vercel
export default app;
