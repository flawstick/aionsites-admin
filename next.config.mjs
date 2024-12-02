import { withExpo } from '@expo/next-adapter';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  // Enable SWC for faster builds
  experimental: {
    forceSwcTransforms: true,
  },
  // Transpile React Native and Expo packages
  transpilePackages: ['react-native', 'expo'],
};

export default withExpo(withNextIntl(nextConfig));
