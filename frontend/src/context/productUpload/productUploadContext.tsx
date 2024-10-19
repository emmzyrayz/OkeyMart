import React, {createContext, useContext, useReducer, useEffect} from "react";
import {ProductFormData, createEmptyProduct} from "@/types/product";
import {useProductContext} from "@/context/productContext/productcontext";
import {compressImage, compressVideo} from "@/utils/mediaCompression";
import {uploadToCloudStorage, CloudStorageProvider} from "@/utils/cloudStorage";

interface ProductUploadState {
  formData: ProductFormData;
  images: File[];
  video: File | null;
  youtubeLink: string;
  isFormValid: boolean;
  errors: {[key: string]: string};
  isUploading: boolean;
  uploadProgress: number;
}

type ProductUploadAction =
  | {type: "SET_FORM_DATA"; payload: Partial<ProductFormData>}
  | {type: "SET_IMAGES"; payload: File[]}
  | {type: "SET_VIDEO"; payload: File | null}
  | {type: "SET_YOUTUBE_LINK"; payload: string}
  | {type: "SET_ERRORS"; payload: {[key: string]: string}}
  | {type: "SET_IS_UPLOADING"; payload: boolean}
  | {type: "SET_UPLOAD_PROGRESS"; payload: number}
  | {type: "SET_IS_FORM_VALID"; payload: boolean}
  | {type: "RESET_FORM"};

const initialState: ProductUploadState = {
  formData: createEmptyProduct(),
  images: [],
  video: null,
  youtubeLink: "",
  isFormValid: false,
  errors: {},
  isUploading: false,
  uploadProgress: 0,
};

const productUploadReducer = (
  state: ProductUploadState,
  action: ProductUploadAction
): ProductUploadState => {
  switch (action.type) {
    case "SET_FORM_DATA":
      return {...state, formData: {...state.formData, ...action.payload}};
    case "SET_IMAGES":
      return {...state, images: action.payload};
    case "SET_VIDEO":
      return {...state, video: action.payload};
    case "SET_YOUTUBE_LINK":
      return {...state, youtubeLink: action.payload};
    case "SET_ERRORS":
      return {...state, errors: action.payload};
    case "SET_IS_UPLOADING":
      return {...state, isUploading: action.payload};
    case "SET_UPLOAD_PROGRESS":
      return {...state, uploadProgress: action.payload};
    case "SET_IS_FORM_VALID":
      return {...state, isFormValid: action.payload};
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
};

const ProductUploadContext = createContext<
  | {
      state: ProductUploadState;
      dispatch: React.Dispatch<ProductUploadAction>;
      uploadProduct: () => Promise<void>;
    }
  | undefined
>(undefined);

export const useProductUpload = () => {
  const context = useContext(ProductUploadContext);
  if (!context) {
    throw new Error(
      "useProductUpload must be used within a ProductUploadProvider"
    );
  }
  return context;
};

export const ProductUploadProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(productUploadReducer, initialState);
  const {addProduct} = useProductContext();

  useEffect(() => {
    const validateForm = () => {
      const errors: {[key: string]: string} = {};

      if (!state.formData.name) errors.name = "Name is required";
      if (!state.formData.category) errors.category = "Category is required";
      if (!state.formData.subcategory)
        errors.subcategory = "Subcategory is required";
      if (state.images.length !== 5)
        errors.images = "Exactly 5 images are required";
      if (!state.formData.price) errors.price = "Price is required";
      if (!state.formData.state) errors.state = "State is required";
      if (!state.formData.lga) errors.lga = "LGA is required";

      // Validate dynamic fields
       Object.entries(state.formData.categorySpecificFields).forEach(
         ([key, value]) => {
           if (!value) errors[key] = `${key} is required`;
         }
       );
       console.log("Images count:", state.images.length);

       console.log("Validation errors:", errors);
      dispatch({type: "SET_ERRORS", payload: errors});
      dispatch({
        type: "SET_IS_FORM_VALID",
        payload: Object.keys(errors).length === 0,
      });
      console.log("Form valid:", Object.keys(errors).length === 0);
    };

    validateForm();
  }, [state.formData, state.images]);

  const uploadProduct = async () => {
    if (!state.isFormValid) {
      console.log("Form is not valid, cannot upload");
      throw new Error("Form is not valid");
    }

    dispatch({type: "SET_IS_UPLOADING", payload: true});
    dispatch({type: "SET_UPLOAD_PROGRESS", payload: 0});

    try {
      // Compress images and video
      const compressedImages = await Promise.all(
        state.images.map(compressImage)
      );
      const compressedVideo = state.video
        ? await compressVideo(state.video)
        : null;

      // Upload media to cloud storage
      const cloudStorageProvider = new CloudStorageProvider();
      const imageUrls = await Promise.all(
        compressedImages.map((img) =>
          uploadToCloudStorage(cloudStorageProvider, img)
        )
      );
      const videoUrl = compressedVideo
        ? await uploadToCloudStorage(cloudStorageProvider, compressedVideo)
        : undefined;

      // Update upload progress
      dispatch({type: "SET_UPLOAD_PROGRESS", payload: 50});

      // Prepare product data
      const productData: ProductFormData = {
        ...state.formData,
        images: imageUrls,
        mainImage: imageUrls[0], // Set the first image as the main image
        video: videoUrl,
        youtubeLink: state.youtubeLink,
      };

      // Add product to database
     try {
       await addProduct(productData);
       dispatch({type: "SET_UPLOAD_PROGRESS", payload: 100});
       console.log("Product uploaded successfully");
       dispatch({type: "RESET_FORM"});
     } catch (error) {
       console.error("Error adding product:", error);
       throw new Error("Failed to add product to database. Please try again.");
     }
    } catch (error) {
      console.error("Error uploading product:", error);
      dispatch({type: "SET_IS_UPLOADING", payload: false});
      throw error;
    }
  };

  return (
    <ProductUploadContext.Provider value={{state, dispatch, uploadProduct}}>
      {children}
    </ProductUploadContext.Provider>
  );
};
