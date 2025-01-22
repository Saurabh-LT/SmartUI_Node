for i in {1..10}; do
    FIRST_DIGIT=$((3 + i))
    PORT="${FIRST_DIGIT}000"
    echo $PORT
    INSTANCE_ID=$i npx smartui exec node SDK_CLI/parallelTesting.js --port $PORT & 
done
wait

