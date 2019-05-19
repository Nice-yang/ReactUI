import createTransformer from '../';
import { expectBaselineTransforms } from './expectTransform';

const transformer = createTransformer({ ssr: false });

expectBaselineTransforms(transformer, __dirname + '/fixtures/base', 'baselines/base');
