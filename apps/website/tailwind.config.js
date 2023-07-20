/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                theme: {
                    d1: "#0A1023",
                    d2: "#0C142C",
                    d3: "#0E1835",
                    d4: "#121c3e",
                    l1: "#EEEFFE",
                    l2: "#faecf6",
                    l3: "#f8e4f3",
                },
                discord: {
                    blurple: "#5865F2",
                    green: "#57F287",
                    yellow: "#FEE75C",
                    fuchsia: "#EB459E",
                    red: "#ED4245",
                    "header-secondary": "#b9bbbe",
                    embed: "#2f3136",
                },
            },
        },
    },
    mode: 'jit',
    plugins: [],
};
