import { Generic } from '@a11y-ui/core';

import { Events } from '../../enums/events';
import { EventCallback } from '../../types/callbacks';

export type KoliBriFormCallbacks = {
	[Events.onSubmit]?: EventCallback<Event>;
	[Events.onReset]?: EventCallback<Event>;
};

type RequiredProps = NonNullable<unknown>;
type OptionalProps = {
	on: KoliBriFormCallbacks;
	requiredText: string | boolean;
};
export type Props = Generic.Element.Members<RequiredProps, OptionalProps>;

type RequiredStates = RequiredProps;
type OptionalStates = OptionalProps;

export type States = Generic.Element.Members<RequiredStates, OptionalStates>;
export type API = Generic.Element.ComponentApi<RequiredProps, OptionalProps, RequiredStates, OptionalStates>;
