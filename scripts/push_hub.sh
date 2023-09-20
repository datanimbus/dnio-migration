#!/bin/bash

set -e

TAG=`cat CURRENT_MIGRATION`

echo "****************************************************"
echo "datanimbus.io.migration :: Pushing Image to Docker Hub :: datanimbus/datanimbus.io.migration:$TAG"
echo "****************************************************"

docker tag datanimbus.io.migration:$TAG datanimbus/datanimbus.io.migration:$TAG
docker push datanimbus/datanimbus.io.migration:$TAG

echo "****************************************************"
echo "datanimbus.io.migration :: Image Pushed to Docker Hub AS datanimbus/datanimbus.io.migration:$TAG"
echo "****************************************************"