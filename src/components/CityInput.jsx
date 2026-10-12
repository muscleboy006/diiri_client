import { useMemo, useState } from "react";
import { searchCities } from "../constants/cities";
import "./CityInput.css";

/**
 * Поле выбора города с подсказками.
 * Можно выбрать из списка или вписать ЛЮБОЙ город мира вручную.
 *
 * <CityInput value={from} onChange={setFrom} placeholder="Qayerdan" />
 */
export default function CityInput({ value, onChange, placeholder = "Shahar", maxLength = 60 }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const results = useMemo(() => searchCities(value, 8), [value]);
  const showList = open && results.length > 0;

  const pick = (city) => {
    onChange(city);
    setOpen(false);
    setActive(-1);
  };

  const onKeyDown = (e) => {
    if (!showList) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      pick(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="city-input">
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
      />

      {showList && (
        <ul className="city-list" role="listbox">
          {results.map((c, i) => (
            <li
              key={c}
              role="option"
              aria-selected={i === active}
              className={i === active ? "active" : ""}
              // mousedown не даёт полю потерять фокус раньше клика
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(c)}
            >
              {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}