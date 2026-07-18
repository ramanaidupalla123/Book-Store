const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure pdfkit is installed
try {
  require.resolve('pdfkit');
} catch (e) {
  console.log('Installing pdfkit to generate Solution Requirement PDF...');
  execSync('npm install pdfkit --no-save', { stdio: 'inherit' });
}

const PDFDocument = require('pdfkit');

const buildSolutionRequirementPDF = () => {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 55, bottom: 55, left: 55, right: 55 },
    bufferPages: true
  });

  // Target folder "2. Requirement analysis" in workspace root
  const outputDir = path.join(__dirname, '2. Requirement analysis');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pdfPath = path.join(outputDir, 'Solution Requirement.pdf');
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
    doc.font(fontBody).text('31 January 2025', col2X + 8, tableTop + 5);

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

  // --- Page 1: Metadata Table, Title, and Functional Requirements ---
  addHeaderTable();

  // Document Title
  doc.fontSize(15).font(fontTitle).text('PROJECT DESIGN PHASE-II: SOLUTION REQUIREMENTS', { align: 'center' });
  doc.moveDown(1.2);

  addCenteredHeading('Functional Requirements');
  addCenteredParagraph('Following are the functional requirements of the proposed Book Store solution. This table details each Functional Epic alongside its associated Sub Requirements and user stories.');

  // Programmatic FR Table
  const drawFRTable = () => {
    const tableTop = doc.y + 10;
    const colWidths = [45, 130, 310];
    const colX = [55, 100, 230];
    const headers = ['FR No.', 'Functional Requirement (Epic)', 'Sub Requirement (Story / Sub-Task)'];
    const rowHeight = 45;

    doc.strokeColor('#000000').lineWidth(0.5);
    
    // Draw Header Row Box
    doc.rect(55, tableTop, 485, 20).stroke();
    doc.font(fontHeader).fontSize(10);
    doc.text(headers[0], colX[0] + 5, tableTop + 5);
    doc.text(headers[1], colX[1] + 5, tableTop + 5);
    doc.text(headers[2], colX[2] + 5, tableTop + 5);

    const rows = [
      {
        no: 'FR-1',
        epic: 'User Authentication',
        sub: '• Customer registration and login using form fields.\n• Seller signup with pending status awaiting approval.\n• Secure system administrator session access gateway.'
      },
      {
        no: 'FR-2',
        epic: 'Catalog Navigation',
        sub: '• Searching books by title or author.\n• Filtering listed items by category tabs (Fiction, Science).\n• Detail book view showing price, author, and description.'
      },
      {
        no: 'FR-3',
        epic: 'Wishlist Controls',
        sub: '• Add books to customer local wishlist array.\n• View and delete saved books from customer wishlist tab.'
      },
      {
        no: 'FR-4',
        epic: 'Checkout & Orders',
        sub: '• Instant "Buy Now" checkout form collecting name/address.\n• Automated database order generation and stock deduction.\n• Status update updates for sellers (pending, ontheway, delivered).'
      },
      {
        no: 'FR-5',
        epic: 'Admin Control Panel',
        sub: '• Toggle seller "isApproved" state.\n• Edit/delete user details and delete customer orders.'
      }
    ];

    let currentY = tableTop + 20;
    rows.forEach((row) => {
      // Draw Row Box
      doc.rect(55, currentY, 485, rowHeight).stroke();
      
      // Vertical separators
      doc.moveTo(colX[1], currentY).lineTo(colX[1], currentY + rowHeight).stroke();
      doc.moveTo(colX[2], currentY).lineTo(colX[2], currentY + rowHeight).stroke();

      // Row content
      doc.font(fontBody).fontSize(9);
      doc.text(row.no, colX[0] + 5, currentY + 5);
      doc.font(fontHeader).text(row.epic, colX[1] + 5, currentY + 5, { width: colWidths[1] - 10 });
      doc.font(fontBody).text(row.sub, colX[2] + 5, currentY + 5, { width: colWidths[2] - 10, lineGap: 2 });

      currentY += rowHeight;
    });

    doc.y = currentY + 20;
  };

  drawFRTable();

  // --- Page 2: Non-Functional Requirements ---
  doc.addPage();
  addCenteredHeading('Non-Functional Requirements');
  addCenteredParagraph('Following are the non-functional requirements of the proposed Book Store solution. This details system attributes such as security, usability, availability, and response metrics.');

  // Programmatic NFR Table
  const drawNFRTable = () => {
    const tableTop = doc.y + 10;
    const colWidths = [50, 130, 305];
    const colX = [55, 105, 235];
    const headers = ['FR No.', 'Non-Functional Requirement', 'Description'];
    const rowHeight = 45;

    doc.strokeColor('#000000').lineWidth(0.5);

    // Draw Header Row Box
    doc.rect(55, tableTop, 485, 20).stroke();
    doc.font(fontHeader).fontSize(10);
    doc.text(headers[0], colX[0] + 5, tableTop + 5);
    doc.text(headers[1], colX[1] + 5, tableTop + 5);
    doc.text(headers[2], colX[2] + 5, tableTop + 5);

    const rows = [
      {
        no: 'NFR-1',
        req: 'Usability',
        desc: '• Highly responsive user interface scaling dynamically using Bootstrap.\n• Clean cream/beige palette (#FDFBF7) optimized for high readability.'
      },
      {
        no: 'NFR-2',
        req: 'Security',
        desc: '• Passwords encrypted using Bcryptjs (10 salt rounds).\n• Route validation protected via JWT tokens in HTTP Authorization headers.'
      },
      {
        no: 'NFR-3',
        req: 'Reliability',
        desc: '• Strict Mongoose schemas preventing inconsistent data fields.\n• Elegant database error logs to isolate server connection issues.'
      },
      {
        no: 'NFR-4',
        req: 'Performance',
        desc: '• Search index queries on MongoDB Atlas optimized for speed (under 120ms).\n• Fast page load times (under 2 seconds) by caching static assets.'
      },
      {
        no: 'NFR-5',
        req: 'Availability',
        desc: '• Hosted on Render paired with MongoDB Atlas globally distributed clusters.\n• Standard service uptimes of 99.9% or higher.'
      },
      {
        no: 'NFR-6',
        req: 'Scalability',
        desc: '• Decoupled MVC routers making addition of future features or models easy.\n• Horizontal cluster scaling via MongoDB Atlas.'
      }
    ];

    let currentY = tableTop + 20;
    rows.forEach((row) => {
      // Draw Row Box
      doc.rect(55, currentY, 485, rowHeight).stroke();

      // Vertical separators
      doc.moveTo(colX[1], currentY).lineTo(colX[1], currentY + rowHeight).stroke();
      doc.moveTo(colX[2], currentY).lineTo(colX[2], currentY + rowHeight).stroke();

      // Row content
      doc.font(fontBody).fontSize(9);
      doc.text(row.no, colX[0] + 5, currentY + 5);
      doc.font(fontHeader).text(row.req, colX[1] + 5, currentY + 5, { width: colWidths[1] - 10 });
      doc.font(fontBody).text(row.desc, colX[2] + 5, currentY + 5, { width: colWidths[2] - 10, lineGap: 2 });

      currentY += rowHeight;
    });

    doc.y = currentY + 20;
  };

  drawNFRTable();

  // Footer and Page Numbers
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    doc.strokeColor('#000000').lineWidth(0.5).moveTo(55, 790).lineTo(540, 790).stroke();
    doc.fillColor(colorSub).fontSize(9).font(fontBody)
       .text(`Page ${i + 1} of ${pages.count}`, 55, 800, { align: 'right' });
  }

  doc.end();
  console.log('Solution Requirements PDF generated successfully: Solution Requirement.pdf');
};

buildSolutionRequirementPDF();
