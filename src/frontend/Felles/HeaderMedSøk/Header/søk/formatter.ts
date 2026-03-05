export const erPersonId = (personIdent: string) => {
    const id = personIdent.split(' ').join('');
    return /^[+-]?\d+(\.\d+)?$/.test(id) && id.length === 11;
};

export const formaterPersonIdent = (personIdent: string) => {
    return erPersonId(personIdent)
        ? `${personIdent.slice(0, 6)} ${personIdent.slice(6, personIdent.length)}`
        : `${personIdent.slice(0, 3)} ${personIdent.slice(3, 6)} ${personIdent.slice(6, 9)}`;
};
