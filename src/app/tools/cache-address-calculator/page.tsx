import type { Metadata } from 'next';
import CacheAddressCalculator from './CacheAddressCalculator';

export const metadata: Metadata = {
  title: 'Cache Tag, Index and Offset Calculator | Shubham Raj',
  description:
    'Free calculator that splits a memory address into cache tag, set index and block offset for any direct-mapped, set-associative or fully associative cache.',
  alternates: { canonical: '/tools/cache-address-calculator' },
};

export default function Page() {
  return <CacheAddressCalculator />;
}
