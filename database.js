import * as dotenv from 'dotenv'
dotenv.config()

import pgPromise from "pg-promise"

const pgp = pgPromise({})

const DB = pgp(
    'postgres://' +
    process.env.USER +
    ':' +
    process.env.PASSWORD+
    '@' +
    process.env.HOST +
    ':' +
    process.env.PORT +
    '/' +
    process.env.DATABASE
)

export default DB;