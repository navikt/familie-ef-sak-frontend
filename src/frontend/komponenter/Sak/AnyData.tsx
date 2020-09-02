import * as React from 'react';
import styled from 'styled-components';

export interface IProps {
    data?: unknown;
}

const Inline = styled.div`
    padding-left: 15px;
`;

const Key = styled.div`
    font-weight: bold;
`;

const keyStyles = {
    0: { fontSize: '20px', color: 'red' },
    1: { fontSize: '16px', color: 'blue' },
};

const AnyData: React.FC<IProps> = ({ data }) => {
    function formatKey(key: string, index = 999) {
        // @ts-ignore
        return <Key style={keyStyles[index]}>{key}</Key>;
    }
    // eslint-disable-next-line
    function getData(obj: any, index = 0) {
        return Object.keys(obj).map((key) => {
            const value = obj[key];
            if (!value) {
                return null;
            } else if (Array.isArray(value)) {
                const values = Array.from(value);
                return (
                    <Inline>
                        {formatKey(key, index)}
                        {values.map((val, i) => {
                            if (typeof val !== 'object') {
                                return <Inline>{val}</Inline>;
                            } else {
                                return (
                                    <Inline>
                                        {formatKey(`${key} - ${i}`)}
                                        <div>{getData(val, index + 1)}</div>
                                    </Inline>
                                );
                            }
                        })}
                    </Inline>
                );
            } else if (typeof value === 'object') {
                return (
                    <Inline>
                        {formatKey(key, index)}
                        <div>{getData(value, index + 1)}</div>
                    </Inline>
                );
            } else {
                return (
                    <Inline>
                        {key}: {value}
                    </Inline>
                );
            }
        });
    }

    return <div>{data ? getData(data) : 'Ingen data'}</div>;
};

export default AnyData;
