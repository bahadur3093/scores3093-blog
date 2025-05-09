import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  id: string;
  name: string;
}

const CategorySchema: Schema = new Schema({
  id: { type: String },
  name: { type: String, required: true },
});

export const Category = mongoose.model<ICategory>("Category", CategorySchema);
