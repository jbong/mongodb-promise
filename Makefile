REPORTER = spec

test:
	@./node_modules/.bin/mocha \
        --reporter $(REPORTER) \
        --ui tdd

.PHONY: test