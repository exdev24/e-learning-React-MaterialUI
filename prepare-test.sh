#!/bin/bash
set -x
set -e

export NODE_ENV=test

npm run sequelize db:drop || echo 'db does not exist yet'
npm run sequelize db:create --charset utf8mb4 --collate utf8mb4_general_ci
npm run sequelize db:migrate
npm run sequelize db:seed:all
