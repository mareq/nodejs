#!/bin/sh

echo -n "Starting server:"
./main.js &
pid=$!
echo " PID: ${pid}"
sleep 1

for f in `ls http*.rqt`; do
  rqt=`cat ${f}`
  echo "Request:"
  echo "${rqt}"

  res=`netcat 127.0.0.1 8081 < ${f}`
  echo "Response:"
  echo "${res}"
done

echo -n "Stopping server..."
kill $pid
echo " done."

rm tmp/*


