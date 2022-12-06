import joi, { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";
import { logger } from "../libraries/Logger.library";

export const validateSchema = (schema: ObjectSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error: any) {
      logger.error(error.message);
      next(error);
    }
  };
};

export const schema = {
  Auth: {
    register: joi.object({
      username: joi
        .string()
        .trim()
        .min(3)
        .max(20)
        .label("Username")
        .required()
        .messages({
          "string.base": `{{#label}} should be a type of 'text'`,
          "string.empty": `{{#label}} cannot be an empty field`,
          "string.min": `{{#label}} should have a minimum length of {#limit}`,
          "string.max": `{{#label}} must be less than or equal to {#limit}`,
          "any.required": `{{#label}} is a required field`,
        }),
      email: joi.string().email().label("Email").required().messages({
        "string.email": `'{{#label}}' in Email must be a valid {{#label}}`,
        "string.empty": `{{#label}} cannot be an empty field`,
        "any.required": `{{#label}} is a required field`,
      }),
      password: joi
        .string()
        .min(8)
        .max(30)
        .label("Password")
        .required()
        .messages({
          "string.empty": `{{#label}} cannot be an empty field`,
          "string.min": `{{#label}} should have a minimum length of {#limit}`,
          "string.max": `{{#label}} must be less than or equal to {#limit}`,
          "any.required": `{{#label}} is a required field`,
        }),
      confirmPassword: joi
        .any()
        .equal(joi.ref("password"))
        .required()
        .label("Confirm password")
        .messages({
          "any.only": "{{#label}} does not match",
        }),
    }),
    login: joi.object({
      email: joi.string().email().label("Email").required().messages({
        "string.email": `'{{#label}}' in Email must be a valid {{#label}}`,
        "string.empty": `{{#label}} cannot be an empty field`,
        "any.required": `{{#label}} is a required field`,
      }),
      password: joi
        .string()
        .min(8)
        .max(30)
        .label("Password")
        .required()
        .messages({
          "string.empty": `{{#label}} cannot be an empty field`,
          "string.min": `{{#label}} should have a minimum length of {#limit}`,
          "string.max": `{{#label}} must be less than or equal to {#limit}`,
          "any.required": `{{#label}} is a required field`,
        }),
    }),
  },
  User: {
    forgotThePassword: joi.object({
      email: joi.string().email().label("Email").required().messages({
        "string.email": `'{{#label}}' in Email must be a valid {{#label}}`,
        "string.empty": `{{#label}} cannot be an empty field`,
        "any.required": `{{#label}} is a required field`,
      }),
    }),
  },
};
