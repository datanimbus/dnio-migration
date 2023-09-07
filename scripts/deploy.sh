#!/bin/bash

set -e

TAG=`cat CURRENT_MIGRATION`


echo "****************************************************"
echo "datanimbus.io.migration :: Deploying Image in K8S :: $NAMESPACE"
echo "****************************************************"

kubectl set image deployment/migration migration=$ECR_URL/datanimbus.io.migration:$TAG -n $NAMESPACE --record=true


echo "****************************************************"
echo "datanimbus.io.migration :: Image Deployed in K8S AS $ECR_URL/datanimbus.io.migration:$TAG"
echo "****************************************************"