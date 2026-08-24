#!/bin/sh
# Carpenter — stamp a new version before pushing an update.
# Usage:  sh bump.sh            (uses today's date)
#         sh bump.sh 2026.09.01.2
V="$1"
[ -z "$V" ] && V="$(date +%Y.%m.%d).1"

sed -i "s/^var VERSION = '.*';/var VERSION = '$V';/" sw.js
sed -i "s/window.APP_VERSION = '.*';/window.APP_VERSION = '$V';/" assets/js/version.js
printf '{ "version": "%s" }\n' "$V" > version.json

echo "Version set to $V"
grep -n "VERSION" sw.js assets/js/version.js | head -3
