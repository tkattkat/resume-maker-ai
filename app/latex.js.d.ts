declare module 'latex.js' {
    export class Generator {
      constructor(options?: any);
      parse(latex: string): {
        pdf(): Promise<Blob>;
      };
    }
  }