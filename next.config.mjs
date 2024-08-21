import { withExpo } from '@expo/next-adapter';

const nextConfig = {
  // Enable SWC for faster builds
  experimental: {
    forceSwcTransforms: true,
  },
  // Transpile React Native and Expo packages
  transpilePackages: ['react-native', 'expo'],
};

export default withExpo(nextConfig);

