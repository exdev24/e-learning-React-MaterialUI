#############################
### Basic Docker commands ###
#############################
d.dev:
	docker-compose up -d

d.stop:
	docker-compose stop

####################################
### Call DB commands from docker ###
####################################
db.migrate:
	docker-compose run --rm dev make migrate

db.seed:
	docker-compose run --rm dev make seed

########################################
### Call server commands from docker ###
########################################
dev.serve:
	make trap MAKE="docker-compose run --rm dev make serve"

dev:
	make trap MAKE="docker-compose up dev"

test:
	@echo '***'
	@echo 'run `make browsertest` after server starts up'
	@echo '***'
	make trap MAKE="docker-compose up test"

test-ci:
	make trap MAKE="docker-compose run --rm ci"

terminal:
	make trap MAKE="docker-compose exec dev bash"

terminal-r:
	make trap MAKE="docker-compose run --rm dev bash"

##########################################################
### App commands: call inside of the docker container ####
##########################################################
install:
	node --version
	npm --version
	npm i -g nodemon
	npm install

seed: install
	npm run seed

seed.undo: install
	npm run db:seed:dev:undo

migrate: install
	npm run sequelize db:migrate

build: install
	npm run build-production

serve: build
	npm run start

watch: install
	npm run watch

export-schema:
	npm run export-schema

trap:
	bash -c "trap 'make stop' EXIT; $(MAKE)"

stop:
	echo "stopping all containers..."
	docker-compose stop

##########################################################
### Other ####
##########################################################
browsertest:
	VISUAL=true npx cucumber-js ./integration-tests
