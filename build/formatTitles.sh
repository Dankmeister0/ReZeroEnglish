#!/bin/bash
# Makes sure that chapter's titles are in the proper format

for file in ../src/chapters/*.txt; do
	if [ -f "$file" ]; then
		read -r first_line < "$file"

		if [[ $first_line =~ ([0-9]+)[^0-9]+([0-9]+).*\"([^\"]+)\" ]]; then
			num1="${BASH_REMATCH[1]}"
			num2="${BASH_REMATCH[2]}"
			title="${BASH_REMATCH[3]}"

			new_line="Arc $num1 Part $num2: \"$title\""
			sed -i "1s/.*/$new_line/" "$file"
		else
			echo "Skipped $file"
		fi
	fi
done
