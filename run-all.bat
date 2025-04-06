cd contracts
truffle migrate --reset
node scripts/exportContract.js
cd ..

cd frontend
npm start
