import type { ComponentProps } from "react";

export default function FaBars(props?: ComponentProps<"svg">) {
    return (
        <svg {...props} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bars" className={"svg-inline--fa fa-bars " + (props?.className ?? "")} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path fill="currentColor" d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
        </svg>
    );
}
