export interface colorProps {
  colorID: string;
  colorCode: string;
  colorDisplay: string;
}

export interface coloredProps {
  [key: string]: colorProps;
}
