git pull origin master
cd backend
npm install
pm2 stop pappayasign-backend
pm2 start server.js --name=pappayasign-backend
cd ../frontend
npm install
npm run build
