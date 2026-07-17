const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Auto-install pdfkit if not present
try {
  require.resolve('pdfkit');
} catch (e) {
  console.log('Installing pdfkit to generate documentation PDF...');
  execSync('npm install pdfkit --no-save', { stdio: 'inherit' });
}

const PDFDocument = require('pdfkit');

const buildPDF = () => {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    bufferPages: true // Enable double-pass rendering for page numbers
  });

  const pdfPath = path.join(__dirname, 'BOOK_STORE_PROJECT_DOCUMENTATION.pdf');
  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);

  // Styling Constants
  const fontRegular = 'Helvetica';
  const fontBold = 'Helvetica-Bold';
  const colorPrimary = '#7D4016'; // Earthy Brown accent
  const colorText = '#331A0F';    // Dark text
  const colorSub = '#553E32';     // Muted subtext
  const colorBg = '#FDFBF7';      // Cream background color

  // Image Source Directory
  const brainDir = 'C:\\Users\\raman\\.gemini\\antigravity\\brain\\6bd19433-e93c-41ee-8bdc-1c3bcff342c6';

  // Helpers
  const addTitlePage = () => {
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(colorBg);
    doc.fillColor(colorPrimary);
    doc.fontSize(32).font(fontBold).text('PROJECT DOCUMENTATION', 50, 180, { align: 'center' });
    doc.fontSize(24).text('MERN STACK BOOK STORE', { align: 'center' });
    doc.moveDown(2);

    doc.fillColor(colorText);
    doc.fontSize(14).font(fontRegular).text('System Design, Implementation & Verification Walkthrough', { align: 'center' });
    doc.moveDown(4);

    doc.fontSize(12).font(fontBold).text('DEVELOPMENT TEAM & ACADEMIC ROLES:', { align: 'center' });
    doc.moveDown(0.5);

    const members = [
      '1. Roopesh Araja - Technical Architecture, Entity Relation Diagram, Features, Roles',
      '2. Palla Satya Ramanaidu - MVC Pattern, Creating Project Folder, Client Setup',
      '3. Bandi Sravya - Server Setup, Backend Structure, Development, Configure MongoDB',
      '4. Vijaya Raju Jakkamsetti - Database Connection, Schema & Models, Frontend Structure',
      '5. Vankayala Jaya Chandra Srinivas - Steps for Execution, Demo Screenshots, Drive Link'
    ];

    members.forEach((m) => {
      doc.fontSize(11).font(fontRegular).text(m, { align: 'center', lineGap: 4 });
    });

    doc.moveDown(6);
    doc.fontSize(10).fillColor(colorSub).text('© 2026 BookVerse. All rights reserved.', { align: 'center' });
    doc.addPage();
  };

  const addHeader = (text) => {
    doc.moveDown(1.5);
    doc.fillColor(colorPrimary).fontSize(18).font(fontBold).text(text);
    // Draw a divider line
    doc.strokeColor(colorPrimary).lineWidth(1).moveTo(doc.x, doc.y + 4).lineTo(545, doc.y + 4).stroke();
    doc.moveDown(1);
  };

  const addSubHeader = (text) => {
    doc.moveDown(1);
    doc.fillColor(colorText).fontSize(13).font(fontBold).text(text);
    doc.moveDown(0.4);
  };

  const addBodyText = (text) => {
    doc.fillColor(colorText).fontSize(10.5).font(fontRegular).text(text, { align: 'justify', lineGap: 4 });
  };

  const addBullet = (label, desc = '') => {
    doc.fillColor(colorText).fontSize(10.5).font(fontBold).text('• ' + label, { continued: desc !== '' });
    if (desc) {
      doc.font(fontRegular).text(desc, { lineGap: 3 });
    } else {
      doc.moveDown(0.2);
    }
  };

  const addCodeBlock = (code) => {
    doc.moveDown(0.5);
    const codeLines = code.split('\n');
    doc.font('Courier').fontSize(9.5).fillColor('#444');
    codeLines.forEach(line => {
      doc.text(line, { lineGap: 2 });
    });
    doc.moveDown(0.5);
  };

  const addIndividualImage = (fileName, title, description) => {
    const filePath = path.join(brainDir, fileName);
    if (fs.existsSync(filePath)) {
      doc.addPage();
      doc.fillColor(colorPrimary).fontSize(14).font(fontBold).text(title, { align: 'center' });
      doc.moveDown(0.5);
      
      doc.image(filePath, {
        fit: [495, 340],
        align: 'center',
        valign: 'center'
      });
      doc.moveDown(1.5);
      
      doc.fillColor(colorText).fontSize(10.5).font(fontRegular).text(description, { align: 'center', lineGap: 3 });
    } else {
      console.warn(`File not found: ${filePath}`);
    }
  };

  // --- Compile Pages ---
  addTitlePage();

  // 2. Project Overview
  addHeader('2. Project Overview');
  addSubHeader('Purpose & Goals');
  addBodyText('The BOOK STORE (BookVerse) application is a full-stack e-commerce web platform built utilizing the MERN stack (MongoDB, Express.js, React.js, and Node.js). It provides a responsive interface where users can search, browse, wishlist, and buy books. It handles role-based logins separating standard customers, sellers/vendors, and system administrators.');

  addSubHeader('Key Product Features');
  addBullet('Role-Based Registration & Login', ': Tabbed credentials security separating customers, sellers, and system administrators using JWT.');
  addBullet('Seller Catalog Controls', ': Approved sellers can list new books, upload cover art files via Multer, modify details, and check order statuses.');
  addBullet('Customer Shop View', ': Customers browse book cards, search by text, filter by genre, add items to a local wishlist, and check out.');
  addBullet('Fulfillment Tracker', ': Sellers monitor orders containing their items and toggle shipping status (ontheway, delivered).');
  addBullet('Admin Dashboard', ': Administrators view system aggregates, inspect an SVG bar chart of database counts, approve sellers, edit user details, and cancel orders.');

  // 3. Technical Architecture
  addHeader('3. Technical Architecture');
  addSubHeader('Frontend (React Client)');
  addBodyText('The frontend UI is developed with React.js using Vite. Global authentication contexts manage user sessions and tokens, and Bootstrap handles responsive viewport scaling.');

  addSubHeader('Backend (Node.js & Express.js)');
  addBodyText('The backend API uses Node.js and Express.js styled under the Model-View-Controller (MVC) design pattern. Mongoose manages DB transactions, Multer handles image uploads, and Bcryptjs handles password encryption.');

  addSubHeader('Database Schema (MongoDB)');
  addBullet('Admins', ': Stores administrator name, credentials, and self ID.');
  addBullet('Sellers', ': Stores vendor name, credentials, and isApproved boolean state.');
  addBullet('Users', ': Stores customer name, credentials, and timestamps.');
  addBullet('Books', ': Stores title, author, genre, price, stock quantity, cover image path, and seller references.');
  addBullet('Orders', ': Stores customer name, delivery address, booking date, delivery target, price, and status (ontheway, delivered).');

  // 4. Setup Instructions
  doc.addPage();
  addHeader('4. Setup & Setup Instructions');
  addSubHeader('Prerequisites');
  addBullet('Node.js (v16+) and npm installer installed.');
  addBullet('A MongoDB Atlas cluster configured with network whitelisting enabled.');
  
  addSubHeader('Installation');
  addBullet('1. Extract/clone the repository folder structure.');
  addBullet('2. In backend/ folder, create a .env file containing:');
  addCodeBlock([
    'PORT=8000',
    'MONGO_URI=mongodb+srv://23pa1a5761_db_user:AR15l56xvSCDDLmM@book-store.ouo6cb6.mongodb.net/bookverse?appName=Book-Store',
    'JWT_SECRET=bookversesecrettokenkey12345'
  ].join('\n'));
  addBullet('3. Run "npm install" inside both backend/ and frontend/ folders to download packages.');

  // 5. Folder Structure
  addHeader('5. Folder Structure');
  addBullet('frontend/src/App.jsx', ': Coordinates browser routes.');
  addBullet('frontend/src/context/AuthContext.jsx', ': Manages active roles and API connections.');
  addBullet('frontend/src/components/', ': Layout components (Navbar.jsx, OrderModal.jsx).');
  addBullet('frontend/src/pages/', ': Dashboard and catalogue pages.');
  addBullet('backend/server.js', ': Core Node Express entry point.');
  addBullet('backend/seed.js', ': Clear and populate MongoDB collections.');
  addBullet('backend/controllers/', ': Express business logic controllers.');

  // 6. Running the Application
  doc.addPage();
  addHeader('6. Running the Application');
  addBodyText('Start the local development servers using two separate terminals:');
  addSubHeader('Backend Service (Port 8000)');
  addCodeBlock('cd backend\nnpm start');
  addSubHeader('Frontend React App (Port 5173)');
  addCodeBlock('cd frontend\nnpm run dev');

  // 7. API Documentation
  addHeader('7. API Documentation');
  addBullet('POST /api/users/register', ': Create customer account.');
  addBullet('POST /api/users/login', ': Verify customer credentials.');
  addBullet('GET /api/users/books', ': List books. Supports query filters (?search=text&genre=fiction).');
  addBullet('POST /api/users/orders', ': Checkout. Body: { bookId, customerName, address, price }.');
  addBullet('POST /api/seller/books', ': Add new product listing (Multipart file attachment).');
  addBullet('PUT /api/admin/sellers/approve/:id', ': Toggle vendor isApproved to true.');

  // 8. Authentication & Security
  addHeader('8. Authentication & Security');
  addBullet('Hashing', ': Passwords are encrypted with Bcryptjs using 10 salt rounds.');
  addBullet('JWT Bearer', ': Authorizations are checked by parsing the Authorization Bearer header.');
  
  // 9. User Interface (Layouts Description Text)
  addHeader('9. User Interface');
  addBullet('Home Page', ': Styled with a cream background, featured category selectors, and contact information.');
  addBullet('Admin Dashboards', ': View database statistics (Users, Vendors, Items, Orders) and SVG bar charts.');
  addBullet('Seller Panels', ': Books list, add-book forms, and order tracker panels.');
  addBullet('Customer Workflows', ': Catalog grid, split Description/Info detail views, and My Orders list.');
  doc.addPage();

  // 10. Testing Strategy
  addHeader('10. Testing Strategy');
  addBullet('Database Seed Check', ': Seeder validates direct database clear and population.');
  addBullet('Model Query Integrity', ': verify_backend.js script queries Mongoose schema directly to verify record counts on Atlas.');
  addBullet('Production Bundler Compile', ': "npm run build" compiled with zero warnings.');

  // 12. Known Issues
  addHeader('12. Known Issues');
  addBullet('Atlas Network whitelist requires 0.0.0.0/0 to allow global connections.');
  addBullet('Multer image uploads are limited to 5MB.');

  // 13. Future Enhancements
  addHeader('13. Future Enhancements');
  addBullet('Integrate Stripe checkout API for credit card transaction processing.');
  addBullet('Incorporate email notifications via Nodemailer for low stock alerts.');

  // --- 11. Screenshots (Placed AFTER Section 13) ---
  addHeader('11. Screenshots');
  doc.moveDown(0.5);
  doc.fillColor(colorPrimary).fontSize(11).font(fontBold).text('Live Project Demo Link: ', { continued: true });
  doc.fillColor('blue').font(fontRegular).text('https://book-store-nzxy.onrender.com/', {
    link: 'https://book-store-nzxy.onrender.com/',
    underline: true
  });
  doc.moveDown(1);

  // Add the 5 individual screenshot pages
  addIndividualImage(
    'media__1784304688594.png',
    '1. Guest Home Page',
    'Figure 1: UI of the BookVerse landing page display showing branding, search exploration buttons, and guest portal entry badges.'
  );

  addIndividualImage(
    'media__1784304710940.png',
    '2. Admin Login Page',
    'Figure 2: Authentication card panel interface for the system administrator login portal.'
  );

  addIndividualImage(
    'media__1784304891346.png',
    '3. Seller Dashboard',
    'Figure 3: Seller summary cards for Items and Total Orders, and the SVG bar chart indicating the seller\'s metrics.'
  );

  addIndividualImage(
    'media__1784304891353.png',
    '4. Seller Products List',
    'Figure 4: Seller catalog sheet showing listed items with title, author, genre, price, and cover image.'
  );

  addIndividualImage(
    'media__1784304931230.png',
    '5. Seller Orders Management',
    'Figure 5: Fulfilling orders interface for sellers to trace ordered items, prices, booking dates, and update statuses.'
  );

  // Finalize PDF Generation and add Page Numbers
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    // Draw Footer (skip title page footer page number)
    if (i > 0) {
      doc.strokeColor('#D5C1A9').lineWidth(0.5).moveTo(50, 790).lineTo(545, 790).stroke();
      doc.fillColor(colorSub).fontSize(9).font(fontRegular)
         .text(`Page ${i + 1} of ${pages.count}`, 50, 800, { align: 'right' });
    }
  }

  doc.end();
  console.log('PDF documentation compiled successfully with 5 individual screenshots: BOOK_STORE_PROJECT_DOCUMENTATION.pdf');
};

buildPDF();
