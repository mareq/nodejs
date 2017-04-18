#!/bin/sh

echo -n "Starting server:"
./main.js &
pid=$!
echo " PID: ${pid}"
sleep 1

rqt=`cat http.rqt`
echo "Request:"
echo "${rqt}"

res=`netcat 127.0.0.1 8081 < http.rqt`
echo "Response:"
echo "${res}"

echo -n "Stopping server..."
kill $pid
echo " done."


