import {PropsWithChildren} from "react";

export function Main(props: PropsWithChildren) {
    const {children} = props;
    return (
        <main>
            {children}
        </main>
    )
}