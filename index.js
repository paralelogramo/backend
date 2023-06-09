import express from "express";
import { getError } from "./Parser/catchElements.js";
import Parser from "./Parser/Parser.js";
import * as cors from "cors";
import { list_of_aminos_start_end } from "./Parser/enumQueries.js";
import * as dotenv from 'dotenv'
dotenv.config()

import PG from 'pg';
const Pool = PG.Pool;
const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
})

const app = express();

app.use(cors.default());
app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.get('/getAllAminos', async (req, res) => {
    try {
        pool.query('SELECT * FROM standard_amino')
        .then(function(data) {
            res.status(200).send({
                state: "SUCCESS",
                message: "We found the data you were looking for.",
                data: data.rows
            })
        })
        .catch(function(error) {
            res.status(500).send({
                state: "ERROR_DB",
                message: "Sorry, something went wrong in the database.",
                error: error
            })
        });
    } catch (error) {
        res.status(503).send({
            state: "ERROR_API",
            message: "Sorry, asomething went wrong in the server.",
            error: error
        })
    }
})

app.get('/getProteinsByPattern', async (req, res) => {
    try {
        var result = Parser(req.query.pattern.replaceAll(';',','));
        var query = result.query;
        var error = getError();

        if (Object.keys(error).length == 0) {
            // No errors
            pool.query(query)
            .then(function(data) {
                res.status(200).send({
                    state: "SUCCESS",
                    message: "Success",
                    data: data.rows
                })
            })
            .catch(function(error) {
                res.status(500).send({
                    state: "ERROR_DB",
                    message: "Sorry, something went wrong in the database.",
                    error: error
                })
            });
        } else {
            res.status(500).send({
                state: "ERROR_PATTERN",
                message: `Ups! ${error.message} at line ${error.line} and column ${error.column}`,
                error: error
            })      
        }
    } catch (error) {
        res.status(504).send({
            state: "ERROR_API",
            message: "Sorry, something went wrong in the server.",
            error: error
        })
    }
})

app.get('/getTotalProteinsByPattern', async (req, res) => {    
    try {
        var query = req.query.pattern.replaceAll(';', ',')
        var result = Parser(query);
        var error = getError();

        if (Object.keys(error).length == 0) {
            // No errors
            pool.query(`SELECT COUNT(*) AS count FROM (${result.query}) AS QT`)
            .then(function(data) {
                res.send(data.rows)
            })
            .catch(function(error) {
                res.status(500).send({
                    state: "ERROR_DB",
                    message: "Sorry, something went wrong in the database.",
                    error: error
                })
            });
        } else {
            res.status(500).send({
                state: "ERROR_PATTERN",
                message: `Ups! ${error.message} at line ${error.line} and column ${error.column}`,
                error: error
            })      
        }
    } catch (error) {
        res.status(504).send({
            state: "ERROR_API",
            message: "Sorry, something went wrong in the server.",
            error: error
        })
    }
})

app.get('/getProteinByID', async (req, res) => {
    var id = req.query.id;
    try {
        pool.query(`SELECT * FROM protein WHERE id = '${id}'`)
        .then(function(data) {
            res.status(200).send({
                state: "SUCCESS",
                message: "We found the data you were looking for.",
                data: data.rows
            })
        })
        .catch(function(error) {
            res.status(500).send({
                state: "ERROR_DB",
                message: "Sorry, something went wrong in the database.",
                error: error
            })
        });
    } catch (error) {
        res.status(503).send({
            state: "ERROR_API",
            message: "Sorry, asomething went wrong in the server.",
            error: error
        })
    }
})

app.get('/getListLigands', async (req, res) => {
    try {
        pool.query(`SELECT het_symbol FROM distance_het_amino GROUP BY het_symbol ORDER BY het_symbol ASC`)
            .then(function (data) {
                res.status(200).send({
                    state: "SUCCESS",
                    message: "We found the data you were looking for.",
                    data: data.rows
                })
            })
            .catch(function (error) {
                res.status(500).send({
                    state: "ERROR_DB",
                    message: "Sorry, something went wrong in the database.",
                    error: error
                })
            });
    } catch (error) {
        res.status(503).send({
            state: "ERROR_API",
            message: "Sorry, asomething went wrong in the server.",
            error: error
        })
    }
})

app.get('/getListOfAminosByStartEnd', async (req, res) => {
    let query = list_of_aminos_start_end
                .replaceAll('<<p_id>>', req.query.p_id)
                .replaceAll('<<start>>', req.query.start)
                .replaceAll('<<end>>', req.query.end)
    try {
        pool.query(query)
            .then(function (data) {
                res.status(200).send({
                    state: "SUCCESS",
                    message: "We found the data you were looking for.",
                    data: data.rows
                })
            })
            .catch(function (error) {
                res.status(500).send({
                    state: "ERROR_DB",
                    message: "Sorry, something went wrong in the database.",
                    error: error
                })
            });
    } catch (error) {
        res.status(503).send({
            state: "ERROR_API",
            message: "Sorry, asomething went wrong in the server.",
            error: error
        })
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});