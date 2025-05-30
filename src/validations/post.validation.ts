import Joi from "joi";

import { Category } from "../models/Categories.model";
import { IPost } from "../models/Post.model";

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
    author: Joi.string().required().messages({
      "string.empty": "Author is required",
      "string.min": "Author must be at least 2 characters long",
    }),
    authorId: Joi.string().required().messages({
      "string.empty": "Author ID cannot be empty",
    }),
    cover: Joi.string().optional().messages({
      "string.empty": "Cover cannot be empty",
    }),
  });

  return scheme.validate(payload);
};
