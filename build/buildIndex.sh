#!/bin/bash
# Rebuilds index.txt

OUTPUT=""
for file in ../src/chapters/*.txt; do
	FILENAME=$(basename "${file}" .txt)
	if [[ "${FILENAME}" != "index" ]]; then
		OUTPUT+="${FILENAME}"
		OUTPUT+="|"
		OUTPUT+=$(head -n 1 ${file})
		OUTPUT+=$'\n'
	fi
done

echo "${OUTPUT}" > ../src/chapters/index.txt