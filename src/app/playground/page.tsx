"use client";

import { Dices } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Color } from "saturon";
import { colorModels } from "saturon/converters";
import { fitMethods } from "saturon/math";
import { FitMethod, FormattingOptions } from "saturon/types";
import { useTheme } from "next-themes";
import { configure } from "saturon/utils";

function ColorPreview({ input, options }: { input: string; options: FormattingOptions }) {
    const [displayColor, setDisplayColor] = useState<string | null>(null);
    const [usedSpace, setUsedSpace] = useState<string>("");

    useEffect(() => {
        try {
            const color = Color.from(input);
            let space = "";
            let converted = "";

            if (CSS.supports("color(rec2020 1 0 0)")) {
                space = "rec2020";
                converted = color.to(space, options);
            } else if (CSS.supports("color(display-p3 1 0 0)")) {
                space = "display-p3";
                converted = color.to(space, options);
            } else if (CSS.supports("color(srgb 1 0 0)")) {
                space = "srgb";
                converted = color.to(space, options);
            } else {
                space = "rgb";
                converted = color.to(space, options);
            }

            setDisplayColor(converted);
            setUsedSpace(space);
        } catch {
            setDisplayColor(null);
            setUsedSpace("");
        }
    }, [input, options]);

    if (!displayColor) return null;

    return (
        <section aria-label="Color comparison preview" className="grid grid-cols-2 gap-4">
            {/* Device-rendered input preview */}
            <div className="flex flex-col items-center gap-2">
                <div
                    className="relative h-12 w-full overflow-hidden rounded-xl border shadow-sm"
                    aria-label="Device-rendered color input"
                    role="img"
                    style={{
                        backgroundImage:
                            "linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)",
                        backgroundSize: "16px 16px",
                        backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
                    }}
                >
                    <div aria-hidden="true" className="absolute inset-0" style={{ background: input }} />
                </div>
                <span className="text-center text-sm">Device-rendered input</span>
            </div>

            {/* Saturon-rendered conversion */}
            <div className="flex flex-col items-center gap-2">
                <div
                    className="relative h-12 w-full overflow-hidden rounded-xl border shadow-sm"
                    role="img"
                    aria-label={`Color rendered in ${usedSpace} space`}
                    style={{
                        backgroundImage:
                            "linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)",
                        backgroundSize: "16px 16px",
                        backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
                    }}
                >
                    <div aria-hidden="true" className="absolute inset-0" style={{ background: displayColor }} />
                </div>
                <span className="text-center text-sm font-medium">Saturon-converted ({usedSpace})</span>
            </div>
        </section>
    );
}

export default function Playground() {
    const [input, setInput] = useState("red");
    const [error, setError] = useState<string | null>(null);
    const [outputType, setOutputType] = useState<"string" | "object" | "array">("string");
    const [fit, setFit] = useState<FitMethod>("none");
    const [precision, setPrecision] = useState<number | undefined>(undefined);
    const [legacy, setLegacy] = useState(false);
    const [units, setUnits] = useState(true);
    const { theme, systemTheme } = useTheme();

    const currentTheme = theme === "system" ? systemTheme : theme;
    if (currentTheme) configure({ theme: currentTheme as "light" | "dark" });

    const availableTypes = useMemo(() => Object.keys(colorModels), []);
    const fitOptions = useMemo(() => ["none", "clip", ...Object.keys(fitMethods)], []);

    const results = useMemo(() => {
        try {
            const color = Color.from(input);
            const colorModel = color.model;
            setError(null);

            return availableTypes.map((type) => {
                let value: string | Record<string, number> | number[];
                const baseOptions = { fit, precision };

                try {
                    const conversion = color.in(type);

                    if (outputType === "object") {
                        value = conversion.toObject(baseOptions);
                    } else if (outputType === "array") {
                        value = conversion.toArray(baseOptions);
                    } else {
                        value = conversion.toString({
                            ...baseOptions,
                            legacy,
                            units,
                        });
                    }
                } catch {
                    value = "⚠️ Conversion not supported";
                }
                return { type, value, isMatch: type === colorModel };
            });
        } catch (e) {
            setError((e as Error).message || "Invalid color input");
            return [];
        }
    }, [input, outputType, fit, precision, legacy, units, systemTheme, theme]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <main className="prose max-w-fd-container mx-auto w-full p-6" id="main-content">
            {/* Skip link for keyboard users */}
            <a
                href="#main-content"
                className="sr-only z-50 rounded-md bg-white px-4 py-2 text-black focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
            >
                Skip to main content
            </a>

            <h1 tabIndex={-1}>Playground</h1>

            <div className="block w-full grid-cols-1 gap-8 sm:grid lg:grid-cols-3">
                {/* === INPUT SECTION === */}
                <section aria-labelledby="input-section" className="col-span-1 w-full space-y-6">
                    <h2 id="input-section" className="sr-only">
                        Input configuration
                    </h2>

                    <form
                        aria-describedby="color-input-help"
                        onSubmit={(e) => e.preventDefault()}
                        className="space-y-4"
                    >
                        {/* Input field */}
                        <div>
                            <label htmlFor="color-input" className="block font-medium">
                                Type or generate a CSS-valid color string:
                            </label>
                            <div className="flex gap-2">
                                <input
                                    id="color-input"
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="e.g. #ff00ff, red, rgb(255, 100, 0)"
                                    className="focus:ring-fd-primary w-full rounded-md border p-2 font-mono focus:ring-2 focus:outline-none"
                                    aria-describedby="color-input-help"
                                />
                                <button
                                    type="button"
                                    title="Generate random color"
                                    aria-label="Generate random color"
                                    className="hover:bg-fd-muted focus:ring-fd-primary rounded-md px-2 transition-colors duration-200 ease-in-out focus:ring-2 focus:outline-none"
                                    onClick={() =>
                                        setInput(
                                            Color.random({ limits: { alpha: [1, 1] } })
                                                .toString({
                                                    fit,
                                                    precision,
                                                    units,
                                                    legacy,
                                                })
                                                .replace("deg", "")
                                        )
                                    }
                                >
                                    <Dices aria-hidden="true" />
                                </button>
                            </div>
                        </div>

                        {/* Output format */}
                        <div>
                            <label htmlFor="output-type" className="block font-medium">
                                Output format:
                            </label>
                            <select
                                id="output-type"
                                value={outputType}
                                onChange={(e) => setOutputType(e.target.value as "string" | "object" | "array")}
                                className="focus:ring-fd-primary w-full rounded-md border p-2 font-mono focus:ring-2"
                            >
                                <option value="string">String</option>
                                <option value="object">Object</option>
                                <option value="array">Array</option>
                            </select>
                        </div>

                        {/* Fit method */}
                        <div>
                            <label htmlFor="fit-method" className="block font-medium">
                                Gamut mapping (fit method):
                            </label>
                            <select
                                id="fit-method"
                                value={fit}
                                onChange={(e) => setFit(e.target.value as FitMethod)}
                                className="focus:ring-fd-primary w-full rounded-md border p-2 font-mono focus:ring-2"
                            >
                                {fitOptions.map((method) => (
                                    <option key={method} value={method}>
                                        {method}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Precision */}
                        <div>
                            <label htmlFor="precision" className="block font-medium">
                                Value precision:
                            </label>
                            <input
                                id="precision"
                                type="number"
                                value={precision !== undefined ? precision : ""}
                                onChange={(e) =>
                                    setPrecision(e.target.value ? parseInt(e.target.value, 10) : undefined)
                                }
                                placeholder="e.g. 2 (leave empty for auto)"
                                className="focus:ring-fd-primary w-full rounded-md border p-2 font-mono focus:ring-2"
                            />
                        </div>

                        {/* Options for string output */}
                        {outputType === "string" && (
                            <fieldset className="space-y-2">
                                <legend className="font-semibold">String options</legend>
                                <div className="flex items-center gap-2">
                                    <input
                                        id="legacy"
                                        type="checkbox"
                                        checked={legacy}
                                        onChange={(e) => setLegacy(e.target.checked)}
                                    />
                                    <label htmlFor="legacy">Legacy syntax (use older color format)</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        id="units"
                                        type="checkbox"
                                        checked={units}
                                        onChange={(e) => setUnits(e.target.checked)}
                                    />
                                    <label htmlFor="units">Include unit suffixes (like % or deg)</label>
                                </div>
                            </fieldset>
                        )}
                    </form>

                    {!error && <ColorPreview input={input} options={{ fit }} />}
                </section>

                {/* === OUTPUT SECTION === */}
                <section aria-labelledby="output-section" className="col-span-2">
                    <h2 id="output-section" className="text-xl font-semibold">
                        Converted Values
                    </h2>

                    {error ? (
                        <div role="alert" aria-live="assertive" className="text-fd-error mt-4 font-mono font-medium">
                            {error}
                        </div>
                    ) : (
                        <div aria-live="polite">
                            {/* String output */}
                            {outputType === "string" && (
                                <div className="overflow-x-auto">
                                    <table className="w-full table-fixed font-mono text-sm" role="table">
                                        <caption className="sr-only">Converted color values as strings</caption>
                                        <thead>
                                            <tr>
                                                <th scope="col" className="w-1/4 text-left">
                                                    Type
                                                </th>
                                                <th scope="col" className="w-3/4 text-left">
                                                    Value
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.map(({ type, value, isMatch }) => (
                                                <tr key={type} className={isMatch ? "bg-fd-primary/10" : ""}>
                                                    <th scope="row">{type}</th>
                                                    <td className="break-all">{String(value)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Array output */}
                            {outputType === "array" && (
                                <div className="overflow-x-auto">
                                    <table className="w-full table-fixed font-mono text-sm">
                                        <caption className="sr-only">Converted color values as numeric arrays</caption>
                                        <thead>
                                            <tr>
                                                <th>Type</th>
                                                <th>C1</th>
                                                <th>C2</th>
                                                <th>C3</th>
                                                <th>Alpha</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.map(({ type, value, isMatch }) => {
                                                const arr = Array.isArray(value) ? value : [];
                                                return (
                                                    <tr key={type} className={isMatch ? "bg-fd-primary/10" : ""}>
                                                        <th scope="row">{type}</th>
                                                        {Array.from({ length: 4 }).map((_, i) => (
                                                            <td key={i}>{arr[i] ?? "—"}</td>
                                                        ))}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Object output */}
                            {outputType === "object" && (
                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                    {results.map(({ type, value, isMatch }) => (
                                        <article
                                            key={type}
                                            className={`border-fd-border flex flex-col gap-2 rounded-lg border p-4 shadow-sm ${
                                                isMatch ? "bg-fd-primary/10" : ""
                                            }`}
                                            aria-label={`Color model ${type}`}
                                        >
                                            <h3>{type}</h3>
                                            {typeof value === "object" && !Array.isArray(value) ? (
                                                <table className="w-full font-mono text-sm">
                                                    <thead>
                                                        <tr>
                                                            <th>Key</th>
                                                            <th>Value</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Object.entries(value).map(([key, val]) => (
                                                            <tr key={key}>
                                                                <th scope="row">{key}</th>
                                                                <td>{String(val)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <div role="note">⚠️ Invalid object data</div>
                                            )}
                                        </article>
                                    ))}
                                </div>
                            )}

                            <small className="text-fd-muted-foreground mt-4 flex items-center gap-2" aria-live="polite">
                                <span
                                    aria-hidden="true"
                                    className="bg-fd-primary border-fd-border h-4 w-4 border-2"
                                ></span>
                                {`Input model ${results.find((r) => r.isMatch)?.type || "unknown"} highlighted`}
                            </small>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
