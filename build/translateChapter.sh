#!/bin/bash
# Translates a single Re:Zero chapter

# Exit immediately if the user didn't provide a prompt
if [ -z "$1" ]; then
	echo "Usage: $0 <chapter> <Gemini API key>"
	exit 1
fi

if [ -z "$2" ]; then
	echo "Usage: $0 <chapter> <Gemini API key>"
	exit 1
fi

CHAPTER="$1"
API_KEY="$2"

# Get chapter text
URL="https://ncode.syosetu.com/n2267be/${CHAPTER}"
HTML=$(curl ${URL} 2> /dev/null)
TEXT=$(echo ${HTML} | ./bin/pup "h1.p-novel__title text{}")$'\n'

LN=1
while echo ${HTML} | ./bin/pup "p#L${LN}" | grep -q .; do
	TEXT+=$'\n'$(echo ${HTML} | ./bin/pup "p#L${LN} text{}")
	((LN++))
done

# Define Gemini stuff
SYS_INSTR="You are an advanced, context-aware translation engine.
You will be given a chapter of the Re:Zero web novel in the original Japanese text.
Translate the chapter into English. Adhere to the following guidelines:
 - Maintain tone, and speech mannerisms.
 - Use consistent spellings for character's names.
 - Maintain honorifics as written.
 - Do not include any intro, outro, or conversational fluff. Output ONLY the translated text.
The first line of your response must be the title in one of the following formats:
 - 'Arc X Part Y: \"<title>\"' (This is used for most chapters)
 - 'Arc X <chapter type>: \"<title>\"' (This is used for special chapters, like interludes and finales)
 - 'Re:Zero EX: \"<title>\"' (This is used only for chapters that are directly marked as EX and are not part of any arc)
"

MODEL="gemini-3-flash-preview"
URL="https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}"

# JSON-escape
SYS_INSTR=$(echo "${SYS_INSTR}" | jq -R -s ".")
TEXT=$(echo "${TEXT}" | jq -R -s ".")
RESP=$(curl "${URL}" \
	-H 'Content-Type: application/json' \
	-X POST \
	-d "{
		\"systemInstruction\": {
			\"parts\": [{\"text\": ${SYS_INSTR}}]
		},
		\"contents\": [{
			\"parts\":[{\"text\": ${TEXT}}]
		}]
	}")

# Print output on failure
if ! echo "${RESP}" | jq -r ".candidates[0].content.parts[0].text"; then
	echo "${RESP}"
	exit 1
fi
if [[ $(echo "${RESP}" | jq -r ".candidates[0].content.parts[0].text") == "null" ]]; then
	echo "${RESP}"
	exit 1
fi

echo "${RESP}" | jq -r ".candidates[0].content.parts[0].text" > "../chapters/${CHAPTER}.txt"
echo "Saved translation to ../chapters/${CHAPTER}.txt"
