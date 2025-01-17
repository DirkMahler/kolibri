import { Generic } from '@a11y-ui/core';

import { watchBoolean } from '../../utils/prop.validators';

/* types */
export type HasCloserPropType = boolean;

/**
 * Defines whether the element can be closed.
 */
export type PropHasCloser = {
	hasCloser: HasCloserPropType;
};

/* validator */
export const validateHasCloser = (component: Generic.Element.Component, value?: HasCloserPropType): void => {
	watchBoolean(component, '_hasCloser', value);
};
