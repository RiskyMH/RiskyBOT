/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace JSX {
    interface ElementChildrenAttribute {
        children: Record<string, unknown>;
    }
}

export const jsxs = jsx;
export const jsxDEV = jsx;

export function jsx<T extends Component>(component: Component, props: { children?: Component[], [x: string]: any }): T {
    // remove undefined entries in children
    if (Array.isArray(props.children)) {
        props.children = props.children.filter((child) => !!child);
    }
    return component(props);
}

type Component = (props: unknown) => any;

export function Fragment<T extends Component[]>(props: { children: T }): T {
    return props.children;
}
