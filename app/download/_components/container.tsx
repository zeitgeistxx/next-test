import Client from "./client";
import Server from "./server";

export default function Container() {
    return (
        <div>
            <p>This is common component</p>
            <Client>
                <Server />
            </Client>
        </div>
    )
}
