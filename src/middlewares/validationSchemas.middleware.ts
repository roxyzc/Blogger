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
    verifyOTP: joi.object({
      otp: joi.string().min(8).max(8).label("otp").required().messages({
        "string.empty": `{{#label}} cannot be an empty field`,
        "string.min": `{{#label}} should be {#limit}`,
        "string.max": `{{#label}} should be {#limit}`,
        "any.required": `{{#label}} is a required field`,
      }),
    }),
    vChangePassword: joi.object({
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
    profile: joi.object({
      username: joi.string().min(3).max(20).trim().label("Username").messages({
        "string.base": `{{#label}} should be a type of 'text'`,
        "string.min": `{{#label}} should have a minimum length of {#limit}`,
        "string.max": `{{#label}} must be less than or equal to {#limit}`,
      }),
      password: joi.string().min(8).max(30).label("Password").messages({
        "string.min": `{{#label}} should have a minimum length of {#limit}`,
        "string.max": `{{#label}} must be less than or equal to {#limit}`,
      }),
    }),
    changeAvatarUser: joi.object({
      image: joi.any().required().label("Image"),
    }),
  },
  Blog: {
    createBlog: joi.object({
      title: joi
        .string()
        .required()
        .trim()
        .min(3)
        .max(20)
        .label("Title")
        .messages({
          "string.base": `{{#label}} should be a type of 'text'`,
          "string.min": `{{#label}} should have a minimum length of {#limit}`,
          "string.max": `{{#label}} must be less than or equal to {#limit}`,
          "any.required": `{{#label}} is a required field`,
        }),
      content: joi
        .string()
        .required()
        .min(1)
        .max(5000)
        .label("Content")
        .messages({
          "string.base": `{{#label}} should be a type of 'text'`,
          "string.min": `{{#label}} should have a minimum length of {#limit}`,
          "string.max": `{{#label}} must be less than or equal to {#limit}`,
          "any.required": `{{#label}} is a required field`,
        }),
      image: joi.any().required().label("image"),
    }),
  },
  comment: joi.object({
    content: joi
      .string()
      .required()
      .trim()
      .min(1)
      .max(5000)
      .label("Content")
      .messages({
        "string.base": `{{#label}} should be a type of 'text'`,
        "string.min": `{{#label}} should have a minimum length of {#limit}`,
        "string.max": `{{#label}} must be less than or equal to {#limit}`,
        "any.required": `{{#label}} is a required field`,
      }),
  }),
};
