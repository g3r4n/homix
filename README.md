# install
pnpm install

# create postgresql database
docker run --name homix-db -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres

# globalEnv
update variables in turbo.json
packages/auth/env.ts

# inspiration
