#!/bin/bash

set -e

TAG=`cat CURRENT_MIGRATION`

echo "****************************************************"
echo "datanimbus.io.migration :: Pushing Image to Docker Hub :: appveen/datanimbus.io.migration:$TAG"
echo "****************************************************"

docker tag datanimbus.io.migration:$TAG appveen/datanimbus.io.migration:$TAG
docker push appveen/datanimbus.io.migration:$TAG

echo "****************************************************"
echo "datanimbus.io.migration :: Image Pushed to Docker Hub AS appveen/datanimbus.io.migration:$TAG"
echo "****************************************************"