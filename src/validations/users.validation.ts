import Joi from "joi";

import { IPost } from "../models/Post.model";

export const registerUserValidation = (payload: IPost) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(100).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 5 characters long",
      "string.max": "Name cannot exceed 100 characters",
    }),
    email: Joi.string().max(300).required().messages({
      "string.empty": "Email is required",
      "string.max": "Email cannot exceed 300 characters",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
    }),
    role: Joi.string().optional().messages({
      "string.empty": "Role is required",
    }),
  });

  return schema.validateAsync(payload);
};
