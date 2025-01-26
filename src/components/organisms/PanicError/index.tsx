'use client';
import { usePanicValue } from '@/contexts/openapi/panic';

import PanicErrorComponent from './PanicError';

const PanicError: React.FC = () => {
  const panic = usePanicValue();
  return <PanicErrorComponent panic={panic} />;
};

export default PanicError;
