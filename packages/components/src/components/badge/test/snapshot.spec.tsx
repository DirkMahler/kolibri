import { h } from '@stencil/core';
import { newSpecPage, SpecPage } from '@stencil/core/testing';

import { COMPONENTS } from '../../component-list';
import { executeTests } from 'stencil-awesome-test';
import { getBadgeHtml } from './html.mock';
import { KoliBriBadgeProps } from '../types';

executeTests<KoliBriBadgeProps>(
	'Badge',
	async (props): Promise<SpecPage> => {
		const page = await newSpecPage({
			components: COMPONENTS,
			template: () => <kol-badge {...props} />,
		});
		return page;
	},
	{
		_color: ['#000000'],
		_icon: ['codicon codicon-home'],
		_hideLabel: [false, true],
		_label: ['Text'],
	},
	getBadgeHtml,
	{
		execMode: 'default', // ready
	}
);
