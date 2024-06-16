import antfu from '@antfu/eslint-config';
import { join } from 'pathe';

export default antfu({
	formatters: true,

	/** general rules */
	rules: {
		'eqeqeq': ['error', 'always', { null: 'ignore' }],
		'no-unexpected-multiline': 'error',
		'no-unreachable': 'error',
		'curly': ['error', 'all'],
	},

	stylistic: {
		indent: 'tab',
		quotes: 'single',
		semi: true,
	},

	typescript: {
		tsconfigPath: join(import.meta.dirname, 'tsconfig.json'),
	},
});
