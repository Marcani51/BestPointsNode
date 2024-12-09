declare module "ejs-mate" {
    import { Options } from "ejs";
  
    function ejsMate(options?: Options): (path: string, options?: object, callback?: (err: Error | null, str?: string) => void) => void;
  
    export = ejsMate;
  }