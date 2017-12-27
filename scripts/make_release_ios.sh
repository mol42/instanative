#!/bin/sh

# bu script ile bir ios ipa dosyası oluşturuluyor
# örnek build komutu :
# sh make_release_ios.sh staging 12 1.0.0-rc.1

APP_DEPLOYMENT_ENVIRONMENT=$1 # hangi ortam için build çıkıyoruz ( bu ayar scheme'yi seçer )
BUILD_NUMBER=$2;  # ipa'nın build numberi
BUNDLE_SHORT_VERSION=$3; # 
EXPORT_PLIST_FILE="";

if [ -z "$APP_DEPLOYMENT_ENVIRONMENT" ] || [ "$APP_DEPLOYMENT_ENVIRONMENT" == "" ] ; then
   echo " "
   echo "Can't run this script without specifying environment as an argument. Aborting..."
   echo " "
   exit -1
elif [ "$APP_DEPLOYMENT_ENVIRONMENT" == "staging" ] ; then
   SCHEME="Staging"
   EXPORT_PLIST_FILE="./exportConfiguration-Staging.plist";
elif [ "$APP_DEPLOYMENT_ENVIRONMENT" == "production" ] ; then
   SCHEME="Production"
   EXPORT_PLIST_FILE="./exportConfiguration-Production.plist";
else
   echo " "
   echo "Unknown environment: '$APP_DEPLOYMENT_ENVIRONMENT'. Aborting..."
   echo " "
   exit -1
fi

echo " "
echo "EXPORT_PLIST_FILE = '$EXPORT_PLIST_FILE'"
echo " "

if [ -z "$BUILD_NUMBER" ] || [ "$BUILD_NUMBER" == "" ] ; then
    echo " "
    echo "Unknown Build number. Aborting..."
    echo " "
    exit -1
fi

if [ -z "$BUNDLE_SHORT_VERSION" ] || [ "$BUNDLE_SHORT_VERSION" == "" ] ; then
    echo " "
    echo "Unknown bundle short version. Aborting..."
    echo " "
    exit -1
fi


# Go to top project folder:
SCRIPT_DIRECTORY=`dirname $0`
cd ${SCRIPT_DIRECTORY}
cd .. 


echo " "
echo Deployment Settings:
echo " "+- APP Environment: $APP_DEPLOYMENT_ENVIRONMENT
echo " "+- SCHEME: $SCHEME
echo " "

echo "====================================================="
echo "Deleting npm packages..."
echo "====================================================="
rm -rf ./node_modules || exit

echo "====================================================="
echo "Installing npm packages..."
echo "====================================================="
npm install || exit

echo "====================================================="
echo "Processing manual updates"
echo "====================================================="
# alt yapıda lokijs var ise ve React Native ile çalışması için
# require('fs') yerine require('react-native-fs') olması gerekiyor.
# sed -i -e "s/require('fs')/require('react-native-fs')/g" node_modules/lokijs/src/lokijs.js

echo "====================================================="
echo "Verifying npm cache..."
echo "====================================================="
npm cache verify || exit

echo "====================================================="
echo "Deleting ios build folder..."
echo "====================================================="
rm -rf ./ios/build || exit

# Go to ios folder to create ipa file
cd ./ios

echo "====================================================="
echo "Current working directory: " `pwd`
echo "====================================================="


echo "====================================================="
echo "Setting bundle short version..."
echo "====================================================="

/usr/libexec/Plistbuddy -c "Set CFBundleShortVersionString $BUNDLE_SHORT_VERSION" "./instanative/Info.plist" || exit

echo "====================================================="
echo "Setting build number..."
echo "====================================================="
/usr/libexec/Plistbuddy -c "Set CFBundleVersion $BUILD_NUMBER" "./instanative/Info.plist" || exit

echo "====================================================="
echo "Archiving to ../dist"
echo "====================================================="

xcodebuild clean archive -scheme $SCHEME -archivePath ../dist/InstaNative.xcarchive  || exit

# Let's print where we are
echo "====================================================="
echo "Exportion ipa to ../dist folder"
echo "====================================================="

xcodebuild -exportArchive -archivePath ../dist/InstaNative.xcarchive -exportPath ../dist/ -exportOptionsPlist $EXPORT_PLIST_FILE || exit

# Let's print where we are
echo "====================================================="
echo "Deleting archive"
echo "====================================================="

rm -rf ../dist/InstaNative.xcarchive || exit

echo "====================================================="
echo "RELEASE COMPLETED!"
echo "====================================================="
