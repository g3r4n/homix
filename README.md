# install
```
pnpm install
```

# create postgresql database
```
docker run --name homix-db -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres
```

# env file
```
cp .env.example .env
```
Update approriate env keys

# code to update to your project name
packages/db/drizzle.config.ts


# seed database before first run
```
pnpm db:push
```

# globalEnv
update variables in turbo.json
packages/auth/env.ts

# inspiration
https://github.com/t3-oss/create-t3-turbo