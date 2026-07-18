const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure pdfkit is installed
try {
  require.resolve('pdfkit');
} catch (e) {
  console.log('Installing pdfkit to generate BrainStorming PDF...');
  execSync('npm install pdfkit --no-save', { stdio: 'inherit' });
}

const PDFDocument = require('pdfkit');

const buildBrainstormingPDF = () => {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 55, bottom: 55, left: 55, right: 55 },
    bufferPages: true
  });

  // Create "1. Ideation phase" directory in workspace root
  const outputDir = path.join(__dirname, '1. Ideation phase');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pdfPath = path.join(outputDir, 'BrainStorming.pdf');
  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);

  // Formatting variables
  const fontTitle = 'Times-Bold';
  const fontBody = 'Times-Roman';
  const fontHeader = 'Times-Bold';
  const colorPrimary = '#000000';
  const colorText = '#1A1A1A';
  const colorSub = '#555555';

  // Paths of generated images
  const brainDir = 'C:\\Users\\raman\\.gemini\\antigravity\\brain\\6bd19433-e93c-41ee-8bdc-1c3bcff342c6';
  const img1 = path.join(brainDir, 'team_collaboration_1784366656882.png');
  const img2 = path.join(brainDir, 'idea_grouping_1784366681502.png');
  const img3 = path.join(brainDir, 'idea_prioritization_1784366708684.png');

  // Helpers
  const addHeaderTable = () => {
    // Draw a neat metadata table
    const tableTop = 55;
    const col1X = 55;
    const col2X = 250;
    const rowHeight = 22;
    const tableWidth = 485;

    doc.strokeColor('#000000').lineWidth(1);

    // Draw Outer Box
    doc.rect(col1X, tableTop, tableWidth, rowHeight * 3).stroke();

    // Draw horizontal dividers
    doc.moveTo(col1X, tableTop + rowHeight).lineTo(col1X + tableWidth, tableTop + rowHeight).stroke();
    doc.moveTo(col1X, tableTop + rowHeight * 2).lineTo(col1X + tableWidth, tableTop + rowHeight * 2).stroke();

    // Draw vertical divider
    doc.moveTo(col2X, tableTop).lineTo(col2X, tableTop + rowHeight * 3).stroke();

    // Fill table cell contents
    doc.font(fontHeader).fontSize(10.5).fillColor(colorPrimary);

    // Row 1
    doc.text('Date', col1X + 10, tableTop + 6);
    doc.font(fontBody).text('30 June 2026', col2X + 10, tableTop + 6);

    // Row 2
    doc.font(fontHeader).text('Project Name', col1X + 10, tableTop + rowHeight + 6);
    doc.font(fontBody).text('Book-Store', col2X + 10, tableTop + rowHeight + 6);

    // Row 3
    doc.font(fontHeader).text('Maximum Marks', col1X + 10, tableTop + rowHeight * 2 + 6);
    doc.font(fontBody).text('4 Marks', col2X + 10, tableTop + rowHeight * 2 + 6);

    // Position Y-cursor below table
    doc.y = tableTop + rowHeight * 3 + 25;
  };

  const addParagraph = (text) => {
    doc.fillColor(colorText).fontSize(11).font(fontBody).text(text, { align: 'justify', lineGap: 4 });
    doc.moveDown(0.5);
  };

  const addStepHeading = (title) => {
    doc.moveDown(1.5);
    doc.fillColor(colorPrimary).fontSize(13).font(fontTitle).text(title);
    doc.moveDown(0.5);
  };

  const addStepImage = (filePath, caption) => {
    if (fs.existsSync(filePath)) {
      doc.moveDown(0.5);
      doc.image(filePath, {
        fit: [440, 240],
        align: 'center'
      });
      doc.moveDown(0.8);
      doc.fillColor(colorSub).fontSize(9.5).font(fontBody).text(caption, { align: 'center' });
      doc.moveDown(1);
    } else {
      console.warn(`Warning: Image file not found: ${filePath}`);
    }
  };

  // --- Document Compilation ---
  addHeaderTable();

  // Document Title
  doc.fontSize(18).font(fontTitle).text('IDEATION PHASE: BRAINSTORM & IDEA PRIORITIZATION', { align: 'center' });
  doc.moveDown(1);

  // Brainstorming Intro
  addParagraph('Brainstorming provides a free and open environment that encourages everyone within a team to participate in the creative thinking process that leads to problem solving. Prioritizing volume over value, out-of-the-box ideas are welcome and built upon, and all participants are encouraged to collaborate, helping each other develop a rich amount of creative solutions.');
  addParagraph('Use this template in your own brainstorming sessions so your team can unleash their imagination and start shaping concepts even if you\'re not sitting in the same room.');

  // Step 1
  addStepHeading('Step-1: Team Gathering, Collaboration and Select the Problem Statement');
  addParagraph('The development team initiated the ideation phase by gathering to analyze the core challenges within the digital bookstore industry. By discussing target demographics, seller limitations, and cart abandonment concerns, the team formulated and finalized the problem statement for the BookStore (BookVerse) application.');
  addStepImage(img1, 'Figure 1: Student development team collaborating around a desk to formulate the bookstore problem statement.');

  // Step 2
  doc.addPage();
  addStepHeading('Step-2: Brainstorm, Idea Listing and Grouping');
  addParagraph('During the idea listing phase, team members generated diverse ideas for site capabilities. These concepts were grouped into distinct architectural models: User shopping experience, Seller book inventory control, and Administrative approval and logging monitors.');
  addStepImage(img2, 'Figure 2: Idea mapping session showing features categorized into modules on a collaboration board.');

  // Step 3
  doc.addPage();
  addStepHeading('Step-3: Idea Prioritization');
  addParagraph('Using a 2x2 Action Priority Matrix (comparing System Impact vs Implementation Effort), the team mapped listed ideas to identify quick wins. Features such as direct checkout, visual dashboard charts, and search filters were prioritized as core MVP components, while payment gateway integrations were scheduled for future releases.');
  addStepImage(img3, 'Figure 3: Prioritization matrix evaluating bookstore features by impact and complexity.');

  // Footer and Page Numbers
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    doc.strokeColor('#000000').lineWidth(0.5).moveTo(55, 790).lineTo(540, 790).stroke();
    doc.fillColor(colorSub).fontSize(9).font(fontBody)
       .text(`Page ${i + 1} of ${pages.count}`, 55, 800, { align: 'right' });
  }

  doc.end();
  console.log('BrainStorming PDF generated successfully: BrainStorming.pdf');
};

buildBrainstormingPDF();
