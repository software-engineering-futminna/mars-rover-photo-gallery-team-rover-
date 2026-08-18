export type RoverName = "curiosity" | "perseverance";

export const ROVERS: RoverName[] = ["curiosity", "perseverance"];

export interface Camera {
  name: string;
  full_name: string;
}

export interface Manifest {
  rover: RoverName;
  cameras: Camera[];
  maxSol: number;
  maxDate: string;
  totalPhotos: number;
  status: string;
  landingDate: string;
  launchDate: string;
}
