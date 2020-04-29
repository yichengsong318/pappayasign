# pappayasign
PappayaSign:

This project is built considering the domain to be 'https://devsign.pappaya.com'

If this project needs to be deployed to any other domain, change the below lines to your domain name:

src/components/PDFAnnotate/pdfannotate.js --> line:729 (change url to your domain) src/components/PDFAnnotate/pdfannotate.js --> line:755 (change url to your domain)

src/view/examples/SelectTemplateRecepients.js --> line:161 (change url to your domain)

Install Instructions: npm install npm start

To Build: npm run build

"dependencies": { "bootstrap": "^4.4.1", "chart.js": "2.9.3", "classnames": "2.2.6", "express": "^4.17.1", "express-favicon": "^2.0.1", "fabric": "^3.6.3", "firebase": "^7.13.2", "jquery": "^3.4.1", "jquery-sortable": "^0.9.13", "jquery-ui": "^1.12.1", "jspdf": "^1.5.3", "material-icons": "^0.3.1", "moment": "2.24.0", "ncrypt-js": "^2.0.0", "node-sass": "4.13.1", "nodemailer": "^6.4.6", "nouislider": "14.1.1", "path": "^0.12.7", "pdfjs-dist": "^2.3.200", "react": "16.12.0", "react-bootstrap": "^1.0.0", "react-chartjs-2": "2.9.0", "react-copy-to-clipboard": "5.0.2", "react-datetime": "2.16.3", "react-dom": "16.12.0", "react-ga": "^2.7.0", "react-lottie": "^1.2.3", "react-router-dom": "5.1.2", "react-scripts": "^3.4.0", "reactstrap": "8.4.1", "simple-crypto-js": "^2.2.0" }

"scripts": { "start": "react-scripts start", or node server.js "build": "react-scripts build", "test": "react-scripts test", "eject": "react-scripts eject", "deploy": "npm run build&&gh-pages -d build", "install:clean": "rm -rf node_modules/ && rm -rf package-lock.json && npm install && npm start" }
