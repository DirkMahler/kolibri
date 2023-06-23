import { mixMembers } from 'stencil-awesome-test';
import { KoliBriCustomIcon, KoliBriIconProp } from '../../../types/icon';
import { mapIconProp2State } from '../../../types/props/icon';
import { getIconHtml } from '../../icon/test/html.mock';
import { KolibriSpanProps, KolibriSpanStates } from '../types';

type Slots = {
	''?: string;
	expert?: string;
} & Record<string, undefined | string>;

export const getSpanWcHtml = (
	props: KolibriSpanProps,
	slots: Slots = {
		expert: undefined,
	},
	additionalAttrs = ''
): string => {
	const state = mixMembers<KolibriSpanProps, KolibriSpanStates>(
		{
			_icon: {},
			_hideLabel: false,
			_label: '…', // ⚠ required
		},
		props
	);
	const hideExpertSlot = state._label.length > 0;
	const icon = mapIconProp2State(state._icon as KoliBriIconProp);
	return `
<kol-span-wc${props._hideLabel ? ' _hide-label' : ''}${state._hideLabel === true ? ` class="icon-only hide-label"` : ``}${additionalAttrs}>
	${
		icon.top
			? getIconHtml({
					_ariaLabel: '',
					_icon: (icon.top as KoliBriCustomIcon).icon,
			  })
			: ''
	}
	<span>
		${
			icon.left
				? getIconHtml(
						{
							_ariaLabel: '',
							_icon: (icon.left as KoliBriCustomIcon).icon,
						},
						` class="icon left"`
				  )
				: ''
		}
		${!state._hideLabel && state._label.length > 0 ? `<span>${state._label}</span>` : ``}
		<span${hideExpertSlot ? ' aria-hidden="true" hidden' : ''}>
			${slots.expert ? slots.expert : ``}
		</span>
		${
			icon.right
				? getIconHtml(
						{
							_ariaLabel: '',
							_icon: (icon.right as KoliBriCustomIcon).icon,
						},
						` class="icon right"`
				  )
				: ''
		}
	</span>
	${
		icon.bottom
			? getIconHtml({
					_ariaLabel: '',
					_icon: (icon.bottom as KoliBriCustomIcon).icon,
			  })
			: ''
	}
</kol-span-wc>`;
};

export const getSpanHtml = (props: KolibriSpanProps): string => {
	return `
<kol-span${props._hideLabel ? ' _hide-label' : ''}>
	<mock:shadow-root>
		${getSpanWcHtml(props, {
			expert: `<slot name="expert" slot="expert"></slot>`,
		})}
	</mock:shadow-root>
</kol-span>`;
};
