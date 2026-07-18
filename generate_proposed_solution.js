const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure pdfkit is installed
try {
  require.resolve('pdfkit');
} catch (e) {
  console.log('Installing pdfkit to generate Proposed Solution PDF...');
  execSync('npm install pdfkit --no-save', { stdio: 'inherit' });
}

const PDFDocument = require('pdfkit');

const buildProposedSolutionPDF = () => {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 55, bottom: 55, left: 55, right: 55 },
    bufferPages: true
  });

  // Create "3. Project Design Phase" directory in workspace root
  const outputDir = path.join(__dirname, '3. Project Design Phase');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pdfPath = path.join(outputDir, 'Proposed Solution.pdf');
  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);

  // Formatting variables
  const fontTitle = 'Times-Bold';
  const fontBody = 'Times-Roman';
  const fontHeader = 'Times-Bold';
  const colorPrimary = '#000000';
  const colorText = '#1A1A1A';
  const colorSub = '#555555';

  // Helpers
  const addHeaderTable = () => {
    // Draw table on the right side of the page (X: 340 to 540)
    const tableTop = 55;
    const col1X = 340;
    const col2X = 440;
    const rowHeight = 20;
    const tableWidth = 200;

    doc.strokeColor('#000000').lineWidth(0.5);

    // Draw Outer Box (4 rows)
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
    doc.font(fontBody).text('3 July 2026', col2X + 8, tableTop + 5);

    // Row 2
    doc.font(fontHeader).text('Team ID', col1X + 8, tableTop + rowHeight + 5);
    doc.font(fontBody).text('-', col2X + 8, tableTop + rowHeight + 5);

    // Row 3
    doc.font(fontHeader).text('Project Name', col1X + 8, tableTop + rowHeight * 2 + 5);
    doc.font(fontBody).text('Book-Store', col2X + 8, tableTop + rowHeight * 2 + 5);

    // Row 4
    doc.font(fontHeader).text('Maximum Marks', col1X + 8, tableTop + rowHeight * 3 + 5);
    doc.font(fontBody).text('2 Marks', col2X + 8, tableTop + rowHeight * 3 + 5);

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

  // --- Document Compilation ---
  addHeaderTable();

  // Document Title
  doc.fontSize(15).font(fontTitle).text('PROJECT DESIGN PHASE: PROPOSED SOLUTION', { align: 'center' });
  doc.moveDown(1.2);

  addCenteredHeading('Proposed Solution Template');
  addCenteredParagraph('Following is the proposed solution template. This details the bookstore\'s parameters, business goals, and engineering structures.');

  // Programmatic Solution Table
  const drawSolutionTable = () => {
    const tableTop = doc.y + 10;
    const colWidths = [40, 120, 325];
    const colX = [55, 95, 215];
    const headers = ['S.No.', 'Parameter', 'Description'];

    doc.strokeColor('#000000').lineWidth(0.5);

    // Draw Header Box
    doc.rect(55, tableTop, 485, 20).stroke();
    doc.font(fontHeader).fontSize(10);
    doc.text(headers[0], colX[0] + 5, tableTop + 5);
    doc.text(headers[1], colX[1] + 5, tableTop + 5);
    doc.text(headers[2], colX[2] + 5, tableTop + 5);

    const rows = [
      {
        sno: '1.',
        param: 'Problem Statement (Problem to be solved)',
        desc: 'Traditional small-scale booksellers lack digital channels, limiting their customer reach. Meanwhile, readers encounter complex multi-step checkout processes on major bookstore platforms, resulting in high rates of cart abandonment.'
      },
      {
        sno: '2.',
        param: 'Idea / Solution description',
        desc: 'BookVerse is a MERN stack web app separating Customers, Sellers, and Admins. Customers browse books and buy via a single checkout. Sellers manage listings and ship orders. Admins verify registrations.'
      },
      {
        sno: '3.',
        param: 'Novelty / Uniqueness',
        desc: 'Features a "Buy Now" direct-checkout button that skips complex multi-step cart configurations. It has a zero-cost dedicated seller portal with cover image uploads and custom SVG analytics dashboards.'
      },
      {
        sno: '4.',
        param: 'Social Impact / Customer Satisfaction',
        desc: 'Supports small booksellers by enabling digitizing operations with zero technology overhead. Customers benefit from a fast, beige-accented, clean shopping UI designed to decrease cart abandonment and improve ordering ease.'
      },
      {
        sno: '5.',
        param: 'Business Model (Revenue Model)',
        desc: 'Sellers list books for free, and the platform can charge a micro-transaction fee (e.g. 2-5%) per successful checkout checkout, or offer premium visibility placement for books.'
      },
      {
        sno: '6.',
        param: 'Scalability of the Solution',
        desc: 'Engineered under MVC architecture. Node/Express backend APIs can scale horizontally, and MongoDB Atlas manages global replica sets and handles high concurrent read/write scaling.'
      }
    ];

    let currentY = tableTop + 20;
    rows.forEach((row) => {
      // Calculate row height based on description text
      doc.font(fontBody).fontSize(9);
      const textHeight = doc.heightOfString(row.desc, { width: colWidths[2] - 10, lineGap: 2 });
      const rowHeight = Math.max(textHeight + 10, 50);

      // Check for page boundary and add page if needed
      if (currentY + rowHeight > 730) {
        doc.addPage();
        // Redraw table headers on new page
        currentY = 55;
        doc.rect(55, currentY, 485, 20).stroke();
        doc.font(fontHeader).fontSize(10);
        doc.text(headers[0], colX[0] + 5, currentY + 5);
        doc.text(headers[1], colX[1] + 5, currentY + 5);
        doc.text(headers[2], colX[2] + 5, currentY + 5);
        currentY += 20;
      }

      // Draw Row Box
      doc.rect(55, currentY, 485, rowHeight).stroke();

      // Vertical separators
      doc.moveTo(colX[1], currentY).lineTo(colX[1], currentY + rowHeight).stroke();
      doc.moveTo(colX[2], currentY).lineTo(colX[2], currentY + rowHeight).stroke();

      // Row content
      doc.font(fontBody).fontSize(9);
      doc.text(row.sno, colX[0] + 5, currentY + 5);
      doc.font(fontHeader).text(row.param, colX[1] + 5, currentY + 5, { width: colWidths[1] - 10, lineGap: 1 });
      doc.font(fontBody).text(row.desc, colX[2] + 5, currentY + 5, { width: colWidths[2] - 10, lineGap: 2 });

      currentY += rowHeight;
    });

    doc.y = currentY + 20;
  };

  drawSolutionTable();

  // Footer and Page Numbers
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    doc.strokeColor('#000000').lineWidth(0.5).moveTo(55, 790).lineTo(540, 790).stroke();
    doc.fillColor(colorSub).fontSize(9).font(fontBody)
       .text(`Page ${i + 1} of ${pages.count}`, 55, 800, { align: 'right' });
  }

  doc.end();
  console.log('Proposed Solution PDF generated successfully: Proposed Solution.pdf');
};

buildProposedSolutionPDF();
