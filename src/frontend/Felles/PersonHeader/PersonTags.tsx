import PersonStatusVarsel from '../Varsel/PersonStatusVarsel';
import AdressebeskyttelseVarsel from '../Varsel/AdressebeskyttelseVarsel';
import { erEtterDagensDato } from '../../App/utils/dato';
import React from 'react';
import styled from 'styled-components';
import {
    Adressebeskyttelse,
    Folkeregisterpersonstatus,
    IFullmakt,
    IVergemål,
} from '../../App/typer/personopplysninger';
import { Tag } from '@navikt/ds-react';

const Container = styled.div`
    display: contents;
    @media screen and (max-width: 720px) {
        display: none;
    }
`;

const TagLitenSkjerm = styled(Tag)`
    @media screen and (min-width: 1190px) {
        display: none;
    }
`;

const TagStorSkjerm = styled(Tag)`
    @media screen and (max-width: 1189px) {
        display: none;
    }
`;

interface Props {
    adressebeskyttelse: Adressebeskyttelse | undefined;
    alder: number | undefined;
    egenAnsatt: boolean;
    fullmakt: IFullmakt[];
    folkeregisterPersonStatus: Folkeregisterpersonstatus | undefined;
    migrert: boolean;
    vergemål: IVergemål[];
}

const PersonTags: React.FC<Props> = ({
    adressebeskyttelse,
    alder,
    egenAnsatt,
    fullmakt,
    folkeregisterPersonStatus,
    migrert,
    vergemål,
}) => {
    return (
        <Container>
            {folkeregisterPersonStatus && (
                <PersonStatusVarsel folkeregisterpersonstatus={folkeregisterPersonStatus} />
            )}
            {adressebeskyttelse && (
                <AdressebeskyttelseVarsel adressebeskyttelse={adressebeskyttelse} />
            )}
            {alder && alder < 18 && (
                <>
                    <TagStorSkjerm variant={'warning'} size={'small'}>
                        Under 18 år
                    </TagStorSkjerm>
                    <TagLitenSkjerm variant={'warning'} size={'small'}>
                        U18
                    </TagLitenSkjerm>
                </>
            )}
            {egenAnsatt && (
                <>
                    <TagLitenSkjerm variant={'warning'} size={'small'}>
                        Egen ansatt
                    </TagLitenSkjerm>
                    <TagStorSkjerm variant={'warning'} size={'small'}>
                        E..
                    </TagStorSkjerm>
                </>
            )}
            {fullmakt.some(
                (f) => f.gyldigTilOgMed === null || erEtterDagensDato(f.gyldigTilOgMed)
            ) && (
                <>
                    <TagStorSkjerm variant={'warning'} size={'small'}>
                        Fullmakt
                    </TagStorSkjerm>
                    <TagLitenSkjerm variant={'warning'} size={'small'}>
                        F..
                    </TagLitenSkjerm>
                </>
            )}
            {vergemål.length > 0 && (
                <>
                    <TagStorSkjerm variant={'warning'} size={'small'}>
                        Verge
                    </TagStorSkjerm>
                    <TagLitenSkjerm variant={'warning'} size={'small'}>
                        V..
                    </TagLitenSkjerm>
                </>
            )}
            {migrert && (
                <>
                    <TagStorSkjerm variant={'warning'} size={'small'}>
                        Migrert
                    </TagStorSkjerm>
                    <TagLitenSkjerm variant={'warning'} size={'small'}>
                        M..
                    </TagLitenSkjerm>
                </>
            )}
        </Container>
    );
};

export default PersonTags;
