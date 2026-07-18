const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure pdfkit is installed
try {
  require.resolve('pdfkit');
} catch (e) {
  console.log('Installing pdfkit to generate Project Planning PDF...');
  execSync('npm install pdfkit --no-save', { stdio: 'inherit' });
}

const PDFDocument = require('pdfkit');

const buildPlanningPDF = () => {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 55, bottom: 55, left: 55, right: 55 },
    bufferPages: true
  });

  // Create "4. Project Planning" directory in workspace root
  const outputDir = path.join(__dirname, '4. Project Planning');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pdfPath = path.join(outputDir, 'Project Planning.pdf');
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
    doc.font(fontBody).text('18 July 2026', col2X + 8, tableTop + 5);

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

  const addBulletPoint = (title, body) => {
    doc.fillColor(colorPrimary).fontSize(10.5).font(fontHeader).text('• ' + title + ': ', { continued: true });
    doc.fillColor(colorText).font(fontBody).text(body, { lineGap: 3 });
    doc.moveDown(0.3);
  };

  // --- Page 1: Metadata Table, Title, and Definitions ---
  addHeaderTable();

  // Document Title
  doc.fontSize(15).font(fontTitle).text('PROJECT DESIGN PHASE: PLANNING & SCHEDULING', { align: 'center' });
  doc.moveDown(1.2);

  addCenteredHeading('Agile Project Planning Logic');
  addCenteredParagraph('To coordinate development sprints for the BookStore (BookVerse) application, the team implemented Agile project management principles. Key definitions utilized throughout the cycle include:');
  doc.moveDown(0.5);

  addBulletPoint('Sprint', 'A fixed period or duration in which a team works to complete a set of tasks.');
  addBulletPoint('Epic', 'A big task or project that is too large to complete in one sprint. It is broken down into smaller user stories completed over multiple sprints.');
  addBulletPoint('Story', 'A small functional task that represents a single piece of business value. It is part of a larger Epic.');
  addBulletPoint('Story Point', 'A number representing the relative effort a story takes to complete, mapped using Fibonacci values: 1 (Very Easy), 2 (Normal), 3 (Moderate), and 5 (Difficult).');

  // --- Page 2: Sprint 1 and Sprint 2 Breakdown ---
  doc.addPage();
  addCenteredHeading('Sprint Backlog Breakdown');
  
  doc.font(fontHeader).fontSize(11).fillColor(colorPrimary).text('Sprint 1 Backlog: Data Modeling & Core Frontend', { align: 'center' });
  doc.moveDown(0.3);
  addBulletPoint('Database Schemas (Epic 1)', 'Gathering & modeling DB fields for User/Seller/Order records (USN-1). [Story Points: 2]');
  addBulletPoint('API Router (Epic 1)', 'Creating and mapping Express backend server endpoints (USN-2). [Story Points: 1]');
  addBulletPoint('Auth Context (Epic 2)', 'Handling React AuthContext and JWT storage gates (USN-3). [Story Points: 3]');
  addBulletPoint('CSS Theme System (Epic 2)', 'Formulating cream-beige index styles and shared styles (USN-4). [Story Points: 3]');
  addBulletPoint('Component Layouts (Epic 2)', 'Designing shared responsive Navbar shell headers (USN-5). [Story Points: 3]');
  doc.font(fontHeader).fontSize(10.5).fillColor(colorPrimary).text('Total Story Points in Sprint 1 = 2 + 1 + 3 + 3 + 3 = 12 Story Points.', { align: 'center' });
  doc.moveDown(1.5);

  doc.font(fontHeader).fontSize(11).fillColor(colorPrimary).text('Sprint 2 Backlog: Dashboard Visuals & Fulfillments', { align: 'center' });
  doc.moveDown(0.3);
  addBulletPoint('Dashboard Metrics (Epic 3)', 'Creating Admin custom SVG bar charts and count panels (USN-6). [Story Points: 2]');
  addBulletPoint('Inventory Visuals (Epic 3)', 'Creating Seller custom SVG inventory charts (USN-7). [Story Points: 2]');
  addBulletPoint('Seller Products Grid (Epic 3)', 'Developing Seller products table and details (USN-8). [Story Points: 2]');
  addBulletPoint('Seller Orders Log (Epic 3)', 'Developing Seller shipping logs status trackers (USN-9). [Story Points: 4]');
  addBulletPoint('Buy Now Modal (Epic 4)', 'Developing instant checkout modal for address collection (USN-10). [Story Points: 5]');
  addBulletPoint('Add Book Form (Epic 5)', 'Developing product upload page with cover file inputs (USN-11). [Story Points: 5]');
  doc.font(fontHeader).fontSize(10.5).fillColor(colorPrimary).text('Total Story Points in Sprint 2 = 2 + 2 + 2 + 4 + 5 + 5 = 20 Story Points.', { align: 'center' });

  // --- Page 3: Velocity Calculations ---
  doc.addPage();
  addCenteredHeading('Team Velocity Calculations');
  addCenteredParagraph('Velocity measures the amount of work a team can complete in a single sprint. It is calculated by dividing total completed story points by the number of sprints:');
  doc.moveDown(0.5);

  addBulletPoint('Total Story Points Completed', 'Sprint 1 (12 Story Points) + Sprint 2 (20 Story Points) = 32 Story Points.');
  addBulletPoint('Total Sprints Worked', '2 Sprints.');
  
  addCenteredHeading('Velocity = Total Story Points / Number of Sprints');
  addCenteredParagraph('Velocity = 32 / 2 = 16 Story Points per Sprint.');

  doc.moveDown(1);
  doc.font(fontHeader).fontSize(12).fillColor(colorPrimary).text('Conclusion: Team Velocity is established at 16 Story Points per Sprint.', { align: 'center' });
  addCenteredParagraph('This velocity baseline allows the team to predict future delivery dates and accurately scope features in succeeding development iterations.');

  // Page Numbers Footer
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    doc.strokeColor('#000000').lineWidth(0.5).moveTo(55, 790).lineTo(540, 790).stroke();
    doc.fillColor(colorSub).fontSize(9).font(fontBody)
       .text(`Page ${i + 1} of ${pages.count}`, 55, 800, { align: 'right' });
  }

  doc.end();
  console.log('Project Planning PDF generated successfully: Project Planning.pdf');
};

buildPlanningPDF();
