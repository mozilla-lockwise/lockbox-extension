#!/usr/bin/env python
"""
Creates extension files using parameters from package.json
"""

import sys
import os
import json

if not sys.argv[1:] or "-h" in sys.argv or "--help" in sys.argv:
    print("Usage: %s TEMPLATE OUTPUT" % (os.path.basename(sys.argv[0])))
    print("  Writes OUTPUT with tokenized values based on TEMPLATE")
    print("  Uses package.json to determine values")
    sys.exit()

template = open(sys.argv[1]).read()
output_file = sys.argv[2]
package_json = json.load(open("package.json"))

template = template.replace("__TITLE__", package_json["title"])
template = template.replace("__VERSION__", package_json["version"])
template = template.replace("__DESCRIPTION__", package_json["description"])
template = template.replace("__AUTHORID__", package_json["author"])

open(sys.argv[2], "wb").write(template)
