import { executeTests } from 'stencil-awesome-test';

import { h } from '@stencil/core';
import { newSpecPage, SpecPage } from '@stencil/core/testing';

import { COMPONENTS } from '../../component-list';
import { getButtonLinkHtml } from './html.mock';

import { Props } from '../types';

executeTests<Props>(
	'ButtonLink',
	async (props): Promise<SpecPage> => {
		return await newSpecPage({
			components: COMPONENTS,
			template: () => <kol-button-link {...props}></kol-button-link>,
		});
	},
	{
		_label: [`Beschreibung`],
	},
	getButtonLinkHtml
);
