// app/providers/index.tsx
import React from "react";
import { UserProvider } from "@/context/userContext/UserContext";
import { ShoppingProvider } from "@/context/shoppingContext";
import { ProductProvider } from "@/context/productContext/productcontext";
import {SearchProvider} from "@/context/searchcontext/searchcontext";
import {ProductUploadProvider} from "@/context/productUpload/productUploadContext";

// Define the list of providers
const contextProviders = [
  UserProvider,
  ShoppingProvider,
  ProductProvider,
  SearchProvider,
  ProductUploadProvider,
] as const;

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({children}: ProvidersProps) {
  return contextProviders.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  );
}