# Get count from environment variable, default to 30 if not set
COUNT=${LOOP_COUNT:-30}

for i in $(seq 1 $COUNT); do
    FIRST_DIGIT=$((3 + i))
    PORT="${FIRST_DIGIT}000"
    echo $PORT
    INSTANCE_ID=$i npx smartui exec node SDK_CLI/parallelTesting --port $PORT & 
done
wait