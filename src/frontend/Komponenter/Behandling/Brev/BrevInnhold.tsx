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
import { useToggles } from '../../../App/context/TogglesContext';
import { ToggleName } from '../../../App/context/toggles';

const StyledSelect = styled(Select)`
    margin-top: 1rem;
`;

const Innholdsrad = styled(Panel)`
    width: 70%;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const ToKolonneLayout = styled.div`
    display: flex;
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

const FlyttAvsnittKnappWrapper = styled.div`
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
    leggTilAvsnittFørst: () => void;
    leggAvsnittBakSisteSynligeAvsnitt: () => void;
    flyttAvsnittOpp: (avsnittId: string) => void;
    flyttAvsnittNed: (avsnittId: string) => void;
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
    leggTilAvsnittFørst,
    leggAvsnittBakSisteSynligeAvsnitt,
    flyttAvsnittOpp,
    flyttAvsnittNed,
    context,
}) => {
    const ikkeRedigerBareBrev: (FrittståendeBrevtype | FritekstBrevtype | undefined)[] = [
        FrittståendeBrevtype.VARSEL_OM_AKTIVITETSPLIKT,
    ];
    const finnesSynligeAvsnitt = avsnitt.some((avsnitt) => !avsnitt.skalSkjulesIBrevbygger);
    const brevSkalKunneRedigeres = !ikkeRedigerBareBrev.includes(brevType);
    const { toggles } = useToggles();
    const skalViseValgmulighetForSanksjon = toggles[ToggleName.visValgmulighetForSanksjon];

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
                )
                    .filter(
                        (type: FrittståendeBrevtype | FritekstBrevtype) =>
                            type !== FritekstBrevtype.SANKSJON || skalViseValgmulighetForSanksjon
                    )
                    .map((type: FrittståendeBrevtype | FritekstBrevtype) => (
                        <option value={type} key={type}>
                            {
                                BrevtyperTilSelectNavn[
                                    type as FrittståendeBrevtype | FritekstBrevtype
                                ]
                            }
                        </option>
                    ))}
            </StyledSelect>
            {brevType && (
                <>
                    {brevSkalKunneRedigeres && (
                        <Overskrift
                            label="Overskrift"
                            value={overskrift}
                            onChange={(e) => {
                                endreOverskrift(e.target.value);
                            }}
                        />
                    )}
                    {finnesSynligeAvsnitt && brevSkalKunneRedigeres && (
                        <LeggTilKnappWrapper>
                            <LeggTilKnapp
                                onClick={leggTilAvsnittFørst}
                                knappetekst="Legg til avsnitt"
                            />
                        </LeggTilKnappWrapper>
                    )}
                    {avsnitt
                        .filter((avsnitt) => !avsnitt.skalSkjulesIBrevbygger)
                        .map((rad, index) => {
                            const deloverskriftId = `deloverskrift-${rad.id}`;
                            const innholdId = `innhold-${rad.id}`;
                            const toKolonneId = `toKolonne-${rad.id}`;
                            const knappWrapperId = `knappWrapper-${rad.id}`;

                            return (
                                <ToKolonneLayout id={toKolonneId}>
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
                                    <FlyttAvsnittKnappWrapper id={knappWrapperId}>
                                        {index !== 0 && (
                                            <LeggTilKnapp
                                                onClick={() => {
                                                    flyttAvsnittOpp(rad.id);
                                                }}
                                                knappetekst="Flytt avsnitt opp"
                                            />
                                        )}
                                        {index + 1 !==
                                            avsnitt.filter(
                                                (avsnitt) => !avsnitt.skalSkjulesIBrevbygger
                                            ).length && (
                                            <LeggTilKnapp
                                                onClick={() => {
                                                    flyttAvsnittNed(rad.id);
                                                }}
                                                knappetekst="Flytt avsnitt ned"
                                            />
                                        )}
                                    </FlyttAvsnittKnappWrapper>
                                </ToKolonneLayout>
                            );
                        })}
                    {brevSkalKunneRedigeres && (
                        <LeggTilKnappWrapper>
                            <LeggTilKnapp
                                onClick={leggAvsnittBakSisteSynligeAvsnitt}
                                knappetekst="Legg til avsnitt"
                            />
                        </LeggTilKnappWrapper>
                    )}
                </>
            )}
        </BrevKolonner>
    );
};

export default BrevInnhold;
