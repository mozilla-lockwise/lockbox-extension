ADDON_NAME=lockbox
ADDON_VERSION=0.1pre

.PHONY: clean
clean:
	git clean -fX .

.PHONY: package
package:
	rm -f $(ADDON_NAME)-$(ADDON_VERSION).xpi
	cd dist && zip -r ../$(ADDON_NAME)-$(ADDON_VERSION).xpi *
