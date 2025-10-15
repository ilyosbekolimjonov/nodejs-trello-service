import Joi from "joi";

export const createBoardSchema = Joi.object({
    title: Joi.string().min(2).max(100).required(),
    userId: Joi.string().uuid().required(),
});

export const updateBoardSchema = Joi.object({
    title: Joi.string().min(2).max(100).optional(),
    userId: Joi.string().uuid().optional()
});