import Joi from "joi";

export const replyValidation = Joi.object({
  commentId: Joi.string()
    .optional()
    .messages({
      "any.required": "Post ID is required",
      "string.base": "Post ID must be a valid string",
      "string.empty": "Post ID is required",
    })
    .regex(/^[a-fA-F0-9]{24}$/)
    .messages({
      "string.pattern.base": "Post ID must be a valid MongoDB ID",
    }),
  authorId: Joi.string()
    .optional()
    .messages({
      "any.required": "Author ID is required",
      "string.base": "Author ID must be a valid string",
      "string.empty": "Author ID is required",
    })
    .regex(/^[a-fA-F0-9]{24}$/)
    .messages({
      "string.pattern.base": "Author ID must be a valid MongoDB ID",
    }),
  author: Joi.string().required().messages({
    "any.required": "Author name is required",
    "string.base": "Author name must be a valid string",
  }),
  content: Joi.string()
    .required()
    .messages({
      "any.required": "Content text is required",
      "string.base": "Content text must be a string",
      "string.empty": "Content text is required",
      "string.max": "Content text must not exceed 500 characters",
    })
    .max(500),
  createdAt: Joi.date().optional().messages({
    "date.base": "Created date must be a valid date",
  }),
  updatedAt: Joi.date().optional().messages({
    "date.base": "Updated date must be a valid date",
  }),
});
