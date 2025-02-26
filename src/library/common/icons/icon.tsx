import React from 'react';
import { icons, IconKeys } from './list';

export const Icon = (props: {
    name: IconKeys;
    size?: number;
    color?: string;
    className?: string;
    ref?: React.Ref<SVGSVGElement>;
    onClick?: () => void;
}) => {
    const Icon = icons[props.name] as any;
    if (!Icon) return null;
    return (
        <Icon
            size={props.size}
            color={props.color}
            className={props.className}
            aria-hidden={true}
            ref={props.ref}
            onClick={props.onClick}
        />
    );
};
