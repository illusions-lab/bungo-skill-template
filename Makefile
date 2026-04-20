GEN := node generate/bin/skill-generator.js

#.PHONY: all og social print validate install clean web
.PHONY: all og social validate install clean web

# all: og social print
all: og social 

og:
	$(GEN) generate --only=og

social:
	$(GEN) generate --only=social

# print:
# 	NODE_OPTIONS='--max-old-space-size=6144' $(GEN) generate --only=print

validate:
	$(GEN) validate illusions-skill.yaml

install:
	cd generate && npm install
	cd generate/web && npm install

web:
	cd generate/web && npm run dev

clean:
	rm -rf dist/
