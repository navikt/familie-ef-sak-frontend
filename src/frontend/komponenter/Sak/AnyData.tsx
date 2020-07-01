import * as React from 'react';
import styled from 'styled-components';

export interface IProps {
    data?: unknown;
}

const Inline = styled.div`
    padding-left: 10px;
`;

const AnyData: React.FC<IProps> = ({ data }) => {
    function getData(obj: any) {
        return Object.keys(obj).map(key => {
            const value = obj[key];
            if (!value) {
                return null;
            } else if (Array.isArray(value)) {
                return (
                    <Inline>
                        <div>{key}</div>
                        {Array.from(value).map((val, i) => (
                            <Inline>
                                <div>
                                    {key} - {i}
                                </div>
                                <div>{getData(val)}</div>
                            </Inline>
                        ))}
                    </Inline>
                );
            } else if (typeof value === 'object') {
                return (
                    <Inline>
                        <div>{key}</div>
                        <div>{getData(value)}</div>
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

    return <div>{getData(data)}</div>;
};

export default AnyData;
