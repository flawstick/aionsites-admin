export type Category = {
  _id: string;
  name: string;
  description: string;
  index: number;
};

export type Addition = {
  name: string;
  price: number;
  multiple?: boolean;
  indexDaysAvailable?: number[];
  isSpicy?: boolean;
  spiceLevel?: number;
  vegan?: boolean;
  max?: number;
};

export type Modifier = {
  _id: string;
  name: string;
  required: boolean;
  multiple: boolean;
  options: Addition[];
  max?: number;
  indexDaysAvailable?: number[];
};
