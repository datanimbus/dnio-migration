#!/bin/bash

set -e

cDate=`date +%Y.%m.%d.%H.%M`



TAG=$RELEASE"_"$cDate
if [ $tag = 'dev' ] || [ $tag = 'main' ] || [ $tag = 'vNext' ]; then

    echo "****************************************************"
    echo "datanimbus.io.migration :: Default Tag Found, Creating new TAG :: $TAG"
    echo "****************************************************"

    echo $TAG > CURRENT_MIGRATION

else
    echo "****************************************************"
    echo "datanimbus.io.migration :: User's Tag Found :: $tag"
    echo "****************************************************"

    echo $tag > CURRENT_MIGRATION
fi