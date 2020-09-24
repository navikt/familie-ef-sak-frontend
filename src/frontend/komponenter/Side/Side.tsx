import React from 'react';
import cls from 'classnames';
import './page.less';

interface SideProps {
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
}

const Side: React.FC<SideProps> = (props: SideProps) => {
    return (
        <div className={cls('page', props.className)}>
            <div className={cls('page__content', props.contentClassName)}>{props.children}</div>
        </div>
    );
};

export default Side;
