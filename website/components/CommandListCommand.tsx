import { useCallback, useEffect, useRef } from "react";
import Logo from "./Logo";
import Link from "next/link";


export default function CommandListCommand({ name, description, options, bot = "riskybot" }) {
    const collapseElement = useRef(null);

    const collapseCommand = useCallback(() => {
        history.pushState({}, "", `#${name.replaceAll(" ", "-")}`);
        const elem = collapseElement.current;
        if (elem.clientHeight) {
            elem.style.height = 0;
        } else {
            elem.style.height = elem.scrollHeight + "px";
        }
    }, [name]);

    useEffect(() => {
        if (window.location.hash.slice(1) === name.replaceAll(" ", "-")) collapseCommand();
    }, [name, collapseCommand]);

    return (
        <div className="scroll-m-24" id={name.replaceAll(" ", "-")}>
            <div className="mt-4 overflow-hidden rounded-md">
                <div
                    className="flex cursor-pointer flex-col items-center bg-discord-blurple/30 p-4 text-center md:flex-row md:text-left"
                    onClick={collapseCommand}>
                    <div className="flex items-center">
                            {
                                bot === "imgen" ? (
                                    <div className="p-1 m-[-0.75rem] ml-[-0.5rem] mr-0 md:mr-2 self-start absolute left-7 md:self-auto md:relative md:left-0 hover:md:bg-white/10 rounded-full md:inline pointer-events-none md:pointer-events-auto" title="Uses Imgen bot, click to learn more"> 
                                        <Link href="/other-bots#bot2"> 
                                            <a>
                                                <div className="h-7 w-7">
                                                    <Logo variation="imgen"/> 
                                                </div>
                                            </a>
                                        </Link>
                                    </div>
                                ) : null
                            }
                        <h2 className="text-lg font-semibold">{"/"+name}</h2>
                    </div>
                    <p className="ml-2">
                        <span className="hidden md:inline">- </span>
                        {description}
                    </p>
                </div>
                <div
                    className="h-0 overflow-hidden bg-discord-blurple/20 transition-[height] duration-300"
                    ref={collapseElement}>
                    <div className="border-t-2 border-discord-blurple p-4 pt-2">
                        <div>
                            <h3 className="font-semibold">Options:</h3>
                        </div>
                        <div>
                            {options.length
                                ? options.map((opt, index) => (
                                    <p key={index} className="ml-4">
                                        <span className="font-medium">
                                            {opt.name}
                                            {!opt.required && "?"}
                                        </span>{" "}
                                        - {opt.description}
                                    </p>
                                ))
                                : "No Options"}
                        </div>
                        <div className="mt-2 hidden text-sm font-normal text-gray-200 md:flex">
                            options ending in &quot;?&quot; are optional.
                        </div>
                        {
                            bot === "imgen" ? (
                                <div className="mt-2 hidden text-sm font-normal text-gray-200 md:flex">
                                    this bot is a special bot for image generation. Click <Link href="/other-bots#imgen"><a className="text-blue-500 hover:text-blue-600 pl-1 pr-1">here</a></Link> to learn more.
                                </div>
                            ) : null
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}