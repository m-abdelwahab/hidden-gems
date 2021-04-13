# Hidden Gems (WIP)

Hidden-Gems is a fullstack app where users can sign up and browse a collection of links and add them to their favorites. An admin is responsible for adding links

It's built using the following technologies:

- Next.js
- Prisma
- PostgreSQL
- TailwindCSS
- GraphQl Nexus
- Apollo server
- Apollo Client


## Project setup

```bash
yarn && yarn dev
```
rename the `.env.example` file to `.env`

To set up the project locally you'll need to have a database, you can use [Heroku](https://dev.to/prisma/how-to-setup-a-free-postgresql-database-on-heroku-1dc1) or a local Postgres DB

You'll also need to have a GitHub app for auth, so just [create a new Oauth app](https://github.com/settings/applications/new) and make the authorizationn callback URL : `http://localhost:3000/api/auth`

