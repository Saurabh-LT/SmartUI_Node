#!/bin/bash   # Add this line at the top if you specifically need bash

# Option 1: Using seq
for i in $(seq 1 30); do
    FIRST_DIGIT=$((3 + i))
    PORT="${FIRST_DIGIT}000"
    echo $PORT
    INSTANCE_ID=$i npx smartui exec node SDK_CLI/parallelTesting.js --port $PORT &
done
wait