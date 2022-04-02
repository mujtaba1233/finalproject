echo "**********start Deployment*************"

echo "********** INSTALLING PACKAGES For Server ***********"

npm install

echo "********** INSTALLING PACKAGES For External APP ***********"

cd external-app/

npm install

echo "********** Making Build for External app ***********"

npm run build

cd ../

echo "********** INSTALLING PACKAGES For Fronstore ***********"

cd front-store/client
npm install

echo "********** Making Build for Fronstore ***********"

npm run build

cd ../../

echo "********** RESTARTING DEMON ************* "

pm2 restart all

echo "********** ALL DONE******************** "