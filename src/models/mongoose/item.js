import mongoose from "mongoose";

const ItemShcema = new mongoose.Schema({
    sku: { type: String, required: true, index: { unique: true } },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    tags: { type: [String], default: [] }
  }, {
    timestamps: true
  }
);

ItemShcema.index({tags: 1});
ItemShcema.index({name: 1});
ItemShcema.index({name: "text"});

export const Item = mongoose.model("Item", ItemShcema);