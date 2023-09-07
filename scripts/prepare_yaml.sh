#!/bin/bash

set -e

echo "****************************************************"
echo "datanimbus.io.migration :: Copying yaml file "
echo "****************************************************"
if [ ! -d yamlFiles ]; then
    mkdir yamlFiles
fi

TAG=`cat CURRENT_MIGRATION`

rm -rf yamlFiles/migration.*
cp migration.yaml yamlFiles/migration.$TAG.yaml
cd yamlFiles/
echo "****************************************************"
echo "datanimbus.io.migration :: Preparing yaml file "
echo "****************************************************"

sed -i.bak s/__release__/$TAG/ migration.$TAG.yaml

echo "****************************************************"
echo "datanimbus.io.migration :: yaml file saved"
echo "****************************************************"