.PHONY: tools clean generate generate-openapi build

default: generate-openapi

tools:
	@echo "  >  Installing openapi generator"
	@npm install @openapitools/openapi-generator-cli -g

clean:
	@echo "  >  Cleaning generated open-api"
	@rm -rf open-api/generated-porez-client
	@echo "  >  Cleaning dist"
	@rm -rf dist

generate-openapi:
	@echo "  > Generate openapi source files"
	openapi-generator-cli generate \
	--generator-name typescript-fetch \
	--input-spec open-api/porez-service.yaml \
	--output open-api/generated-porez-client \
	--additional-properties=fileNaming=kebab-case,supportsES6=true,withoutRuntimeChecks=true,withInterfaces=true,enumPropertyNaming=UPPERCASE &&\
	cp -r open-api/generated-porez-client/models/index.ts src/api/model/porez/index.ts

generate: generate-openapi

build:
	npm run build