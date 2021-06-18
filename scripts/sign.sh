#!/bin/bash

# Thank you Flaque for this. 
# https://github.com/Flaque/penguin/blob/master/scripts/publish_penguin.sh

# First set up the ENV variables needed before we can code sign.
# See: https://github.com/electron-userland/electron-builder/wiki/Code-Signing

# Check that the .p12 file is in the correct location.
CERT_PATH=./certs.p12
if [ ! -f $CERT_PATH ]; then
  echo "Can't find the .p12 file at $CERT_PATH"
fi

# Check that the folder for the project is still in the right place
PROJECT_PATH=~/Projects/today
if [ ! -f $PROJECT_PATH/package.json ]; then
  echo "Can't find the project! Quitting."; exit 1;
fi

read -s -p "Please enter the password to decrypt the .p12 file: " password
if [ -z "$password" ]; then
  echo "No password, quitting abruptly. Lock up your stuff."; exit 1;
fi

# Export the environment variables
export CSC_LINK="file://$CERT_PATH"
export CSC_KEY_PASSWORD=$password

echo "... Exported ENV variables."
