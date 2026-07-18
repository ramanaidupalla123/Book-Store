const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure pdfkit is installed
try {
  require.resolve('pdfkit');
} catch (e) {
  console.log('Installing pdfkit to generate Empathy Map Canvas PDF...');
  execSync('npm install pdfkit --no-save', { stdio: 'inherit' });
}

const PDFDocument = require('pdfkit');

const buildEmpathyMapPDF = () => {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 55, bottom: 55, left: 55, right: 55 },
    bufferPages: true
  });

  // Target directory "1. Ideation phase" in workspace root
  const outputDir = path.join(__dirname, '1. Ideation phase');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pdfPath = path.join(outputDir, 'Empathy map canvas.pdf');
  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);

  // Formatting variables
  const fontTitle = 'Times-Bold';
  const fontBody = 'Times-Roman';
  const fontHeader = 'Times-Bold';
  const colorPrimary = '#000000';
  const colorText = '#1A1A1A';
  const colorSub = '#555555';

  // Path of the generated illustration
  const brainDir = 'C:\\Users\\raman\\.gemini\\antigravity\\brain\\6bd19433-e93c-41ee-8bdc-1c3bcff342c6';
  const imgPath = path.join(brainDir, 'empathy_map_design_1784370742010.png');

  // Helpers
  const addHeaderTable = () => {
    // Draw table on the right side of the page (X: 340 to 540)
    const tableTop = 55;
    const col1X = 340;
    const col2X = 440;
    const rowHeight = 20;
    const tableWidth = 200;

    doc.strokeColor('#000000').lineWidth(0.5);

    // Draw Outer Box (4 rows now)
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
    doc.font(fontBody).text('1 July 2026', col2X + 8, tableTop + 5);

    // Row 2
    doc.font(fontHeader).text('Team ID', col1X + 8, tableTop + rowHeight + 5);
    doc.font(fontBody).text('-', col2X + 8, tableTop + rowHeight + 5); // Empty/Dash

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

  // --- Compile Pages ---
  addHeaderTable();

  // Document Title (Centered)
  doc.fontSize(16).font(fontTitle).text('IDEATION PHASE: EMPATHIZE & DISCOVER', { align: 'center' });
  doc.moveDown(1.2);

  // Description
  addCenteredParagraph('An empathy map is a simple, easy-to-digest visual that captures knowledge about a user\'s behaviours and attitudes. It is a useful tool to help teams better understand their users.');
  addCenteredParagraph('Creating an effective solution requires understanding the true problem and the person who is experiencing it. The exercise of creating the map helps participants consider things from the user\'s perspective along with his or her goals and challenges.');

  if (fs.existsSync(imgPath)) {
    doc.moveDown(1);
    doc.image(imgPath, {
      fit: [440, 240],
      align: 'center'
    });
    doc.moveDown(0.8);
    doc.fillColor(colorSub).fontSize(9.5).font(fontBody).text('Figure 1: Empathy Map Canvas highlighting user thoughts, behaviors, and pain points.', { align: 'center' });
  }

  doc.addPage();
  addCenteredHeading('Empathy Map Quadrants Detail');
  
  doc.font(fontHeader).fontSize(11).fillColor(colorPrimary).text('SAYS (Explicit Statements):', { align: 'center' });
  addCenteredParagraph('"I want to purchase my college textbooks directly from verified small vendors without high middleware markups."');

  doc.font(fontHeader).fontSize(11).fillColor(colorPrimary).text('THINKS (Internal Beliefs):', { align: 'center' });
  addCenteredParagraph('"Is the online stock count accurate? I hope my credit card details are safe and shipping takes less than a week."');

  doc.font(fontHeader).fontSize(11).fillColor(colorPrimary).text('DOES (Observed Actions):', { align: 'center' });
  addCenteredParagraph('Browses the BookVerse digital collection, filters by children\'s or children fiction category, and tracks order statuses.');

  doc.font(fontHeader).fontSize(11).fillColor(colorPrimary).text('FEELS (Emotional States):', { align: 'center' });
  addCenteredParagraph('Feels hopeful about finding rare titles locally, but experiences friction during slow checkouts or complex carts.');

  // Page Numbers Footer
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    doc.strokeColor('#000000').lineWidth(0.5).moveTo(55, 790).lineTo(540, 790).stroke();
    doc.fillColor(colorSub).fontSize(9).font(fontBody)
       .text(`Page ${i + 1} of ${pages.count}`, 55, 800, { align: 'right' });
  }

  doc.end();
  console.log('Empathy Map Canvas PDF generated successfully: Empathy map canvas.pdf');
};

buildEmpathyMapPDF();
