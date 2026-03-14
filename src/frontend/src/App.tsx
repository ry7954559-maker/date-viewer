import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const HINDI_MONTHS = [
  "जनवरी",
  "फ़रवरी",
  "मार्च",
  "अप्रैल",
  "मई",
  "जून",
  "जुलाई",
  "अगस्त",
  "सितंबर",
  "अक्टूबर",
  "नवंबर",
  "दिसंबर",
];

const HINDI_DAYS = [
  "रविवार",
  "सोमवार",
  "मंगलवार",
  "बुधवार",
  "गुरुवार",
  "शुक्रवार",
  "शनिवार",
];
const HINDI_DAYS_SHORT = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];

const EN_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const EN_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const EN_DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

// Decorative mandala SVG ring
function MandalaRing({
  size,
  className,
}: { size: number; className?: string }) {
  const petals = 12;
  const r = size / 2;
  const petalPoints = Array.from({ length: petals }, (_, i) => {
    const angle = (i * 360) / petals;
    const rad = (angle * Math.PI) / 180;
    const x = r + Math.cos(rad) * (r * 0.72);
    const y = r + Math.sin(rad) * (r * 0.72);
    return { x, y, angle };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-hidden="true"
    >
      {/* Outer dotted ring */}
      <circle
        cx={r}
        cy={r}
        r={r * 0.92}
        fill="none"
        stroke="oklch(0.78 0.18 65 / 0.25)"
        strokeWidth="1"
        strokeDasharray="4 6"
      />
      {/* Inner ring */}
      <circle
        cx={r}
        cy={r}
        r={r * 0.62}
        fill="none"
        stroke="oklch(0.78 0.18 65 / 0.18)"
        strokeWidth="1"
      />
      {/* Petal diamonds — keyed by angle which is unique */}
      {petalPoints.map((p) => (
        <g
          key={`petal-${p.angle}`}
          transform={`rotate(${p.angle}, ${r}, ${r})`}
        >
          <ellipse
            cx={r}
            cy={r * 0.3}
            rx={r * 0.045}
            ry={r * 0.13}
            fill="oklch(0.78 0.18 65 / 0.22)"
          />
        </g>
      ))}
      {/* Center dot ring — keyed by angle */}
      {petalPoints.map((p) => (
        <circle
          key={`dot-${p.angle}`}
          cx={p.x}
          cy={p.y}
          r={r * 0.025}
          fill="oklch(0.78 0.18 65 / 0.35)"
        />
      ))}
    </svg>
  );
}

export default function App() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();
  const day = now.getDay();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const isAM = hours < 12;

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Build calendar grid (6 rows × 7 cols)
  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  const currentYear = new Date().getFullYear();

  return (
    <div className="grain min-h-screen bg-background flex flex-col">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% -10%, oklch(0.78 0.18 65 / 0.12) 0%, transparent 70%), " +
            "radial-gradient(ellipse 40% 35% at 80% 80%, oklch(0.60 0.18 35 / 0.08) 0%, transparent 60%)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 px-6 pt-8 pb-4 flex items-center justify-between max-w-2xl mx-auto w-full">
        <div>
          <h1 className="font-display text-primary text-lg font-bold tracking-wide">
            कैलेंडर
          </h1>
          <p className="text-muted-foreground text-xs font-body mt-0.5">
            Calendar
          </p>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground text-xs font-body">
            {EN_DAYS[day]}, {EN_MONTHS[month]} {year}
          </p>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center px-4 pb-8 max-w-2xl mx-auto w-full gap-6">
        {/* Hero Date Card */}
        <motion.section
          data-ocid="date.card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full rounded-2xl overflow-hidden relative"
          style={{
            background: "oklch(0.17 0.03 45)",
            border: "1px solid oklch(0.78 0.18 65 / 0.20)",
            boxShadow:
              "0 0 60px oklch(0.78 0.18 65 / 0.08), 0 24px 48px rgba(0,0,0,0.4)",
          }}
        >
          {/* Decorative top band */}
          <div
            className="h-1 w-full"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.60 0.18 35), oklch(0.78 0.18 65), oklch(0.60 0.18 35))",
            }}
          />

          <div className="p-8 flex flex-col items-center gap-2 relative">
            {/* Mandala behind date */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="spin-slow opacity-60">
                <MandalaRing size={280} />
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="spin-reverse opacity-40">
                <MandalaRing size={200} />
              </div>
            </div>

            {/* Day name */}
            <div className="text-center relative z-10">
              <p className="font-display text-primary text-2xl font-semibold tracking-wide">
                {HINDI_DAYS[day]}
              </p>
              <p className="text-muted-foreground text-xs font-body mt-0.5 tracking-widest uppercase">
                {EN_DAYS[day]}
              </p>
            </div>

            {/* Big date number */}
            <motion.div
              key={date}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 my-2"
            >
              <span
                className="font-display font-black leading-none block text-center"
                style={{
                  fontSize: "clamp(6rem, 20vw, 9rem)",
                  color: "oklch(0.78 0.18 65)",
                  textShadow:
                    "0 0 40px oklch(0.78 0.18 65 / 0.4), 0 0 80px oklch(0.78 0.18 65 / 0.15)",
                }}
              >
                {String(date).padStart(2, "0")}
              </span>
            </motion.div>

            {/* Month & Year */}
            <div className="relative z-10 text-center">
              <p className="font-display text-foreground text-3xl font-bold">
                {HINDI_MONTHS[month]}
              </p>
              <p className="text-muted-foreground text-sm font-body mt-1 tracking-widest">
                {EN_MONTHS[month].toUpperCase()} · {year}
              </p>
            </div>
          </div>

          {/* Bottom band */}
          <div
            className="h-0.5 w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.78 0.18 65 / 0.30), transparent)",
            }}
          />
        </motion.section>

        {/* Clock Card */}
        <motion.section
          data-ocid="clock.card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="w-full rounded-2xl p-6"
          style={{
            background: "oklch(0.17 0.03 45)",
            border: "1px solid oklch(0.78 0.18 65 / 0.15)",
          }}
        >
          <p className="text-center text-muted-foreground text-xs font-body uppercase tracking-widest mb-4">
            समय · Current Time
          </p>

          <div className="flex items-center justify-center gap-1">
            {/* Hours */}
            <AnimatePresence mode="popLayout">
              <motion.span
                key={`h-${hours}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="font-display font-bold tabular-nums"
                style={{
                  fontSize: "clamp(2.5rem, 10vw, 4rem)",
                  color: "oklch(0.96 0.04 80)",
                }}
              >
                {pad(hours)}
              </motion.span>
            </AnimatePresence>

            <span
              className="font-display font-bold pulse-glow"
              style={{
                fontSize: "clamp(2.5rem, 10vw, 4rem)",
                color: "oklch(0.78 0.18 65)",
              }}
            >
              :
            </span>

            {/* Minutes */}
            <AnimatePresence mode="popLayout">
              <motion.span
                key={`m-${minutes}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="font-display font-bold tabular-nums"
                style={{
                  fontSize: "clamp(2.5rem, 10vw, 4rem)",
                  color: "oklch(0.96 0.04 80)",
                }}
              >
                {pad(minutes)}
              </motion.span>
            </AnimatePresence>

            <span
              className="font-display font-bold pulse-glow"
              style={{
                fontSize: "clamp(2.5rem, 10vw, 4rem)",
                color: "oklch(0.78 0.18 65)",
              }}
            >
              :
            </span>

            {/* Seconds */}
            <AnimatePresence mode="popLayout">
              <motion.span
                key={`s-${seconds}`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className="font-display font-bold tabular-nums"
                style={{
                  fontSize: "clamp(2.5rem, 10vw, 4rem)",
                  color: "oklch(0.60 0.18 35)",
                }}
              >
                {pad(seconds)}
              </motion.span>
            </AnimatePresence>

            {/* AM/PM */}
            <span
              className="font-body text-sm font-semibold ml-2 self-end mb-2"
              style={{ color: "oklch(0.78 0.18 65)" }}
            >
              {isAM ? "AM" : "PM"}
            </span>
          </div>

          {/* Progress bar for seconds */}
          <div
            className="mt-4 h-0.5 rounded-full overflow-hidden"
            style={{ background: "oklch(0.22 0.04 45)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.78 0.18 65), oklch(0.60 0.18 35))",
                width: `${(seconds / 59) * 100}%`,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </motion.section>

        {/* Calendar Grid */}
        <motion.section
          data-ocid="calendar.card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-full rounded-2xl p-6"
          style={{
            background: "oklch(0.17 0.03 45)",
            border: "1px solid oklch(0.78 0.18 65 / 0.15)",
          }}
        >
          {/* Month header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-foreground text-xl font-bold">
                {HINDI_MONTHS[month]}
              </h2>
              <p className="text-muted-foreground text-xs mt-0.5">
                {EN_MONTHS[month]} {year}
              </p>
            </div>
            <div
              className="px-3 py-1 rounded-full text-xs font-body font-semibold"
              style={{
                background: "oklch(0.78 0.18 65 / 0.15)",
                color: "oklch(0.78 0.18 65)",
                border: "1px solid oklch(0.78 0.18 65 / 0.25)",
              }}
            >
              {daysInMonth} दिन
            </div>
          </div>

          {/* Day headers — keyed by unique day abbreviation */}
          <div className="grid grid-cols-7 mb-3">
            {HINDI_DAYS_SHORT.map((d, i) => (
              <div key={d} className="text-center">
                <span
                  className="text-xs font-body font-semibold"
                  style={{
                    color:
                      i === 0 || i === 6
                        ? "oklch(0.60 0.18 35)"
                        : "oklch(0.62 0.06 70)",
                  }}
                >
                  {d}
                </span>
                <p
                  className="text-xs mt-0.5 hidden sm:block"
                  style={{ color: "oklch(0.42 0.04 60)" }}
                >
                  {EN_DAYS_SHORT[i]}
                </p>
              </div>
            ))}
          </div>

          {/* Separator */}
          <div
            className="h-px mb-3"
            style={{ background: "oklch(0.78 0.18 65 / 0.10)" }}
          />

          {/* Calendar cells — keyed by grid position (stable) */}
          <div className="grid grid-cols-7 gap-y-1">
            {calendarCells.map((d, cellIdx) => {
              const isToday = d === date;
              const colIdx = cellIdx % 7;
              const isWeekend = colIdx === 0 || colIdx === 6;
              // cellIdx is stable per month render — position-based key is correct here
              const cellKey = `cell-${cellIdx}`;

              return (
                <div
                  key={cellKey}
                  className="flex items-center justify-center"
                  style={{ aspectRatio: "1" }}
                >
                  {d !== null && (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-8 h-8 flex items-center justify-center rounded-full relative"
                      style={{
                        background: isToday
                          ? "oklch(0.78 0.18 65)"
                          : "transparent",
                        boxShadow: isToday
                          ? "0 0 20px oklch(0.78 0.18 65 / 0.50)"
                          : "none",
                      }}
                    >
                      <span
                        className="text-sm font-body font-medium leading-none"
                        style={{
                          color: isToday
                            ? "oklch(0.13 0.02 45)"
                            : isWeekend
                              ? "oklch(0.60 0.18 35)"
                              : "oklch(0.82 0.04 70)",
                          fontWeight: isToday ? 700 : 400,
                        }}
                      >
                        {d}
                      </span>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Extra info row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="w-full grid grid-cols-3 gap-3"
        >
          {[
            {
              label: "सप्ताह दिन",
              sub: "Weekday",
              value: HINDI_DAYS_SHORT[day],
            },
            {
              label: "दिन क्रमांक",
              sub: "Day of Year",
              value: String(
                Math.floor(
                  (now.getTime() - new Date(year, 0, 0).getTime()) / 86400000,
                ),
              ),
            },
            {
              label: "सप्ताह",
              sub: "Week No.",
              value: String(Math.ceil((date + firstDay) / 7)),
            },
          ].map(({ label, sub, value }) => (
            <div
              key={label}
              className="rounded-xl p-3 text-center"
              style={{
                background: "oklch(0.17 0.03 45)",
                border: "1px solid oklch(0.78 0.18 65 / 0.12)",
              }}
            >
              <p
                className="font-display font-bold text-lg"
                style={{ color: "oklch(0.78 0.18 65)" }}
              >
                {value}
              </p>
              <p className="text-muted-foreground text-xs mt-1 font-body">
                {label}
              </p>
              <p
                className="text-xs font-body"
                style={{ color: "oklch(0.40 0.04 60)" }}
              >
                {sub}
              </p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center">
        <p
          className="text-xs font-body"
          style={{ color: "oklch(0.38 0.04 60)" }}
        >
          © {currentYear}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80 transition-opacity"
            style={{ color: "oklch(0.60 0.10 65)" }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
