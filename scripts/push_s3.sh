#!/bin/bash

set -e

TAG=`cat CURRENT_MIGRATION`

echo "****************************************************"
echo "datanimbus.io.migration :: Saving Image to AWS S3 :: $S3_BUCKET/stable-builds"
echo "****************************************************"

TODAY_FOLDER=`date ++%Y_%m_%d`

docker save -o datanimbus.io.migration_$TAG.tar datanimbus.io.migration:$TAG
bzip2 datanimbus.io.migration_$TAG.tar
aws s3 cp datanimbus.io.migration_$TAG.tar.bz2 s3://$S3_BUCKET/stable-builds/$TODAY_FOLDER/datanimbus.io.migration_$TAG.tar.bz2
rm datanimbus.io.migration_$TAG.tar.bz2

echo "****************************************************"
echo "datanimbus.io.migration :: Image Saved to AWS S3 AS datanimbus.io.migration_$TAG.tar.bz2"
echo "****************************************************"