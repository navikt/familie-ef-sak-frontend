import React, { KeyboardEventHandler } from 'react';
import { Search, SearchClearEvent } from '@navikt/ds-react';
import { søkKnappId } from './Søk';
import { erGyldigPersonident } from '../../../../App/utils/personident';

interface FnrInputWrapperProps {
    id: string;
    onEndre?: (nyVerdi: string) => void;
    onValidate: (isValid: boolean) => void;
    onKeyDown?: KeyboardEventHandler;
    placeholder?: string;
    label?: string;
    value?: string;
    onClear?: (e: SearchClearEvent) => void;
    laster: boolean;
    utløserSøk: () => void;
    size: 'small' | 'medium';
}

export const FnrInputWrapper: React.FC<FnrInputWrapperProps> = ({
    id,
    onEndre,
    onKeyDown,
    onValidate,
    value,
    placeholder,
    onClear,
    laster,
    label,
    utløserSøk,
    size,
}: FnrInputWrapperProps) => {
    return (
        <Search
            id={id}
            size={size}
            autoComplete={'off'}
            aria-label={placeholder}
            placeholder={placeholder}
            onChange={(nyVerdi) => {
                if (onEndre) {
                    onEndre(nyVerdi);
                }
                if (onValidate) {
                    onValidate(erGyldigPersonident(nyVerdi));
                }
            }}
            onClear={onClear}
            label={label}
            onKeyDown={onKeyDown}
            value={value}
            variant={'secondary'}
        >
            <Search.Button loading={laster} id={søkKnappId} onClick={utløserSøk} />
        </Search>
    );
};
