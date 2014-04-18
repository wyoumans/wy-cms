BROWSERIFY_IN  := ./assets/linker/js/index.js
BROWSERIFY_OUT := ./assets/linker/js/index-compiled.js

browserify := ./node_modules/.bin/browserify

default: run

run:
	@./bin/watch.sh

browserify:
	@touch assets/linker/js/lib/templates.js
	@$(browserify) -e $(BROWSERIFY_IN) -o $(BROWSERIFY_OUT)
	@echo
	@echo Browserifying....

build:
	@make browserify
	@sails build

.PHONY: run browserify build
