import { fileURLToPath } from 'url';
import path from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const pdfPath = path.resolve(__dirname,'img', 'document.pdf');
console.log(pdfPath)

