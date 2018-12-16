import { Readable } from "stream";
declare namespace morgan {
  
}

export interface Upload {
  stream: Readable;
  filename: string;
  mimetype: string;
  encoding: string;
}
