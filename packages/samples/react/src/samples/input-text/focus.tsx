import React, { useLayoutEffect, useRef } from 'react';
import { KolButton, KolForm, KolInputText } from '@public-ui/react';

import { FC } from 'react';

export const InputTextFocus: FC = () => {
	const ref = useRef<HTMLKolInputTextElement | null>(null);

	useLayoutEffect(() => {
		setTimeout(() => {
			ref.current?.focus();
		}, 100);
	}, [ref]);

	return (
		<KolForm className="grid gap-4">
			<KolInputText ref={ref} _id="vorname" _label="Vorname" />
			<KolInputText _label="Nachname" />
			<div>
				<KolButton _label="Submit"></KolButton>
			</div>
		</KolForm>
	);
};
