declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

declare module "*.css?inline" {
  const content: string;
  export default content;
}

declare const process: {
  env: {
    NODE_ENV: "development" | "production" | "test";
    [key: string]: string | undefined;
  };
};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      [key: string]: string | undefined;
    }
  }
}

export {};
