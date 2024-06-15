const PdfPrinter = require('pdfmake');
const fs = require('fs');
const path = require('path');


const fonts = {
  Roboto: {
      normal: path.resolve(__dirname, 'fuentes', 'Roboto-Regular.ttf'),
      bold: path.resolve(__dirname, 'fuentes', 'Roboto-Medium.ttf'),
      italics: path.resolve(__dirname, 'fuentes', 'Roboto-Italic.ttf'),
      bolditalics: path.resolve(__dirname, 'fuentes', 'Roboto-MediumItalic.ttf')
  }
};

const printer = new PdfPrinter(fonts);


function createAndSavePDF(filePath, dataPaciente) {
   
    const {
        dni,
        nombres,
        apellidos,
        edad,
        fechaRegistro,
        odontogramas
    } = dataPaciente;

    const [primerOdontograma] = odontogramas;
    const { edadCategoria, especificaciones, fecha, observaciones, odontograma } = primerOdontograma;

  
    const content = [];


    content.push({
        text: 'Informe de Odontograma',
        style: 'tituloPrincipal',
        alignment: 'center',
        margin: [0, 0, 0, 20] 
    });

   
    content.push({
        text: 'Información del paciente',
        style: 'subheader'
    });
    content.push(`DNI: ${dni}`);
    content.push(`Nombre: ${nombres} ${apellidos}`);
    content.push(`Edad: ${edad}`);
    content.push(`Fecha de registro: ${fechaRegistro}`);
    content.push('\n');

  
    content.push({
        text: 'Descripción general del odontograma',
        style: 'subheader'
    });
    content.push('El odontograma es una herramienta vital en la odontología que permite visualizar y registrar el estado de los dientes y sus tratamientos asociados.');


    content.push({
        text: 'Detalles del odontograma',
        style: 'subheader'
    });
    content.push(`Edad categoría: ${edadCategoria}`);
    content.push(`Especificaciones: ${especificaciones}`);
    content.push(`Fecha: ${fecha}`);
    content.push(`Observaciones: ${observaciones}`);
    content.push('\n');


    const imagePath = path.resolve(__dirname, 'img', 'image.png');
    if (fs.existsSync(imagePath)) {
        content.push({
            image: imagePath,
            fit: [520, 520],
            alignment: 'center',
            margin: [0, 10, 0, 10] // Margen inferior mayor para la imagen
        });
    } else {
        console.log(`La imagen ${imagePath} no fue encontrada.`);
    }

    const odontogramaTable = {
        style: 'tableExample',
        table: {
            widths: ['auto', '*'],
            body: [
                ['Número de Pieza', 'Tratamientos'],
                ['14 (Incisal)', 'Carillas'],
                ['23 (Palatino)', 'Carillas'],
                ['24 (Incisal)', 'Cirugía'],
                ['31 (Incisal)', 'Apiceptomía, Carillas'],
                ['34 (Incisal)', 'Cirugía, Apiceptomía'],
                ['34 (Lingual)', 'Cirugía, Carillas, Corona'],
                ['44 (Mesial)', 'Apiceptomía'],
                ['11 (Incisal)', 'Apiceptomía'],
                ['22 (Incisal)', 'Carillas'],
                ['41 (Incisal)', 'Apiceptomía'],
                ['42 (Distal)', 'Carillas']
            ]
        }
    };

    content.push(odontogramaTable);


    content.push({
        text: 'Gracias por confiar en nuestros servicios odontológicos.',
        style: 'footer',
        alignment: 'center',
        margin: [0, 30, 0, 0] 
    });


    const docDefinition = {
        content: content,
        styles: {
            tituloPrincipal: {
                fontSize: 24,
                bold: true,
                margin: [0, 0, 0, 10] 
            },
            subheader: {
                fontSize: 14,
                bold: true,
                margin: [0, 10, 0, 5] 
            },
            tableExample: {
                margin: [0, 5, 0, 15]
            },
            footer: {
                fontSize: 12,
                italics: true,
                margin: [0, 20, 0, 0] // Margen superior para separación
            }
        }
    };

    const options = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60]
    };

    // Crea el documento PDF
    const pdfDoc = printer.createPdfKitDocument(docDefinition, options);

    // Guarda el PDF en un flujo de escritura
    const writeStream = fs.createWriteStream(filePath);
    pdfDoc.pipe(writeStream);

    // Cierra el PDFKit document
    pdfDoc.end();
}

module.exports = createAndSavePDF;
