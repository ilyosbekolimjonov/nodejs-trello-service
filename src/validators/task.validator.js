import Joi from "joi";

export const createTaskSchema = Joi.object({
    title: Joi.string().min(2).max(100).required(),
    order: Joi.number().integer().min(0).required(),
    description: Joi.string().allow("").max(500).optional(),
    userId: Joi.allow(null).optional(),
    columnId: Joi.required(),
});

export const updateTaskSchema = Joi.object({
    title: Joi.string().min(2).max(100).optional(),
    order: Joi.number().integer().min(0).optional(),
    description: Joi.string().allow("").max(500).optional(),
    userId: Joi.allow(null).optional(),
    columnId: Joi.optional(),
});