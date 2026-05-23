#!/bin/bash
# Rebuilds index.txt

OUTPUT=","
for file in ../chapters/*.txt; do
	FILENAME=$(basename "${file}" .txt)
	if [[ "${FILENAME}" != "index" ]]; then
		OUTPUT+="${FILENAME}"
		OUTPUT+=","
	fi
done

echo "${OUTPUT}" > ../chapters/index.txt