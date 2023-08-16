import { Component, Element, h, Host, JSX, Prop, State, Watch } from '@stencil/core';

import { InputTypeOnDefault } from '../../types/input/types';
import { LabelWithExpertSlotPropType } from '../../types/props/label';
import { RowsPropType } from '../../types/props/rows';
import { nonce } from '../../utils/dev.utils';
import { setState } from '../../utils/prop.validators';
import { propagateFocus } from '../../utils/reuse';
import { getRenderStates } from '../input/controller';
import { TextareaController } from './controller';
import { API, CSSResize, States } from './types';
import { AdjustHeightPropType } from '../../types/props/adjust-height';
import { HasCounterPropType } from '../../types/props/has-counter';
import { SyncValueBySelectorPropType } from '../../types/props/sync-value-by-selector';
import { TooltipAlignPropType } from '../../types/props/tooltip-align';
import { IdPropType } from '../../types/props/id';
import { NamePropType } from '../../types/props/name';

/**
 * https://stackoverflow.com/questions/17772260/textarea-auto-height
 */
const increaseTextareaHeight = (el: HTMLTextAreaElement): number => {
	el.style.overflow = 'hidden'; // verhindert, dass ein Scrollbalken kurz angezeigt wird
	const currentRows = el.rows;
	const rowHeight = el.clientHeight / currentRows;
	el.rows = 1;
	const nextRows = Math.round(el.scrollHeight / rowHeight);
	el.rows = currentRows;
	return nextRows;
};

/**
 * @slot - Die Beschriftung des Eingabefeldes.
 */
@Component({
	tag: 'kol-textarea',
	styleUrls: {
		default: './style.css',
	},
	shadow: true,
})
export class KolTextarea implements API {
	@Element() private readonly host?: HTMLKolTextareaElement;
	private ref?: HTMLTextAreaElement;

	private readonly catchRef = (ref?: HTMLTextAreaElement) => {
		this.ref = ref;
		propagateFocus(this.host, this.ref);
	};

	public render(): JSX.Element {
		const { ariaDescribedBy } = getRenderStates(this.state);
		const hasExpertSlot = this.state._label === false; // _label="" or _label

		return (
			<Host class={{ 'has-value': this.state._hasValue }}>
				<kol-input
					class={{ textarea: true, 'hide-label': !!this.state._hideLabel, 'has-counter': !!this.state._hasCounter }}
					_alert={this.state._alert}
					_currentLength={this.state._currentLength}
					_disabled={this.state._disabled}
					_error={this.state._error}
					_hasCounter={this.state._hasCounter}
					_hideLabel={this.state._hideLabel}
					_hint={this.state._hint}
					_id={this.state._id}
					_maxLength={this.state._maxLength}
					_readOnly={this.state._readOnly}
					_required={this.state._required}
					_touched={this.state._touched}
					onClick={() => this.ref?.focus()}
				>
					{/*  TODO: der folgende Slot ohne Name muss später entfernt werden */}
					<span slot="label">{hasExpertSlot ? <slot></slot> : this.state._label}</span>
					<div slot="input">
						<textarea
							ref={this.catchRef}
							title=""
							accessKey={this.state._accessKey}
							aria-describedby={ariaDescribedBy.length > 0 ? ariaDescribedBy.join(' ') : undefined}
							aria-label={this.state._hideLabel && typeof this.state._label === 'string' ? this.state._label : undefined}
							autoCapitalize="off"
							autoCorrect="off"
							disabled={this.state._disabled}
							id={this.state._id}
							maxlength={this.state._maxLength}
							name={this.state._name}
							readOnly={this.state._readOnly}
							required={this.state._required}
							rows={this.state._rows}
							placeholder={this.state._placeholder}
							spellcheck="false"
							{...this.controller.onFacade}
							onKeyUp={this.onKeyUp}
							style={{
								resize: this.state._resize,
							}}
							value={this.state._value}
						/>
						<kol-tooltip
							/**
							 * Dieses Aria-Hidden verhindert das doppelte Vorlesen des Labels,
							 * verhindert aber nicht das Aria-Labelledby vorgelesen wird.
							 */
							aria-hidden="true"
							hidden={hasExpertSlot || !this.state._hideLabel}
							_align={this._tooltipAlign}
							_label={typeof this.state._label === 'string' ? this.state._label : ''}
						></kol-tooltip>
					</div>
				</kol-input>
			</Host>
		);
	}

	private readonly controller: TextareaController;

	/**
	 * Gibt an, mit welcher Tastenkombination man das interaktive Element der Komponente auslösen oder fokussieren kann.
	 */
	@Prop() public _accessKey?: string;

	/**
	 * Adjusts the height of the element to its content.
	 * TODO: change back to AdjustHeightPropType after stencil #4663 has been resolved
	 */
	@Prop() public _adjustHeight?: boolean = false;

	/**
	 * Gibt an, ob der Screenreader die Meldung aktiv vorlesen soll.
	 */
	@Prop({ mutable: true, reflect: true }) public _alert?: boolean = true;

	/**
	 * Makes the element not focusable and ignore all events.
	 * TODO: Change type back to `DisabledPropType` after Stencil#4663 has been resolved
	 */
	@Prop() public _disabled?: boolean;

	/**
	 * Gibt den Text für eine Fehlermeldung an.
	 */
	@Prop() public _error?: string;

	/**
	 * Shows the character count on the lower border of the input.
	 * TODO: Change type back to `HasCounterPropType` after Stencil#4663 has been resolved
	 */
	@Prop() public _hasCounter?: boolean;

	/**
	 * Tells the element to hide the label.
	 * TODO: Change type back to `HideLabelPropType` after Stencil#4663 has been resolved.
	 */
	@Prop() public _hideLabel?: boolean;

	/**
	 * Gibt den Hinweistext an.
	 */
	@Prop() public _hint?: string = '';

	/**
	 * Defines the internal ID of the primary component element.
	 */
	@Prop() public _id?: IdPropType;

	/**
	 * Setzt die sichtbare oder semantische Beschriftung der Komponente (z.B. Aria-Label, Label, Headline, Caption, Summary usw.).
	 */
	@Prop() public _label!: LabelWithExpertSlotPropType;

	/**
	 * Gibt an, wie viele Zeichen maximal eingegeben werden können.
	 */
	@Prop() public _maxLength?: number;

	/**
	 * Defines the technical name of an input field.
	 */
	@Prop() public _name?: NamePropType;

	/**
	 * Gibt die EventCallback-Funktionen für das Input-Event an.
	 */
	@Prop() public _on?: InputTypeOnDefault;

	/**
	 * Gibt den Platzhalter des Eingabefeldes an, wenn es leer ist.
	 */
	@Prop() public _placeholder?: string;

	/**
	 * Makes the input element read only.
	 * TODO: Change type back to `ReadOnlyPropType` after Stencil#4663 has been resolved
	 */
	@Prop() public _readOnly?: boolean;

	/**
	 * Gibt an, ob die Größe des Eingabefeldes von Nutzer:innen geändert werden kann. (https://developer.mozilla.org/de/docs/Web/CSS/resize)
	 */
	@Prop() public _resize?: CSSResize = 'vertical';

	/**
	 * Makes the input element required.
	 * TODO: Change type back to `RequiredPropType` after Stencil#4663 has been resolved
	 */
	@Prop() public _required?: boolean;

	/**
	 * Defines how many rows of text should be visible at the same time.
	 */
	@Prop({ mutable: true, reflect: false }) public _rows?: RowsPropType;

	/**
	 * Selector for synchronizing the value with another input element.
	 * @internal
	 */
	@Prop() public _syncValueBySelector?: SyncValueBySelectorPropType;

	/**
	 * Gibt an, welchen Tab-Index das primäre Element in der Komponente hat. (https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex)
	 */
	@Prop() public _tabIndex?: number;

	/**
	 * Defines where to show the Tooltip preferably: top, right, bottom or left.
	 */
	@Prop() public _tooltipAlign?: TooltipAlignPropType = 'top';

	/**
	 * Shows if the input was touched by a user.
	 * TODO: Change type back to `TouchedPropType` after Stencil#4663 has been resolved
	 */
	@Prop({ mutable: true, reflect: true }) public _touched?: boolean = false;

	/**
	 * Gibt den Wert des Eingabefeldes an.
	 */
	@Prop() public _value?: string;

	@State() public state: States = {
		_adjustHeight: false,
		_currentLength: 0,
		_hasValue: false,
		_id: `id-${nonce()}`, // ⚠ required
		_label: false, // ⚠ required
		_resize: 'vertical',
	};

	public constructor() {
		this.controller = new TextareaController(this, 'textarea', this.host);
	}

	@Watch('_accessKey')
	public validateAccessKey(value?: string): void {
		this.controller.validateAccessKey(value);
	}

	@Watch('_adjustHeight')
	public validateAdjustHeight(value?: AdjustHeightPropType): void {
		this.controller.validateAdjustHeight(value);
	}

	@Watch('_alert')
	public validateAlert(value?: boolean): void {
		this.controller.validateAlert(value);
	}

	@Watch('_disabled')
	public validateDisabled(value?: boolean): void {
		this.controller.validateDisabled(value);
	}

	@Watch('_error')
	public validateError(value?: string): void {
		this.controller.validateError(value);
	}

	@Watch('_hasCounter')
	public validateHasCounter(value?: HasCounterPropType): void {
		this.controller.validateHasCounter(value);
	}

	@Watch('_hideLabel')
	public validateHideLabel(value?: boolean): void {
		this.controller.validateHideLabel(value);
	}

	@Watch('_hint')
	public validateHint(value?: string): void {
		this.controller.validateHint(value);
	}

	@Watch('_id')
	public validateId(value?: string): void {
		this.controller.validateId(value);
	}

	@Watch('_label')
	public validateLabel(value?: LabelWithExpertSlotPropType): void {
		this.controller.validateLabel(value);
	}

	@Watch('_maxLength')
	public validateMaxLength(value?: number): void {
		this.controller.validateMaxLength(value);
	}

	@Watch('_name')
	public validateName(value?: string): void {
		this.controller.validateName(value);
	}

	@Watch('_on')
	public validateOn(value?: InputTypeOnDefault): void {
		this.controller.validateOn(value);
	}

	@Watch('_placeholder')
	public validatePlaceholder(value?: string): void {
		this.controller.validatePlaceholder(value);
	}

	@Watch('_readOnly')
	public validateReadOnly(value?: boolean): void {
		this.controller.validateReadOnly(value);
	}

	@Watch('_resize')
	public validateResize(value?: CSSResize): void {
		this.controller.validateResize(value);
	}

	@Watch('_required')
	public validateRequired(value?: boolean): void {
		this.controller.validateRequired(value);
	}

	@Watch('_rows')
	public validateRows(value?: RowsPropType): void {
		this.controller.validateRows(value);
	}

	@Watch('_syncValueBySelector')
	public validateSyncValueBySelector(value?: SyncValueBySelectorPropType): void {
		this.controller.validateSyncValueBySelector(value);
	}

	@Watch('_tabIndex')
	public validateTabIndex(value?: number): void {
		this.controller.validateTabIndex(value);
	}

	@Watch('_touched')
	public validateTouched(value?: boolean): void {
		this.controller.validateTouched(value);
	}

	@Watch('_value')
	public validateValue(value?: string): void {
		this.controller.validateValue(value);
	}

	public componentWillLoad(): void {
		this._alert = this._alert === true;
		this._touched = this._touched === true;
		this.controller.componentWillLoad();

		this.state._hasValue = !!this.state._value;
		this.controller.addValueChangeListener((v) => (this.state._hasValue = !!v));
	}

	private readonly onKeyUp = () => {
		if (this.ref instanceof HTMLTextAreaElement) {
			setState(this, '_currentLength', this.ref.value.length);
			if (this.state._adjustHeight) {
				this._rows = increaseTextareaHeight(this.ref);
			}
		}
	};
}
