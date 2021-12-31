import dotenv from 'dotenv'

let env = process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''

dotenv.config({
    path: process.cwd() + '/.env' + env
})