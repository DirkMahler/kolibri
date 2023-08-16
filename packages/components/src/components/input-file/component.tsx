import { Component, Element, h, Host, JSX, Prop, State, Watch } from '@stencil/core';

import { Props as ButtonProps } from '../button/types';
import { Stringified } from '../../types/common';
import { KoliBriHorizontalIcon } from '../../types/icon';
import { InputTypeOnDefault } from '../../types/input/types';
import { LabelWithExpertSlotPropType } from '../../types/props/label';
import { nonce } from '../../utils/dev.utils';
import { stopPropagation, tryToDispatchKoliBriEvent } from '../../utils/events';
import { propagateFocus } from '../../utils/reuse';
import { getRenderStates } from '../input/controller';
import { InputFileController } from './controller';
import { API, States } from './types';
import { SyncValueBySelectorPropType } from '../../types/props/sync-value-by-selector';
import { TooltipAlignPropType } from '../../types/props/tooltip-align';
import { IdPropType } from '../../types/props/id';
import { NamePropType } from '../../types/props/name';

/**
 * @slot - Die Beschriftung des Eingabefeldes.
 */
@Component({
	tag: 'kol-input-file',
	styleUrls: {
		default: './style.css',
	},
	shadow: true,
})
export class KolInputFile implements API {
	@Element() private readonly host?: HTMLKolInputFileElement;
	private ref?: HTMLInputElement;

	private readonly catchRef = (ref?: HTMLInputElement) => {
		this.ref = ref;
		propagateFocus(this.host, this.ref);
	};

	public render(): JSX.Element {
		const { ariaDescribedBy } = getRenderStates(this.state);
		const hasExpertSlot = this.state._label === false; // _label="" or _label

		return (
			<Host>
				<kol-input
					class={{
						file: true,
						'hide-label': !!this.state._hideLabel,
					}}
					_disabled={this.state._disabled}
					_error={this.state._error}
					_hideLabel={this.state._hideLabel}
					_hint={this.state._hint}
					_icon={this.state._icon}
					_id={this.state._id}
					_required={this.state._required}
					_smartButton={this.state._smartButton}
					_touched={this.state._touched}
					onClick={() => this.ref?.focus()}
				>
					{/*  TODO: der folgende Slot ohne Name muss später entfernt werden */}
					<span slot="label">{hasExpertSlot ? <slot></slot> : this.state._label}</span>
					<div slot="input">
						<input
							ref={this.catchRef}
							title=""
							accept={this.state._accept}
							accessKey={this.state._accessKey}
							aria-describedby={ariaDescribedBy.length > 0 ? ariaDescribedBy.join(' ') : undefined}
							aria-label={this.state._hideLabel && typeof this.state._label === 'string' ? this.state._label : undefined}
							autoCapitalize="off"
							autoCorrect="off"
							disabled={this.state._disabled}
							id={this.state._id}
							multiple={this.state._multiple}
							name={this.state._name}
							required={this.state._required}
							spellcheck="false"
							type="file"
							value={this.state._value as string}
							{...this.controller.onFacade}
							onChange={this.onChange}
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

	private readonly controller: InputFileController;

	/**
	 * Gibt an, welche Dateiformate erlaubt sind.
	 */
	@Prop() public _accept?: string;

	/**
	 * Gibt an, mit welcher Tastenkombination man das interaktive Element der Komponente auslösen oder fokussieren kann.
	 */
	@Prop() public _accessKey?: string;

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
	 * Tells the element to hide the label.
	 * TODO: Change type back to `HideLabelPropType` after Stencil#4663 has been resolved.
	 */
	@Prop() public _hideLabel?: boolean;

	/**
	 * Gibt den Hinweistext an.
	 */
	@Prop() public _hint?: string = '';

	/**
	 * Setzt die Iconklasse (z.B.: `_icon="codicon codicon-home`).
	 */
	@Prop() public _icon?: Stringified<KoliBriHorizontalIcon>;

	/**
	 * Defines the internal ID of the primary component element.
	 */
	@Prop() public _id?: IdPropType;

	/**
	 * Setzt die sichtbare oder semantische Beschriftung der Komponente (z.B. Aria-Label, Label, Headline, Caption, Summary usw.).
	 */
	@Prop() public _label!: LabelWithExpertSlotPropType;

	/**
	 * Makes the input accept multiple inputs.
	 * TODO: Change type back to `MultiplePropType` after Stencil#4663 has been resolved
	 */
	@Prop() public _multiple?: boolean;

	/**
	 * Defines the technical name of an input field.
	 */
	@Prop() public _name?: NamePropType;

	/**
	 * Gibt die EventCallback-Funktionen für das Input-Event an.
	 */
	@Prop() public _on?: InputTypeOnDefault;

	/**
	 * Makes the input element required.
	 * TODO: Change type back to `RequiredPropType` after Stencil#4663 has been resolved
	 */
	@Prop() public _required?: boolean;

	/**
	 * Ermöglicht eine Schaltfläche ins das Eingabefeld mit einer beliebigen Aktion zu einzufügen (ohne label).
	 */
	@Prop() public _smartButton?: Stringified<ButtonProps>;

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
		_id: `id-${nonce()}`, // ⚠ required
		_label: false, // ⚠ required
	};

	public constructor() {
		this.controller = new InputFileController(this, 'input-file', this.host);
	}

	@Watch('_accept')
	public validateAccept(value?: string): void {
		this.controller.validateAccept(value);
	}

	@Watch('_accessKey')
	public validateAccessKey(value?: string): void {
		this.controller.validateAccessKey(value);
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

	@Watch('_hideLabel')
	public validateHideLabel(value?: boolean): void {
		this.controller.validateHideLabel(value);
	}

	@Watch('_hint')
	public validateHint(value?: string): void {
		this.controller.validateHint(value);
	}

	@Watch('_icon')
	public validateIcon(value?: Stringified<KoliBriHorizontalIcon>): void {
		this.controller.validateIcon(value);
	}

	@Watch('_id')
	public validateId(value?: string): void {
		this.controller.validateId(value);
	}

	@Watch('_label')
	public validateLabel(value?: LabelWithExpertSlotPropType): void {
		this.controller.validateLabel(value);
	}

	@Watch('_multiple')
	public validateMultiple(value?: boolean): void {
		this.controller.validateMultiple(value);
	}

	@Watch('_name')
	public validateName(value?: string): void {
		this.controller.validateName(value);
	}

	@Watch('_on')
	public validateOn(value?: InputTypeOnDefault): void {
		this.controller.validateOn(value);
	}

	@Watch('_required')
	public validateRequired(value?: boolean): void {
		this.controller.validateRequired(value);
	}

	@Watch('_smartButton')
	public validateSmartButton(value?: ButtonProps | string): void {
		this.controller.validateSmartButton(value);
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
	}

	private onChange = (event: Event): void => {
		if (this.ref instanceof HTMLInputElement && this.ref.type === 'file') {
			const value = this.ref.files;

			// Event handling
			stopPropagation(event);
			tryToDispatchKoliBriEvent('change', this.host, value);

			// Static form handling
			this.controller.setFormAssociatedValue(value);

			// Callback
			if (typeof this.state._on?.onChange === 'function') {
				this.state._on.onChange(event, value);
			}
		}
	};
}
