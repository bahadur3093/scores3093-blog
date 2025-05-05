import Joi from "joi";

import { Category } from "../models/Categories.model";
import { IPost } from "../models/Post.model";
import { commentValidation } from "./comments.validation";

export const postValidation = async (payload: IPost) => {
  const categories = await Category.find().lean();
  const categoryNames = categories.map((category) => category.name);

  const scheme = Joi.object({
    title: Joi.string().min(5).max(100).required().messages({
      "string.empty": "Title is required",
      "string.min": "Title must be at least 5 characters long",
      "string.max": "Title cannot exceed 100 characters",
    }),
    summary: Joi.string().max(300).required().messages({
      "string.empty": "Summary is required",
      "string.max": "Summary cannot exceed 300 characters",
    }),
    category: Joi.string()
      .valid(...categoryNames)
      .required()
      .messages({
        "any.only": `Category must be one of: ${categoryNames.join(", ")}`,
        "string.empty": "Category is required",
      }),
    content: Joi.string().min(20).required().messages({
      "string.empty": "Content is required",
      "string.min": "Content must be at least 20 characters long",
    }),
    comments: Joi.array().items(commentValidation).optional().messages({
      "array.base": "Comments must be an array of comment objects",
    }),
  });

  return scheme.validate(payload);
};
