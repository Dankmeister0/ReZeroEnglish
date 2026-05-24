#!/bin/bash
# Translates the newest, untranslated chapters

if [ -z "$1" ]; then
	echo "Usage: $0 <Gemini API key>"
	exit 1
fi

# Get newest chapter num
URL="https://ncode.syosetu.com/n2267be/"
HTML=$(curl ${URL} 2> /dev/null)
PAGE_CNT=$(echo "${HTML}" | ./bin/pup "a.c-pager__item--last attr{href}")
PAGE_CNT=$(echo "${PAGE_CNT##*=}")
URL+="?p=${PAGE_CNT}"
HTML=$(curl ${URL} 2> /dev/null)
MAX_CHAPTER=$(echo "${HTML}" | ./bin/pup "div.c-pager__result-stats text{}")
MAX_CHAPTER=$(echo "${MAX_CHAPTER}" | sed 's/[^0-9]/ /g')
MAX_CHAPTER=$(echo "${MAX_CHAPTER}" | awk '{print $2}')
MAX_CHAPTER=$(echo "${MAX_CHAPTER}" | head -n 1)

for ((i="${MAX_CHAPTER}"; i>0; i--)); do
	if [ -f "../src/chapters/${i}.txt" ]; then
		break
	fi
	./translateChapter.sh ${i} $1
done