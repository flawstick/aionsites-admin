import React from "react";
import Lottie from "react-lottie";

interface LottieAnimationProps {
  width?: number;
  height?: number;
  loop?: boolean;
  autoplay?: boolean;
}

export const LoadingAnimation: React.FC<LottieAnimationProps> = ({
  width = 400,
  height = 400,
  loop = true,
  autoplay = true,
}) => {
  const defaultOptions = {
    loop,
    autoplay,
    animationData: require("/public/animations/loading.json"),
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={defaultOptions} height={height} width={width} />;
};
