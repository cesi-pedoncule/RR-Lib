import Resource from "../class/Resource";
import { APIResourceData } from "./api";
import { DocumentPickerResult } from "./expo";

// Export API interfaces and types
export * from "./api";

// Export EXPO types
export * from './expo';

export type ResourceData = Resource | APIResourceData;
export type AttachmentDataFile = File | DocumentPickerResult;