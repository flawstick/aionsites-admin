import React from "react";
import { LoadingAnimation } from "@/components/animations";

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <LoadingAnimation />
    </div>
  );
};

export default Loading;
