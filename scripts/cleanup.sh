#!/bin/bash

set -e

TAG=`cat CURRENT_MIGRATION`

echo "****************************************************"
echo "datanimbus.io.migration :: Cleaning Up Local Images :: $TAG"
echo "****************************************************"


docker rmi datanimbus.io.migration:$TAG -f