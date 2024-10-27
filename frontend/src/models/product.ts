// models/product.ts
import mongoose, {Document, Model} from "mongoose";

// Define the interface for the Product document
export interface ProductType extends Document {
  name: string;
  description: string;
  price: number;
  countInStock: number;
  images: string[];
  mainImage: string;
  category: string;
  subcategory: string;
  categorySpecificFields: {
    fieldValues: Map<string, number>; // Adjust this type as needed
  };
  createdAt: Date;
  discount: number;
  featured: boolean;
  trending: boolean;
  top: boolean;
  today: boolean;
  rating: number;
  video?: string;
  youtubeLink?: string;
  state: string;
  lga: string;
  bulkNumber?: string;
  bulkPrice?: string;
}

// Define the schema
const DynamicFieldsSchema = new mongoose.Schema(
  {
    fieldValues: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  {strict: false}
);

const ProductSchema = new mongoose.Schema<ProductType>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    images: {
      type: [String],
      required: [true, "Images are required"],
      validate: {
        validator: function (value: string[]) {
          return value.length === 5;
        },
        message: "There must be exactly 5 images",
      },
    },
    mainImage: {
      type: String,
      required: [true, "Main image is required"],
      validate: {
        validator: function (value: string) {
          return this.images.includes(value);
        },
        message: "Main image must be one of the product images",
      },
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "Agriculture & Food",
          "Babies & Kid",
          "Commercial Equipment & Tools",
          "Electronics",
          "Fashion",
          "Health & Beauty",
          "Home Appliances & Furniture",
          "Jobs",
          "Pets",
          "Phones & Tablets",
          "Property",
          "Repair & Construction",
          "Seeking Work CVs",
          "Services",
          "Sports, Arts and Outdoors",
          "Vehicles",
        ],
        message: "{VALUE} is not a supported category",
      },
      index: true,
    },
    subcategory: {
      type: String,
      required: [true, "Subcategory is required"],
      trim: true,
      index: true,
    },
    categorySpecificFields: DynamicFieldsSchema,
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    trending: {
      type: Boolean,
      default: false,
      index: true,
    },
    top: {
      type: Boolean,
      default: false,
      index: true,
    },
    today: {
      type: Boolean,
      default: false,
      index: true,
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot exceed 5"],
      default: 0,
    },
    video: {
      type: String,
      trim: true,
    },
    youtubeLink: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      index: true,
    },
    lga: {
      type: String,
      required: [true, "LGA is required"],
      trim: true,
      index: true,
    },
    bulkNumber: {
      type: String,
      trim: true,
    },
    bulkPrice: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Add compound indexes for common query patterns
ProductSchema.index({category: 1, subcategory: 1});
ProductSchema.index({featured: 1, createdAt: -1});
ProductSchema.index({trending: 1, createdAt: -1});
ProductSchema.index({top: 1, createdAt: -1});
ProductSchema.index({today: 1, createdAt: -1});

// Add error handling for model compilation
let ProductModel: Model<ProductType>;
try {
  // Try to get existing model
  ProductModel = mongoose.models.Product as Model<ProductType>;
} catch {
  try {
    // If not exists, create new model
    ProductModel = mongoose.model<ProductType>("Product", ProductSchema);
  } catch (error) {
    console.error("Error creating Product model:", error);
    throw error;
  }
}

// Add this check to ensure model is defined
if (!ProductModel) {
  try {
    ProductModel = mongoose.model<ProductType>("Product", ProductSchema);
  } catch (error) {
    console.error("Failed to create Product model:", error);
    throw error;
  }
}

export default ProductModel;
