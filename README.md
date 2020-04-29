# pappayasign
PappayaSign:

This project is built considering the domain to be 'https://pappayasign.herokuapp.com'

If this project needs to be deployed to any other domain, change all url values in the body of of axios.get(/sendmail) methods:


Install Instructions: npm install npm start

To Build: npm run build

For hot reloading with frontend and server:
execute npm start in one window
execute nodemon server.js or node server.js in another window.


Packages:


  "dependencies": {
    "@fortawesome/fontawesome-free": "5.12.1",
    "@phuocng/react-pdf-viewer": "^1.5.0",
    "axios": "^0.19.2",
    "body-parser": "^1.19.0",
    "bootstrap": "^4.4.1",
    "chart.js": "2.9.3",
    "classnames": "2.2.6",
    "cors": "^2.8.5",
    "docx-pdf": "0.0.1",
    "dotenv": "^8.2.0",
    "express": "^4.17.1",
    "express-favicon": "^2.0.1",
    "express-session": "^1.17.1",
    "fabric": "^3.6.3",
    "firebase": "^7.13.2",
    "isomorphic-fetch": "^2.2.1",
    "jquery": "^3.4.1",
    "jquery-sortable": "^0.9.13",
    "jquery-ui": "^1.12.1",
    "jspdf": "^1.5.3",
    "material-icons": "^0.3.1",
    "moment": "2.24.0",
    "mongodb": "^3.5.6",
    "mongoose": "^5.9.10",
    "ncrypt-js": "^2.0.0",
    "node-sass": "4.13.1",
    "nodemailer": "^6.4.6",
    "nouislider": "14.1.1",
    "path": "^0.12.7",
    "pdfjs-dist": "^2.3.200",
    "react": "16.12.0",
    "react-bootstrap": "^1.0.0",
    "react-chartjs-2": "2.9.0",
    "react-copy-to-clipboard": "5.0.2",
    "react-datetime": "2.16.3",
    "react-dom": "16.12.0",
    "react-ga": "^2.7.0",
    "react-google-maps": "9.4.5",
    "react-google-recaptcha-v3": "^1.4.1",
    "react-lottie": "^1.2.3",
    "react-router-dom": "5.1.2",
    "react-scripts": "^3.4.0",
    "reactstrap": "8.4.1",
    "simple-crypto-js": "^2.2.0"
  },
  "devDependencies": {
    "@types/googlemaps": "3.39.2",
    "@types/markerclustererplus": "2.1.33",
    "@types/react": "16.9.19",
    "eslint-plugin-flowtype": "3.13.0",
    "gh-pages": "^2.2.0",
    "gulp": "4.0.2",
    "gulp-append-prepend": "1.0.8",
    "typescript": "3.7.5"
  }

