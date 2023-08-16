import { Generic } from '@a11y-ui/core';

import { Props as ButtonProps } from '../button/types';
import { Stringified } from '../../types/common';
import { KoliBriHorizontalIcon } from '../../types/icon';
import { InputTextType } from '../../types/input/control/text';
import { InputTypeOnDefault, InputTypeOnOff } from '../../types/input/types';
import { PropLabelWithExpertSlot } from '../../types/props/label';
import { PropSuggestions } from '../../types/props/suggestions';
import { W3CInputValue } from '../../types/w3c';
import { PropSyncValueBySelector } from '../../types/props/sync-value-by-selector';
import { PropDisabled } from '../../types/props/disabled';
import { PropHasCounter } from '../../types/props/has-counter';
import { PropHideLabel } from '../../types/props/hide-label';
import { PropId } from '../../types/props/id';
import { PropName } from '../../types/props/name';
import { PropReadOnly } from '../../types/props/read-only';
import { PropRequired } from '../../types/props/required';
import { PropTouched } from '../../types/props/touched';

type RequiredProps = PropLabelWithExpertSlot;
type OptionalProps = {
	accessKey: string;
	alert: boolean;
	autoComplete: InputTypeOnOff;
	error: string;
	hint: string;
	icon: Stringified<KoliBriHorizontalIcon>;
	/**
	 * @deprecated Use suggestions.
	 */
	list: Stringified<string[]>;
	maxLength: number;
	on: InputTypeOnDefault;
	pattern: string;
	placeholder: string;
	/**
	 * @deprecated
	 */
	size: number;
	smartButton: Stringified<ButtonProps>;
	tabIndex: number;
	type: InputTextType;
	value: string;
} & PropDisabled &
	PropHasCounter &
	PropHideLabel &
	PropId &
	PropName &
	PropReadOnly &
	PropRequired &
	PropSuggestions &
	PropSyncValueBySelector &
	PropTouched;
export type Props = Generic.Element.Members<RequiredProps, OptionalProps>;

type RequiredStates = {
	autoComplete: InputTypeOnOff;
	hasValue: boolean;
	suggestions: W3CInputValue[];
	type: InputTextType;
} & PropId &
	PropLabelWithExpertSlot;
type OptionalStates = {
	accessKey: string;
	alert: boolean;
	currentLength: number;
	error: string;
	hint: string;
	icon: KoliBriHorizontalIcon;
	maxLength: number;
	on: InputTypeOnDefault;
	pattern: string;
	placeholder: string;
	/**
	 * @deprecated
	 */
	size: number;
	smartButton: ButtonProps;
	tabIndex: number;
	value: string;
} & PropDisabled &
	PropHasCounter &
	PropHideLabel &
	PropName &
	PropReadOnly &
	PropRequired &
	PropTouched;
export type States = Generic.Element.Members<RequiredStates, OptionalStates>;

export type Watches = Generic.Element.Watchers<RequiredProps, OptionalProps>;

export type API = Generic.Element.ComponentApi<RequiredProps, OptionalProps, RequiredStates, OptionalStates>;
