import { Generic } from '@a11y-ui/core';

import { watchBoolean } from '../../utils/prop.validators';

/* types */
export type AdjustHeightPropType = boolean;

/**
 * Adjusts the height of the element to its content.
 */
export type PropAdjustHeight = {
	adjustHeight: AdjustHeightPropType;
};

/* validator */
export const validateAdjustHeight = (component: Generic.Element.Component, value?: AdjustHeightPropType): void => {
	watchBoolean(component, '_adjustHeight', value);
};
