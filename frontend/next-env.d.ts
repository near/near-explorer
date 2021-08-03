/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="next/image-types/global" />

declare module "*.svg" {
  const content: React.FC;
  export default content;
}

declare module "react-text-collapse";
declare module "echarts-for-react";

declare module "*"; // for datamaps npm
