import rootPackageJSON from "../package.json";

export function globWorkspaces() {
    // read root package.json to get paths

    const workspacesGlob = rootPackageJSON.workspaces;
    const workspaces = new Set<string>();
    for (const glob of workspacesGlob) {
        // if it has a wildcard, glob it
        if (glob.includes("*")) {
            const globbed = new Bun.Glob(glob).scanSync({ onlyFiles: false });
            for (const g of globbed) {
                workspaces.add("./" + g);
            }
        } else {
            workspaces.add("./" + glob);
        }

    }
    return workspaces;
}

export const workspaces = globWorkspaces();


export default workspaces;