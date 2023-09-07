#!/bin/bash

set -e

TAG=`cat CURRENT_MIGRATION`

echo "****************************************************"
echo "datanimbus.io.migration :: Building MIGRATION using TAG :: $TAG"
echo "****************************************************"

sed -i.bak s#__image_tag__#$TAG# Dockerfile

if $cleanBuild ; then
    docker build --no-cache -t datanimbus.io.migration:$TAG .
else 
    docker build -t datanimbus.io.migration:$TAG .
fi


echo "****************************************************"
echo "datanimbus.io.migration :: MIGRATION Built using TAG :: $TAG"
echo "****************************************************"


echo $TAG > LATEST_MIGRATION