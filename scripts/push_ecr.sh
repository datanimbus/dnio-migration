#!/bin/bash

set -e

TAG=`cat CURRENT_MIGRATION`


echo "****************************************************"
echo "datanimbus.io.migration :: Pushing Image to ECR :: $ECR_URL/datanimbus.io.migration:$TAG"
echo "****************************************************"

$(aws ecr get-login --no-include-email)
docker tag datanimbus.io.migration:$TAG $ECR_URL/datanimbus.io.migration:$TAG
docker push $ECR_URL/datanimbus.io.migration:$TAG


echo "****************************************************"
echo "datanimbus.io.migration :: Image pushed to ECR AS $ECR_URL/datanimbus.io.migration:$TAG"
echo "****************************************************"