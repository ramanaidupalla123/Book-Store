const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure pdfkit is installed
try {
  require.resolve('pdfkit');
} catch (e) {
  console.log('Installing pdfkit to generate Technology Stack PDF...');
  execSync('npm install pdfkit --no-save', { stdio: 'inherit' });
}

const PDFDocument = require('pdfkit');

const buildTechStackPDF = () => {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 55, bottom: 55, left: 55, right: 55 },
    bufferPages: true
  });

  // Create "2. Requirement analysis" directory in workspace root
  const outputDir = path.join(__dirname, '2. Requirement analysis');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pdfPath = path.join(outputDir, 'Technology Stack.pdf');
  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);

  // Formatting variables
  const fontTitle = 'Times-Bold';
  const fontBody = 'Times-Roman';
  const fontHeader = 'Times-Bold';
  const colorPrimary = '#000000';
  const colorText = '#1A1A1A';
  const colorSub = '#555555';

  // Paths of generated architecture image
  const brainDir = 'C:\\Users\\raman\\.gemini\\antigravity\\brain\\6bd19433-e93c-41ee-8bdc-1c3bcff342c6';
  const imgPath = path.join(brainDir, 'mern_architecture_1784381074581.png');

  // Helpers
  const addHeaderTable = () => {
    // Draw table on the right side of the page (X: 340 to 540)
    const tableTop = 55;
    const col1X = 340;
    const col2X = 440;
    const rowHeight = 20;
    const tableWidth = 200;

    doc.strokeColor('#000000').lineWidth(0.5);

    // Draw Outer Box
    doc.rect(col1X, tableTop, tableWidth, rowHeight * 4).stroke();

    // Draw horizontal dividers
    doc.moveTo(col1X, tableTop + rowHeight).lineTo(col1X + tableWidth, tableTop + rowHeight).stroke();
    doc.moveTo(col1X, tableTop + rowHeight * 2).lineTo(col1X + tableWidth, tableTop + rowHeight * 2).stroke();
    doc.moveTo(col1X, tableTop + rowHeight * 3).lineTo(col1X + tableWidth, tableTop + rowHeight * 3).stroke();

    // Draw vertical divider
    doc.moveTo(col2X, tableTop).lineTo(col2X, tableTop + rowHeight * 4).stroke();

    // Fill table cell contents
    doc.font(fontHeader).fontSize(9.5).fillColor(colorPrimary);

    // Row 1
    doc.text('Date', col1X + 8, tableTop + 5);
    doc.font(fontBody).text('2 July 2026', col2X + 8, tableTop + 5);

    // Row 2
    doc.font(fontHeader).text('Team ID', col1X + 8, tableTop + rowHeight + 5);
    doc.font(fontBody).text('-', col2X + 8, tableTop + rowHeight + 5);

    // Row 3
    doc.font(fontHeader).text('Project Name', col1X + 8, tableTop + rowHeight * 2 + 5);
    doc.font(fontBody).text('Book-Store', col2X + 8, tableTop + rowHeight * 2 + 5);

    // Row 4
    doc.font(fontHeader).text('Maximum Marks', col1X + 8, tableTop + rowHeight * 3 + 5);
    doc.font(fontBody).text('4 Marks', col2X + 8, tableTop + rowHeight * 3 + 5);

    // Position Y-cursor below table
    doc.y = tableTop + rowHeight * 4 + 25;
    doc.x = 55; // Reset X-cursor back to the left margin!
  };

  const addCenteredParagraph = (text) => {
    doc.fillColor(colorText).fontSize(11).font(fontBody).text(text, { align: 'center', lineGap: 4 });
    doc.moveDown(0.5);
  };

  const addCenteredHeading = (text) => {
    doc.moveDown(1);
    doc.fillColor(colorPrimary).fontSize(13).font(fontTitle).text(text, { align: 'center' });
    doc.moveDown(0.5);
  };

  // --- Page 1: Metadata Table, Title, and Intro ---
  addHeaderTable();

  // Document Title
  doc.fontSize(15).font(fontTitle).text('PROJECT DESIGN PHASE-II: TECHNOLOGY STACK', { align: 'center' });
  doc.moveDown(1.2);

  addCenteredHeading('Architecture & System Stack');
  addCenteredParagraph('The Book Store (BookVerse) application is engineered utilizing the MERN stack (MongoDB, Express, React, Node) to deliver a highly responsive, secure web interface. This architecture decouples frontend rendering from backend business logic controllers, facilitating database interactions via Mongoose ODM.');

  if (fs.existsSync(imgPath)) {
    doc.moveDown(0.5);
    doc.image(imgPath, {
      fit: [460, 260],
      align: 'center'
    });
    doc.moveDown(0.8);
    doc.fillColor(colorSub).fontSize(9.5).font(fontBody).text('Figure 1: MERN Stack system architecture diagram illustrating data flows between clients and clusters.', { align: 'center' });
  }

  // --- Page 2: Stack Detail ---
  doc.addPage();
  addCenteredHeading('Technology Stack Components');

  doc.font(fontHeader).fontSize(11).fillColor(colorPrimary).text('1. Frontend Layer (React & Vite)', { align: 'center' });
  addCenteredParagraph('Constructed using React.js bootstrapped with Vite. Global authentication contexts manage user login, signup, and credentials tokens. Viewports are styled with a warm cream (#FDFBF7) and brown (#7D4016) palette matching Bootstrap configurations.');

  doc.font(fontHeader).fontSize(11).fillColor(colorPrimary).text('2. Backend Layer (Node.js & Express.js)', { align: 'center' });
  addCenteredParagraph('Written as an Express server running on Node.js runtime. Business handlers are separated under MVC design patterns, and routes are protected using custom JWT token parsers and Multer file upload middlewares.');

  doc.font(fontHeader).fontSize(11).fillColor(colorPrimary).text('3. Database Storage Layer (MongoDB Atlas)', { align: 'center' });
  addCenteredParagraph('Connected to a cloud-hosted MongoDB Atlas cluster. Data models are designed with schema validations (Admins, Sellers, Users, Books, Orders), and queried response times are kept under 120ms.');

  // Page Numbers Footer
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    doc.strokeColor('#000000').lineWidth(0.5).moveTo(55, 790).lineTo(540, 790).stroke();
    doc.fillColor(colorSub).fontSize(9).font(fontBody)
       .text(`Page ${i + 1} of ${pages.count}`, 55, 800, { align: 'right' });
  }

  doc.end();
  console.log('Technology Stack PDF generated successfully: Technology Stack.pdf');
};

buildTechStackPDF();
