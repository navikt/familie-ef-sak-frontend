export const kortNedBeskrivelse = (beskrivelse?: string) => {
    if (!beskrivelse) {
        return '';
    }

    const beskrivelseUtenStartMetadata = beskrivelse.startsWith('---')
        ? beskrivelse.slice(beskrivelse.indexOf('---', 3) + 3).trim()
        : beskrivelse;

    const klippBortIndeks = beskrivelseUtenStartMetadata.indexOf('---');
    if (klippBortIndeks !== -1 && klippBortIndeks <= 75) {
        return beskrivelseUtenStartMetadata.slice(0, klippBortIndeks).trim();
    } else if (beskrivelseUtenStartMetadata.length > 75) {
        return beskrivelseUtenStartMetadata.slice(0, 75).trim() + '...';
    }

    return beskrivelseUtenStartMetadata;
};
