import Joi from "joi";

export const createBoardSchema = Joi.object({
    title: Joi.string().min(2).max(100).required(),
    columns: Joi.array()
        .items(Joi.string().min(1).max(50))
        .default([]),
});

export const updateBoardSchema = Joi.object({
    title: Joi.string().min(2).max(100).optional(),
    columns: Joi.array()
        .items(Joi.string().min(1).max(50))
        .optional(),
});