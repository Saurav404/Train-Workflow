export type PantryType = 'F' | 'HF'; // 'F' stands for full Pantry, 'HF' stands for Half Pantry, Half passenger

export interface Pantry {
  startRole: string[];
  presentRole: string;
  nextRole: string[];
  actionBy?: string[];
  type: PantryType;
}

export function isValidPantryType(input: string): input is PantryType {
  return input === 'F' || input === 'HF';
}
