import type { Generic, LoaderCallback, RegisterOptions } from '@a11y-ui/core';
import { register as coreRegister } from '@a11y-ui/core';
import { I18nextService } from './i18n';

export * from '@a11y-ui/core';

export const register = (
	themes:
		| Generic.Theming.RegisterPatch<string, string, string>
		| Generic.Theming.RegisterPatch<string, string, string>[]
		| Set<Generic.Theming.RegisterPatch<string, string, string>>,
	loaders: LoaderCallback | LoaderCallback[] | Set<LoaderCallback>,
	options?: RegisterOptions
): Promise<void[]> => {
	try {
		if (window.A11yUi === undefined) {
			Object.defineProperty(window, 'A11yUi', {
				value: {
					I18n: new I18nextService(options?.translation?.name ?? 'de', options?.translations),
				},
				writable: false,
			});
		}
	} catch (e) {
		// das Laden der Sprache ist optional
	}
	return coreRegister(themes, loaders, options);
};
