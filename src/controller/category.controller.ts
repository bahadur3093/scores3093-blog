import { Request, Response } from "express";

import { Category } from "../models/Categories.model";
import { categoryValidation } from "../validations/category.validations";
import { Post } from "../models/Post.model";

export const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find().lean();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { error } = categoryValidation.validate(req.body);

    if (error) {
      res.status(400).json({ error: error.details[0].message });

      return;
    }

    const existingCategory = await Category.findOne().where({
      name: req.body.name,
    });
    if (existingCategory) {
      res.status(400).json({ error: "Category already exists" });

      return;
    }

    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to create category" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findById({ _id: id });
    const postsByCategory = await Post.find().where({
      category: category?.name,
    });

    if (postsByCategory.length > 0) {
      res
        .status(400)
        .json({ error: "Category is being used in one or more post" });
      return;
    }

    const deletedCatogory = await Category.findOneAndDelete({ _id: id });
    if (!deletedCatogory) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
};
