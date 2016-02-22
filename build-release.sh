#!/bin/bash

test ! -e platforms/android/build-extras.gradle && \
  echo 'ext.cdvBuildMultipleApks=false' > platforms/android/build-extras.gradle

test -e plugin/cordova-plugin-console && \
cordova plugin rm cordova-plugin-console

# exit if fail
set -e

# fail if parameter not set
set -u

cd $(dirname $0)
dir=$(pwd)
storekey=$dir/keys/appm-release-key.keystore
key_alias=dasm
storepass=$(cat $dir/keys/storekey)
keypass=$(cat $dir/keys/keypassword)
env=prod
output_file=dasm.$(git describe --tags).apk

cd $dir/appm
gulp --cordova 'build --release android' --env=$env
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore $storekey -storepass $storepass -keypass $keypass platforms/android/build/outputs/apk/android-release-unsigned.apk $key_alias
zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk $dir/$output_file
