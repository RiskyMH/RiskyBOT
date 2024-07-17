import pc from "picocolors";

/** seems to follow supports hyperlink well... */
export const supportsHyperlinks = pc.isColorSupported && !process.env.CI;
const isKonsole = !!process.env.KONSOLE_VERSION;

// from https://github.com/yarnpkg/berry/blob/db6210f48355d2986e965f90009b22f18d3b6342/packages/yarnpkg-core/sources/formatUtils.ts#L382-L398
export function applyHyperlink(text: string, href: string) {
    // Only print hyperlinks if allowed per configuration
    if (!supportsHyperlinks) return text;

    // We use ESC as ST for Konsole because it doesn't support
    // the non-standard BEL character for hyperlinks
    if (isKonsole)
        return `\u001B]8;;${href}\u001B\\${text}\u001B]8;;\u001B\\`;

    // We use BELL as ST because it seems that iTerm doesn't properly support
    // the \x1b\\ sequence described in the reference document
    // https://gist.github.com/egmontkob/eb114294efbcd5adb1944c9f3cb5feda#the-escape-sequence
    return `\u001B]8;;${href}\u0007${text}\u001B]8;;\u0007`;
}