
export function ms(string: string): number {
    const match = string.match(/(?:(?<days>\d+)d)?(?:(?<hours>\d+)h)?(?:(?<minutes>\d+)m)?(?:(?<seconds>\d+)s)?/);
if (!match) throw new Error("Invalid time string");
    const { days = "0", hours = "0", minutes = "0", seconds = "0" } = match.groups || {};
    return (Number.parseInt(days) * 24 * 60 * 60 * 1000) +
        (Number.parseInt(hours) * 60 * 60 * 1000) +
        (Number.parseInt(minutes) * 60 * 1000) +
        (Number.parseInt(seconds) * 1000);
}