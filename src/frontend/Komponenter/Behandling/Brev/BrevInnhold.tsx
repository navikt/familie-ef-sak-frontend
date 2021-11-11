import React, { ChangeEventHandler } from 'react';
import styled from 'styled-components';
import { Input, Select, Textarea } from 'nav-frontend-skjema';
import Panel from 'nav-frontend-paneler';
import LenkeKnapp from '../../../Felles/Knapper/LenkeKnapp';
import SlettSøppelkasse from '../../../Felles/Ikoner/SlettSøppelkasse';
import LeggTilKnapp from '../../../Felles/Knapper/LeggTilKnapp';
import {
    AvsnittMedId,
    BrevtyperTilAvsnitt,
    BrevtyperTilOverskrift,
    BrevtyperTilSelectNavn,
    FritekstBrevContext,
    FritekstBrevtype,
    FrittståendeBrevtype,
} from './BrevTyper';
import { skjulAvsnittIBrevbygger } from './BrevUtils';

const StyledSelect = styled(Select)`
    margin-top: 1rem;
`;

const Innholdsrad = styled(Panel)`
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Overskrift = styled(Input)`
    margin-top: 1rem;
`;

const LeggTilKnappWrapper = styled.div`
    margin-top: 1.5rem;
    display: flex;
    justify-content: flex-start;
`;

const BrevKolonner = styled.div`
    display: flex;
    flex-direction: column;
`;

type Props = {
    brevType: FrittståendeBrevtype | FritekstBrevtype | undefined;
    endreBrevType: (nyBrevType: FrittståendeBrevtype | FritekstBrevtype) => void;
    overskrift: string;
    endreOverskrift: (nyOverskrift: string) => void;
    avsnitt: AvsnittMedId[];
    endreAvsnitt: (avsnitt: AvsnittMedId[]) => void;
    endreDeloverskriftAvsnitt: (radId: string) => ChangeEventHandler<HTMLInputElement>;
    endreInnholdAvsnitt: (radId: string) => ChangeEventHandler<HTMLTextAreaElement>;
    fjernRad: (radId: string) => void;
    leggTilAvsnittForan: () => void;
    leggAvsnittBakSisteSynligeAvsnitt: () => void;
    context: FritekstBrevContext;
};

const BrevInnhold: React.FC<Props> = ({
    brevType,
    endreBrevType,
    overskrift,
    endreOverskrift,
    avsnitt,
    endreAvsnitt,
    endreDeloverskriftAvsnitt,
    endreInnholdAvsnitt,
    fjernRad,
    leggTilAvsnittForan,
    leggAvsnittBakSisteSynligeAvsnitt,
    context,
}) => {
    const finnesSynligeAvsnitt = avsnitt.some((avsnitt) => !avsnitt.skalSkjulesIBrevbygger);

    return (
        <BrevKolonner>
            <StyledSelect
                label="Brevtype"
                onChange={(e) => {
                    const nyBrevType = e.target.value as FrittståendeBrevtype | FritekstBrevtype;
                    endreBrevType(nyBrevType);
                    endreOverskrift(nyBrevType ? BrevtyperTilOverskrift[nyBrevType] : '');
                    endreAvsnitt(
                        nyBrevType ? skjulAvsnittIBrevbygger(BrevtyperTilAvsnitt[nyBrevType]) : []
                    );
                }}
                value={brevType}
            >
                <option value={''}>Ikke valgt</option>
                {Object.values(
                    context === FritekstBrevContext.FRITTSTÅENDE
                        ? FrittståendeBrevtype
                        : FritekstBrevtype
                ).map((type: FrittståendeBrevtype | FritekstBrevtype) => (
                    <option value={type} key={type}>
                        {BrevtyperTilSelectNavn[type as FrittståendeBrevtype | FritekstBrevtype]}
                    </option>
                ))}
            </StyledSelect>
            {brevType && (
                <>
                    <Overskrift
                        label="Overskrift"
                        value={overskrift}
                        onChange={(e) => {
                            endreOverskrift(e.target.value);
                        }}
                    />
                    {finnesSynligeAvsnitt && (
                        <LeggTilKnappWrapper>
                            <LeggTilKnapp
                                onClick={leggTilAvsnittForan}
                                knappetekst="Legg til avsnitt"
                            />
                        </LeggTilKnappWrapper>
                    )}
                    {avsnitt
                        .filter((avsnitt) => !avsnitt.skalSkjulesIBrevbygger)
                        .map((rad) => {
                            const deloverskriftId = `deloverskrift-${rad.id}`;
                            const innholdId = `innhold-${rad.id}`;

                            return (
                                <Innholdsrad key={rad.id} border>
                                    <Input
                                        onChange={endreDeloverskriftAvsnitt(rad.id)}
                                        label="Deloverskrift (valgfri)"
                                        id={deloverskriftId}
                                        value={rad.deloverskrift}
                                    />
                                    <Textarea
                                        onChange={endreInnholdAvsnitt(rad.id)}
                                        label="Innhold"
                                        id={innholdId}
                                        value={rad.innhold}
                                        maxLength={0}
                                    />
                                    <LenkeKnapp onClick={() => fjernRad(rad.id)}>
                                        <SlettSøppelkasse withDefaultStroke={false} />
                                        Slett avsnitt
                                    </LenkeKnapp>
                                </Innholdsrad>
                            );
                        })}
                    <LeggTilKnappWrapper>
                        <LeggTilKnapp
                            onClick={leggAvsnittBakSisteSynligeAvsnitt}
                            knappetekst="Legg til avsnitt"
                        />
                    </LeggTilKnappWrapper>
                </>
            )}
        </BrevKolonner>
    );
};

export default BrevInnhold;
