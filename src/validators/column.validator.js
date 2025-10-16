import Joi from "joi";

export const createColumnSchema = Joi.object({
    title: Joi.string().min(2).max(255).required(), 
    order: Joi.number().integer().min(0).required(),
    boardid: Joi.string().guid({ version: ['uuidv4'] }).required(),
});

export const updateColumnSchema = Joi.object({
    title: Joi.string().min(2).max(255).optional(), 
    order: Joi.number().integer().min(0).optional(),
    boardid: Joi.string().guid({ version: ['uuidv4'] }).optional(),
});