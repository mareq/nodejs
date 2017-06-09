#!/bin/bash

for file in "mouse.full.txt"; do

    [ -f "$file" ] || continue          # make sure it is a file (not dir)

    count=$(wc -l <"$file")             # get total lines
    [ "$count" -lt 2 ] && {             # skip files with less than 2 lines
        printf "error file '%s' cannot be divided\n" "$file" >&2
        continue
    }
    half_1=$((count/5 ))                # divide by 2 (will round down if odd)
    half_2=$((count-half_1))            # get the other 1/2 by subtraction

    head -n $half_1 "$file" > "$file-test.txt"
    tail -n $half_2 "$file" > "$file-train.txt"

done