#!/bin/bash

numberOfImages=24
originalImageLocation=../nettside/img/gallery/highRes/
originalImageFormat=.jpg
outputLocation=../nettside/img/gallery/

for ((i=1; i<=$numberOfImages; i++))
do
    # Special case for last image of the initial gallery. It often ends up dynamically placed in such a way 
    # that takes up the entire screenwidth. Therefore it should be of higher resolution.
    if [ $i -eq 12 ]; then
        echo "Processing image 12..."
        convert "$originalImageLocation$i$originalImageFormat" -resize 414x -quality 80 "$outputLocation${i}x414.webp"
        convert "$originalImageLocation$i$originalImageFormat" -resize 855x -quality 80 "$outputLocation${i}x855.webp"
        convert "$originalImageLocation$i$originalImageFormat" -resize 1280x -quality 80 "$outputLocation${i}x1280.webp"
        convert "$originalImageLocation$i$originalImageFormat" -resize 1536x -quality 80 "$outputLocation${i}x1536.webp"
        convert "$originalImageLocation$i$originalImageFormat" -resize 1920x -quality 80 "$outputLocation${i}x1920.webp"
        echo "OK"
    else
        echo "Processing image $i..."
        convert "$originalImageLocation$i$originalImageFormat" -resize 414x -quality 80 "$outputLocation${i}x414.webp"
        convert "$originalImageLocation$i$originalImageFormat" -resize 632x -quality 80 "$outputLocation${i}x632.webp"
        convert "$originalImageLocation$i$originalImageFormat" -resize 760x -quality 80 "$outputLocation${i}x760.webp"
        convert "$originalImageLocation$i$originalImageFormat" -resize 950x -quality 80 "$outputLocation${i}x950.webp"
        echo "OK"
    fi
done

echo "All images converted successfully!"