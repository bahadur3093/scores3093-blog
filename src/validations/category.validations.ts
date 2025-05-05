import Joi from "joi";

const MAX_NAME_LENGTH = 100;

export const categoryValidation = Joi.object({
  name: Joi.string()
    .max(MAX_NAME_LENGTH)
    .required()
    .messages({
      "string.empty": "Category name is required",
      "string.max": `Category name cannot exceed ${MAX_NAME_LENGTH} characters`,
    }),
});
