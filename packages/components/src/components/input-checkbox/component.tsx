import { Component, Element, h, Host, JSX, Prop, State, Watch } from '@stencil/core';
import { Stringified } from '../../types/common';

import { InputTypeOnDefault } from '../../types/input/types';
import { validateChecked, validateIndeterminate } from '../../types/props';
import { nonce } from '../../utils/dev.utils';
import { propagateFocus } from '../../utils/reuse';
import { getRenderStates } from '../input/controller';
import { InputCheckboxController } from './controller';
import { ComponentApi, InputCheckboxIcon, InputCheckboxVariant, States } from './types';

/**
 * @slot - Die Beschriftung der Checkbox.
 */
@Component({
	tag: 'kol-input-checkbox',
	styleUrls: {
		default: './style.css',
	},
	shadow: true,
})
export class KolInputCheckbox implements ComponentApi {
	@Element() private readonly host?: HTMLKolInputCheckboxElement;
	private ref?: HTMLInputElement;

	private readonly catchRef = (ref?: HTMLInputElement) => {
		this.ref = ref;
		propagateFocus(this.host, this.ref);
	};

	public render(): JSX.Element {
		const { ariaDescribedBy } = getRenderStates(this.state);
		const showExpertSlot = this.state._label === ''; // _label="" or _label
		const showDefaultSlot = this.state._label === '…'; // deprecated: default slot will be removed in v2.0.0
		return (
			<Host>
				<kol-input
					class={{
						checkbox: true,
						[this.state._variant]: true,
					}}
					data-role={this.state._variant === 'button' ? 'button' : undefined}
					onKeyPress={this.state._variant === 'button' ? this.onChange : undefined}
					tabIndex={this.state._variant === 'button' ? 0 : undefined}
					_alert={this.state._alert}
					_disabled={this.state._disabled}
					_error={this.state._error}
					_hideLabel={this.state._hideLabel}
					_hint={this.state._hint}
					_id={this.state._id}
					_required={this.state._required}
					_touched={this.state._touched}
					onClick={() => this.ref?.focus()}
				>
					<span slot="label">{showExpertSlot ? <slot name="expert"></slot> : showDefaultSlot ? <slot></slot> : this.state._label}</span>
					<div slot="input">
						<kol-icon
							onClick={this.onChange}
							_ariaLabel=""
							_icon={this.state._indeterminate ? this.state._icon.indeterminate : this.state._checked ? this.state._icon.checked : this.state._icon.unchecked}
						/>
						<input
							ref={this.catchRef}
							accessKey={this.state._accessKey} // by checkbox?!
							aria-describedby={ariaDescribedBy.length > 0 ? ariaDescribedBy.join(' ') : undefined}
							aria-labelledby={`${this.state._id}-label`}
							checked={this.state._checked}
							disabled={this.state._disabled === true}
							id={this.state._id}
							indeterminate={this.state._indeterminate}
							name={this.state._name}
							required={this.state._required === true}
							tabIndex={this.state._tabIndex}
							title=""
							type="checkbox"
							value={typeof this.state._value === 'string' ? this.state._value : ''}
							{...this.controller.onFacade}
							onChange={this.onChange}
						></input>
					</div>
				</kol-input>
			</Host>
		);
	}

	private readonly controller: InputCheckboxController;

	/**
	 * Gibt an, mit welcher Tastenkombination man das interaktive Element der Komponente auslösen oder fokussieren kann.
	 */
	@Prop() public _accessKey?: string;

	/**
	 * Gibt an, ob der Screenreader die Meldung aktiv vorlesen soll.
	 */
	@Prop({ mutable: true, reflect: true }) public _alert?: boolean = true;

	/**
	 * Gibt an, ob die Checkbox ausgewählt ist oder nicht. (kann gelesen und gesetzt werden)
	 */
	@Prop({ mutable: true, reflect: true }) public _checked?: boolean = false;

	/**
	 * Deaktiviert das interaktive Element in der Komponente und erlaubt keine Interaktion mehr damit.
	 */
	@Prop({ reflect: true }) public _disabled?: boolean;

	/**
	 * Gibt den Text für eine Fehlermeldung an.
	 */
	@Prop() public _error?: string;

	/**
	 * Blendet die Beschriftung (Label) aus und zeigt sie stattdessen mittels eines Tooltips an.
	 */
	@Prop({ reflect: true }) public _hideLabel?: boolean;

	/**
	 * Gibt den Hinweistext an.
	 */
	@Prop() public _hint?: string = '';

	/**
	 * Setzt die Iconklasse (z.B.: `_icon="codicon codicon-home`).
	 */
	@Prop() public _icon?: Stringified<InputCheckboxIcon>;

	/**
	 * Gibt die interne ID des primären Elements in der Komponente an.
	 */
	@Prop() public _id?: string;

	/**
	 * Gibt an, ob die Checkbox weder ausgewählt noch nicht ausgewählt ist.
	 */
	@Prop({ mutable: true, reflect: true }) public _indeterminate?: boolean;

	/**
	 * Setzt die sichtbare oder semantische Beschriftung der Komponente (z.B. Aria-Label, Label, Headline, Caption, Summary usw.).
	 */
	@Prop() public _label!: string;

	/**
	 * Gibt den technischen Namen des Eingabefeldes an.
	 */
	@Prop() public _name?: string;

	/**
	 * Gibt die EventCallback-Funktionen für das Input-Event an.
	 */
	@Prop() public _on?: InputTypeOnDefault;

	/**
	 * Macht das Eingabeelement zu einem Pflichtfeld.
	 */
	@Prop({ reflect: true }) public _required?: boolean;

	/**
	 * Selector for synchronizing the value with another input element.
	 * @internal
	 */
	@Prop() public _syncValueBySelector?: string;

	/**
	 * Gibt an, welchen Tab-Index das primäre Element in der Komponente hat. (https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex)
	 */
	@Prop() public _tabIndex?: number;

	/**
	 * Gibt an, ob dieses Eingabefeld von Nutzer:innen einmal besucht/berührt wurde.
	 */
	@Prop({ mutable: true, reflect: true }) public _touched?: boolean = false;

	/**
	 * Gibt an, welche Variante der Darstellung genutzt werden soll.
	 *
	 * @deprecated Verwende stattdessen das Attribute _variant.
	 */
	@Prop() public _type?: InputCheckboxVariant;

	/**
	 * Gibt den Schlüssel/Namen der Checkbox an. ({ [value]: [checked] })
	 */
	@Prop() public _value?: string;

	/**
	 * Gibt an, welche Variante der Darstellung genutzt werden soll.
	 */
	@Prop() public _variant?: InputCheckboxVariant; // TODO: = 'default'; in v2 setzen

	@State() public state: States = {
		_checked: false,
		_icon: {
			checked: 'codicon codicon-check',
			indeterminate: 'codicon codicon-remove',
			unchecked: 'codicon codicon-add',
		},
		_id: nonce(), // ⚠ required
		_indeterminate: false,
		_label: '…', // ⚠ required
		_variant: 'default',
	};

	public constructor() {
		this.controller = new InputCheckboxController(this, 'checkbox', this.host);
	}

	@Watch('_accessKey')
	public validateAccessKey(value?: string): void {
		this.controller.validateAccessKey(value);
	}

	@Watch('_alert')
	public validateAlert(value?: boolean): void {
		this.controller.validateAlert(value);
	}

	@Watch('_checked')
	public validateChecked(value?: boolean): void {
		validateChecked(this, value);
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
	public validateIcon(value?: Stringified<InputCheckboxIcon>): void {
		this.controller.validateIcon(value);
	}

	@Watch('_id')
	public validateId(value?: string): void {
		this.controller.validateId(value);
	}

	@Watch('_indeterminate')
	public validateIndeterminate(value?: boolean): void {
		validateIndeterminate(this, value);
	}

	@Watch('_label')
	public validateLabel(value?: string): void {
		this.controller.validateLabel(value);
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

	@Watch('_syncValueBySelector')
	public validateSyncValueBySelector(value?: string): void {
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

	@Watch('_type')
	public validateType(value?: InputCheckboxVariant): void {
		this.controller.validateType(value);
	}

	@Watch('_value')
	public validateValue(value?: string): void {
		this.controller.validateValue(value);
	}

	@Watch('_variant')
	public validateVariant(value?: InputCheckboxVariant): void {
		this.controller.validateVariant(value);
	}

	public componentWillLoad(): void {
		this._alert = this._alert === true;
		this._touched = this._touched === true;
		this.controller.componentWillLoad();
	}

	private onChange = (event: Event): void => {
		this._checked = !this._checked;
		this._indeterminate = false;
		this.controller.setValue(event, this._checked);
	};
}
