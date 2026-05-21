import { useState } from "react";
import {
  Thermometer,
  Scale,
  Ruler,
  Copy,
  Check,
  ArrowRightLeft,
  ChevronDown
} from "lucide-react";

// Define the available categories as a TypeScript Union type
type Category = "Temperature" | "Weight" | "Length";

// Interface representing the configurations available for each conversion category
interface CategoryConfig {
  icon: React.ComponentType<any>;
  units: string[];
  defaultLeft: string;
  defaultRight: string;
}

// Configuration details for Temperature, Weight, and Length
const CATEGORIES: Record<Category, CategoryConfig> = {
  Temperature: {
    icon: Thermometer,
    units: ["Celsius", "Fahrenheit", "Kelvin"],
    defaultLeft: "Celsius",
    defaultRight: "Fahrenheit",
  },
  Weight: {
    icon: Scale,
    units: ["Kilograms", "Pounds", "Ounces"],
    defaultLeft: "Kilograms",
    defaultRight: "Pounds",
  },
  Length: {
    icon: Ruler,
    units: ["Meters", "Feet", "Inches", "Kilometers"],
    defaultLeft: "Meters",
    defaultRight: "Feet",
  },
};

// Handles the core conversion math across categories (Temperature, Weight, Length).
const convert = (value: number, from: string, to: string, category: Category): number => {
  if (from === to) return value;

  // 1. Temperature Category (Celsius <-> Fahrenheit <-> Kelvin)
  if (category === "Temperature") {
    // Normalise everything to Celsius first
    let celsius = value;
    if (from === "Fahrenheit") {
      celsius = (value - 32) * 5 / 9;
    } else if (from === "Kelvin") {
      celsius = value - 273.15;
    }

    // Convert from Celsius to the target unit
    if (to === "Celsius") {
      return celsius;
    } else if (to === "Fahrenheit") {
      return (celsius * 9 / 5) + 32;
    } else if (to === "Kelvin") {
      return celsius + 273.15;
    }
  }

  // 2. Weight Category (Kilograms <-> Pounds <-> Ounces)
  // Direct ratio scaling via a base unit (Kilograms)
  if (category === "Weight") {
    const factors: Record<string, number> = {
      Kilograms: 1.0,
      Pounds: 0.45359237,        // 1 Pound = 0.45359237 Kilograms
      Ounces: 0.028349523125,    // 1 Ounce = 0.028349523125 Kilograms
    };
    const valueInKg = value * factors[from];
    return valueInKg / factors[to];
  }

  // 3. Length Category (Meters <-> Feet <-> Inches <-> Kilometers)
  // Direct ratio scaling via a base unit (Meters)
  if (category === "Length") {
    const factors: Record<string, number> = {
      Meters: 1.0,
      Feet: 0.3048,              // 1 Foot = 0.3048 Meters
      Inches: 0.0254,            // 1 Inch = 0.0254 Meters
      Kilometers: 1000.0,        // 1 Kilometer = 1000 Meters
    };
    const valueInMeters = value * factors[from];
    return valueInMeters / factors[to];
  }

  return value;
};

// Checks if input is a valid number (not empty or just a minus/dot)
const isValidInput = (val: string): boolean => {
  return val !== "" && val !== "-" && val !== "." && val !== "-.";
};

// Formats number to max 6 decimals and removes trailing zeros
const formatNumber = (num: number): string => {
  if (isNaN(num)) return "";
  if (Number.isInteger(num)) return num.toString();
  // Round to 6 decimal places
  const rounded = parseFloat(num.toFixed(6));
  return rounded.toString();
};

export default function App() {
  // State definitions
  const [category, setCategory] = useState<Category>("Temperature");

  // Selected units
  const [leftUnit, setLeftUnit] = useState<string>("Celsius");
  const [rightUnit, setRightUnit] = useState<string>("Fahrenheit");

  // Input values (keeping strings to handle incomplete typing like "-" or ".")
  const [leftValue, setLeftValue] = useState<string>("1");
  const [rightValue, setRightValue] = useState<string>("33.8");

  // Tracks which side the user is currently editing
  const [activeSide, setActiveSide] = useState<"left" | "right">("left");

  // Temporary state to show a checkmark when copied
  const [copiedSide, setCopiedSide] = useState<"left" | "right" | null>(null);


  // Handles typing in either input and converts to the other side
  const handleInputChange = (val: string, side: "left" | "right") => {
    setActiveSide(side);

    if (side === "left") {
      setLeftValue(val);

      // Clear counterpart if typing intermediate values
      if (!isValidInput(val)) {
        setRightValue("");
        return;
      }

      const parsed = parseFloat(val);
      if (!isNaN(parsed)) {
        const converted = convert(parsed, leftUnit, rightUnit, category);
        setRightValue(formatNumber(converted));
      } else {
        setRightValue("");
      }
    } else {
      setRightValue(val);

      // Clear counterpart if typing intermediate values
      if (!isValidInput(val)) {
        setLeftValue("");
        return;
      }

      const parsed = parseFloat(val);
      if (!isNaN(parsed)) {
        const converted = convert(parsed, rightUnit, leftUnit, category);
        setLeftValue(formatNumber(converted));
      } else {
        setLeftValue("");
      }
    }
  };

  // Recalculates when left unit dropdown changes
  const handleLeftUnitChange = (newUnit: string) => {
    setLeftUnit(newUnit);

    if (activeSide === "left") {
      if (!isValidInput(leftValue)) {
        setRightValue("");
        return;
      }

      const parsed = parseFloat(leftValue);
      if (!isNaN(parsed)) {
        const converted = convert(parsed, newUnit, rightUnit, category);
        setRightValue(formatNumber(converted));
      }
    } else {
      if (!isValidInput(rightValue)) {
        setLeftValue("");
        return;
      }

      const parsed = parseFloat(rightValue);
      if (!isNaN(parsed)) {
        const converted = convert(parsed, rightUnit, newUnit, category);
        setLeftValue(formatNumber(converted));
      }
    }
  };

  // Recalculates when right unit dropdown changes
  const handleRightUnitChange = (newUnit: string) => {
    setRightUnit(newUnit);

    if (activeSide === "left") {
      if (!isValidInput(leftValue)) {
        setRightValue("");
        return;
      }

      const parsed = parseFloat(leftValue);
      if (!isNaN(parsed)) {
        const converted = convert(parsed, leftUnit, newUnit, category);
        setRightValue(formatNumber(converted));
      }
    } else {
      if (!isValidInput(rightValue)) {
        setLeftValue("");
        return;
      }

      const parsed = parseFloat(rightValue);
      if (!isNaN(parsed)) {
        const converted = convert(parsed, newUnit, leftUnit, category);
        setLeftValue(formatNumber(converted));
      }
    }
  };

  // Switch category and reset defaults
  const handleCategoryChange = (newCat: Category) => {
    setCategory(newCat);
    const config = CATEGORIES[newCat];

    setLeftUnit(config.defaultLeft);
    setRightUnit(config.defaultRight);

    setLeftValue("1");
    setActiveSide("left");

    const converted = convert(1, config.defaultLeft, config.defaultRight, newCat);
    setRightValue(formatNumber(converted));
  };

  // Swap values and active sides
  const handleSwap = () => {
    setLeftUnit(rightUnit);
    setRightUnit(leftUnit);
    setLeftValue(rightValue);
    setRightValue(leftValue);
    setActiveSide(activeSide === "left" ? "right" : "left");
  };

  // Copy value to clipboard with checkmark feedback
  const copyToClipboard = async (textToCopy: string, side: "left" | "right") => {
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedSide(side);
      setTimeout(() => setCopiedSide(null), 2000);
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  };

  const activeConfig = CATEGORIES[category];

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <main className="main-card">
          <div className="text-center mb-10">
            <h1 className="header-title">Live Unit Converter</h1>
          </div>

          {/* Category selectors */}
          <div className="category-tabs" role="tablist" aria-label="Conversion categories">
            {(Object.keys(CATEGORIES) as Category[]).map((cat) => {
              const Icon = CATEGORIES[cat].icon;
              const isActive = category === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  id={`tab-${cat.toLowerCase()}`}
                  aria-selected={isActive}
                  onClick={() => handleCategoryChange(cat)}
                  className={`category-tab-btn ${isActive ? "category-tab-btn-active" : "category-tab-btn-inactive"}`}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? "scale-110" : ""}`} />
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Twin layout panels */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            {/* Left side input */}
            <div className="lg:col-span-5">
              <div className="panel-card">
                <div className="flex justify-between items-center">
                  <label className="section-label !mb-0" htmlFor="left-input">Input Panel</label>
                  <span className="text-zinc-400 font-mono bg-zinc-900 px-2 py-0.5 rounded text-xs font-semibold">
                    From
                  </span>
                </div>

                {/* Value input and copy button */}
                <div className="relative">
                  <input
                    id="left-input"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.0"
                    value={leftValue}
                    onChange={(e) => handleInputChange(e.target.value, "left")}
                    className="input-base pr-12"
                  />
                  <button
                    id="left-copy-btn"
                    onClick={() => copyToClipboard(leftValue, "left")}
                    disabled={!leftValue}
                    className="copy-btn group"
                    title="Copy input value"
                  >
                    {copiedSide === "left" ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                    )}
                  </button>
                </div>

                {/* Dropdown unit select */}
                <div className="relative">
                  <select
                    id="left-unit-select"
                    value={leftUnit}
                    onChange={(e) => handleLeftUnitChange(e.target.value)}
                    className="unit-select"
                  >
                    {activeConfig.units.map((unit) => (
                      <option key={unit} value={unit} className="bg-zinc-900 text-zinc-200">
                        {unit}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Swap values and units */}
            <div className="lg:col-span-2 swap-icon-container">
              <button
                id="swap-units-btn"
                onClick={handleSwap}
                className="swap-btn"
                title="Swap units & values"
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Right side output */}
            <div className="lg:col-span-5">
              <div className="panel-card">
                <div className="flex justify-between items-center">
                  <label className="section-label !mb-0" htmlFor="right-input">Output Panel</label>
                  <span className="text-zinc-400 font-mono bg-zinc-900 px-2 py-0.5 rounded text-xs font-semibold">
                    To
                  </span>
                </div>

                {/* Value input and copy button */}
                <div className="relative">
                  <input
                    id="right-input"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.0"
                    value={rightValue}
                    onChange={(e) => handleInputChange(e.target.value, "right")}
                    className="input-base pr-12"
                  />
                  <button
                    id="right-copy-btn"
                    onClick={() => copyToClipboard(rightValue, "right")}
                    disabled={!rightValue}
                    className="copy-btn group"
                    title="Copy output value"
                  >
                    {copiedSide === "right" ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                    )}
                  </button>
                </div>

                {/* Dropdown unit select */}
                <div className="relative">
                  <select
                    id="right-unit-select"
                    value={rightUnit}
                    onChange={(e) => handleRightUnitChange(e.target.value)}
                    className="unit-select"
                  >
                    {activeConfig.units.map((unit) => (
                      <option key={unit} value={unit} className="bg-zinc-900 text-zinc-200">
                        {unit}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
