import { mixMembers } from 'stencil-awesome-test';

import { Props, States } from '../../link/types';
import { getIconHtml } from '../../icon/test/html.mock';
import { getSpanWcHtml } from '../../span/test/html.mock';
import { getTooltipHtml } from '../../tooltip/test/html.mock';

export const getLinkHtml = (props: Props, innerHTML = ''): string => {
	const state = mixMembers<Props, States>(
		{
			_href: '…', // ⚠ required
			_hideLabel: false,
			_icon: {},
			_label: false, // TODO: version 1
			// _label: '', // TODO: version 2
			_tooltipAlign: 'right',
			_targetDescription: 'Der Link wird in einem neuen Tab geöffnet.',
		},
		props
	);
	const hasExpertSlot: boolean = state._label === false;
	return `
<kol-link>
  <mock:shadow-root>
  <kol-link-wc>
    <a${state._hideLabel === true && typeof state._label === 'string' ? ` aria-label="${state._label}"` : ''} class="${
		state._hideLabel === true ? ' icon-only hide-label' : ''
	}${typeof state._target === 'string' && state._target !== '_self' ? ' external-link' : ''}" href="${
		typeof state._href === 'string' && state._href.length > 0 ? state._href : 'javascript:void(0)'
	}"${typeof state._selector === 'string' ? ' role="link" tabindex="0"' : ''}${
		typeof state._target === 'string' ? `${state._target === '_self' ? '' : 'rel="noopener"'} target="${state._target}"` : ''
	}>
			${getSpanWcHtml(
				{
					...state,
					_label: hasExpertSlot ? false : state._label || state._href,
				},
				{
					expert: `<slot name="expert" slot="expert"></slot><slot slot="expert"></slot>`,
				},
				''
			)}
			${
				typeof state._target === 'string' && state._target !== '_self'
					? getIconHtml(
							{
								_label: 'Der Link wird in einem neuen Tab geöffnet.',
								_icon: 'codicon codicon-link-external',
							},
							' class="external-link-icon"'
					  )
					: ''
			}
    </a>
		${getTooltipHtml(
			{
				_align: state._tooltipAlign,
				_label: state._label || state._href,
			},
			` aria-hidden="true"${hasExpertSlot || !state._hideLabel ? ' hidden' : ''}`
		)}
    </kol-link-wc>
  </mock:shadow-root>
  ${innerHTML}
</kol-link>`;
};
