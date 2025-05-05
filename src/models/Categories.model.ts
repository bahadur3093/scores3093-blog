import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ICategory extends Document {
  id: string;
  name: string;
}

const CategorySchema: Schema = new Schema({
  id: { type: String, default: uuidv4, required: true },
  name: { type: String, required: true },
});

export const Category = mongoose.model<ICategory>("Category", CategorySchema);
