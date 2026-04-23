import { useState, useEffect, useCallback, useRef } from "react";
import { drivers, Driver } from "./data/drivers";
import { teams, Team } from "./data/teams";
import { races, Race } from "./data/races";

// ─── Helpers ──────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function getTeamColor(teamId: string) {
  return teams.find((t) => t.id === teamId)?.color ?? "#888";
}

function getCountdownTo(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
  };
}

/**
 * Compute live race status so the site auto-advances through the season.
 * - If a race has results → "completed"
 * - First future race (no results, raceDate in the future) → "next"
 * - Everything after that → "upcoming"
 */
function getRacesWithLiveStatus(): (Race & { liveStatus: "completed" | "next" | "upcoming" })[] {
  const now = Date.now();
  let foundNext = false;
  return races.map((r) => {
    if (r.results && r.results.length > 0) {
      return { ...r, liveStatus: "completed" as const };
    }
    if (!foundNext && new Date(r.raceDate).getTime() > now - 3 * 86400000) {
      // race hasn't happened yet (or within 3-day race-weekend window)
      foundNext = true;
      return { ...r, liveStatus: "next" as const };
    }
    if (!foundNext) {
      // past date but no results → still show as completed (race weekend passed)
      return { ...r, liveStatus: "completed" as const };
    }
    return { ...r, liveStatus: "upcoming" as const };
  });
}

const tickerStats = [
  "🏎️ LAP RECORD: 1:29.708 — M. Verstappen (2023)",
  "🌡️ TRACK TEMP: 42°C — Miami International Autodrome",
  "💨 AIR TEMP: 31°C — Humidity: 68%",
  "🌬️ WIND: 12 km/h — SE Direction",
  "📡 DRS ZONES: 3 — Detection at Turns 11, 17, 20",
  "🔴 TYRE COMPOUNDS: C2 (Hard) · C3 (Medium) · C4 (Soft)",
  "⛽ PIT WINDOW: Lap 15-20 (1 stop) · Lap 12-15, 30-35 (2 stop)",
  "🏁 2026 STANDINGS: Antonelli 72 · Russell 63 · Leclerc 49",
];

// ─── Modal: Driver Detail ─────────────────────────────────
function DriverModal({ driver, onClose }: { driver: Driver; onClose: () => void }) {
  const team = teams.find((t) => t.id === driver.teamId);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-8 pb-6 rounded-t-2xl text-white" style={{ background: `linear-gradient(135deg, ${getTeamColor(driver.teamId)}, #1a1a2e)` }}>
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition text-xl font-bold">✕</button>
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center text-5xl font-black">{driver.number}</div>
            <div>
              <p className="text-sm uppercase tracking-widest opacity-80">{driver.team}</p>
              <h2 className="text-4xl font-black leading-tight">{driver.firstName}</h2>
              <h2 className="text-4xl font-black leading-tight italic">{driver.lastName}</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-2xl">{driver.flag}</span>
                <span className="text-sm opacity-80">{driver.country}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Season Stats */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">2026 Season Stats</h3>
            <div className="grid grid-cols-5 gap-3">
              {([
                ["Points", driver.points],
                ["Wins", driver.wins],
                ["Podiums", driver.podiums],
                ["Poles", driver.poles],
                ["Fastest Laps", driver.fastestLaps],
              ] as [string, number][]).map(([label, val]) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black" style={{ color: getTeamColor(driver.teamId) }}>{val}</p>
                  <p className="text-[10px] uppercase tracking-wide text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Info */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">Personal Info</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {([
                ["Date of Birth", driver.dob],
                ["Birthplace", driver.birthPlace],
                ["Height", driver.height],
                ["Weight", driver.weight],
                ["F1 Seasons", driver.seasons.toString()],
                ["Car Number", `#${driver.number}`],
              ] as [string, string][]).map(([l, v]) => (
                <div key={l} className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">{l}</span>
                  <span className="font-semibold">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Career */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">Career Statistics</h3>
            <div className="grid grid-cols-4 gap-3">
              {([
                ["Championships", driver.championships],
                ["Career Wins", driver.careerWins],
                ["Career Podiums", driver.careerPodiums],
                ["Career Points", driver.careerPoints],
              ] as [string, number][]).map(([label, val]) => (
                <div key={label} className="border border-gray-200 rounded-xl p-3 text-center">
                  <p className="text-xl font-black">{val}</p>
                  <p className="text-[10px] uppercase tracking-wide text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">About</h3>
            <p className="text-gray-700 leading-relaxed text-sm">{driver.bio}</p>
          </div>

          {/* Recent Results */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">2026 Race Results</h3>
            <div className="space-y-2">
              {driver.recentResults.map((r) => (
                <div key={r.race} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2">
                  <span className="text-sm font-medium">{r.race}</span>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-bold ${r.position <= 3 ? "text-green-600" : r.position <= 10 ? "text-gray-800" : "text-gray-400"}`}>
                      P{r.position}
                    </span>
                    <span className="text-xs text-gray-500 w-12 text-right">{r.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Link */}
          {team && (
            <div className="border-t pt-6">
              <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">Team</h3>
              <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
                <div className="w-3 h-12 rounded-full" style={{ background: team.color }} />
                <div>
                  <p className="font-bold">{team.fullName}</p>
                  <p className="text-sm text-gray-500">{team.base}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Modal: Team Detail ───────────────────────────────────
function TeamModal({ team, onClose, onDriverClick }: { team: Team; onClose: () => void; onDriverClick: (d: Driver) => void }) {
  const teamDrivers = drivers.filter((d) => d.teamId === team.id);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="relative p-8 pb-6 rounded-t-2xl text-white" style={{ background: `linear-gradient(135deg, ${team.color}, #1a1a2e)` }}>
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition text-xl font-bold">✕</button>
          <p className="text-sm uppercase tracking-widest opacity-80">Constructor</p>
          <h2 className="text-4xl font-black mt-1">{team.name}</h2>
          <p className="text-sm opacity-80 mt-1">{team.fullName}</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Points */}
          <div className="grid grid-cols-3 gap-3">
            {([
              ["2026 Points", team.points],
              ["Championships", team.championships],
              ["Drivers", teamDrivers.length],
            ] as [string, number][]).map(([l, v]) => (
              <div key={l} className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-black" style={{ color: team.color }}>{v}</p>
                <p className="text-[10px] uppercase tracking-wide text-gray-500 mt-1">{l}</p>
              </div>
            ))}
          </div>

          {/* Info */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">Team Info</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {([
                ["Base", team.base],
                ["Team Principal", team.teamPrincipal],
                ["Power Unit", team.powerUnit],
                ["Chassis", team.chassis],
                ["Founded", team.founded],
              ] as [string, string][]).map(([l, v]) => (
                <div key={l} className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">{l}</span>
                  <span className="font-semibold">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Car Specs */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">{team.carName} — Technical Specs</h3>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(team.carSpecs).map(([key, val]) => (
                <div key={key} className="flex justify-between bg-gray-50 rounded-lg px-4 py-2 text-sm">
                  <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                  <span className="font-medium text-right max-w-[60%]">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">About</h3>
            <p className="text-gray-700 leading-relaxed text-sm">{team.bio}</p>
          </div>

          {/* Drivers */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">Drivers</h3>
            <div className="grid grid-cols-2 gap-3">
              {teamDrivers.map((d) => (
                <button
                  key={d.id}
                  onClick={() => { onClose(); setTimeout(() => onDriverClick(d), 100); }}
                  className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition text-left"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-white" style={{ background: team.color }}>
                    {d.number}
                  </div>
                  <div>
                    <p className="font-bold">{d.firstName} {d.lastName}</p>
                    <p className="text-sm text-gray-500">{d.flag} {d.country} · P{d.pos} ({d.points} pts)</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Modal: Race Detail ───────────────────────────────────
function RaceModal({ race, onClose }: { race: Race; liveStatus: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="relative p-8 pb-6 rounded-t-2xl text-white bg-gradient-to-br from-gray-900 to-gray-700">
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition text-xl font-bold">✕</button>
          <p className="text-sm uppercase tracking-widest opacity-80">Round {race.round} of 23</p>
          <h2 className="text-3xl font-black mt-1">{race.flag} {race.officialName}</h2>
          <p className="text-sm opacity-80 mt-1">{race.circuit} · {race.city}</p>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {([
              ["Laps", race.laps],
              ["Distance", race.distance],
              ["Dates", race.dates],
            ] as [string, string | number][]).map(([l, v]) => (
              <div key={l} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-lg font-black">{v}</p>
                <p className="text-[10px] uppercase tracking-wide text-gray-500">{l}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500">Lap Record</span>
              <span className="font-semibold">{race.lapRecord}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500">Record Holder</span>
              <span className="font-semibold">{race.lapRecordHolder} ({race.lapRecordYear})</span>
            </div>
          </div>

          {race.results && race.results.length > 0 ? (
            <>
              <div className="grid grid-cols-3 gap-3">
                {([
                  ["🏆 Winner", race.winner],
                  ["🏁 Pole", race.polePosition],
                  ["⚡ Fastest Lap", race.fastestLap],
                ] as [string, string | undefined][]).map(([l, v]) => (
                  <div key={l} className="border border-gray-200 rounded-xl p-3 text-center">
                    <p className="text-sm font-black">{v}</p>
                    <p className="text-[10px] text-gray-500">{l}</p>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">Race Results</h3>
                <div className="space-y-1">
                  {race.results.map((r) => (
                    <div key={r.pos} className={`flex items-center justify-between rounded-lg px-4 py-2 text-sm ${r.pos <= 3 ? "bg-yellow-50" : "bg-gray-50"}`}>
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white ${r.pos === 1 ? "bg-yellow-500" : r.pos === 2 ? "bg-gray-400" : r.pos === 3 ? "bg-amber-700" : "bg-gray-300"}`}>
                          {r.pos}
                        </span>
                        <span className="font-medium">{r.driver}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500 text-xs">{r.team}</span>
                        <span className="text-gray-400 text-xs w-20 text-right">{r.time}</span>
                        <span className="font-bold text-xs w-10 text-right">{r.points} pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="text-5xl mb-3">🏁</p>
              <p className="text-sm">Race not yet completed</p>
              <p className="text-xs mt-1">{race.dates}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Paddock Intel Data ───────────────────────────────────
const paddockIntel = [
  {
    category: "TOP STORY",
    color: "#DC0000",
    title: "Antonelli's rookie surge rewrites Mercedes' championship math",
    content: "Three rounds in, the 19-year-old Italian has won back-to-back races and sits atop the drivers' championship. Russell's consistent podiums mean Mercedes locked out each weekend. Rivals now face an ominous question: how much faster can this pairing get?",
    time: "2h ago",
  },
  {
    category: "ONLINE BUZZ",
    color: "#3671C6",
    title: "Red Bull's RB22: A debut chip in Mercedes' paddock armour",
    content: "Despite the full Ford works engagement, the RB22's 2026 power unit struggles with energy deployment under the new rules. Verstappen's P9 in Bahrain was his worst qualifying result since 2021 — but the Dutchman insists development pace is strong.",
    time: "4h ago",
  },
  {
    category: "EXCLUSIVE",
    color: "#006F62",
    title: "Cadillac deal is complex: Prada's team, Andretti's heart, GM's billions",
    content: "The 11th team saga continues as GM's Cadillac brand finalises its 2026 entry. Ferrari customer power units are confirmed, but the team's Indianapolis base and Andretti family involvement create a uniquely American operation in the paddock.",
    time: "6h ago",
  },
  {
    category: "BREAKING",
    color: "#FF8700",
    title: "Hamilton eyes 8th title: 'The Ferrari feels like home now'",
    content: "Sir Lewis Hamilton's second year in red has started strongly with consistent points. The seven-time champion says the SF-26 suits his smooth driving style perfectly, and he believes this is the car that could finally deliver his record-breaking eighth crown.",
    time: "8h ago",
  },
  {
    category: "FEATURE",
    color: "#52E252",
    title: "Audi power awakens: Sauber's 2026 transformation begins",
    content: "Under Mattia Binotto's leadership, the Hinwil team has shown encouraging signs with the Audi power unit. Hülkenberg's technical feedback is driving rapid development, while Bortoleto's raw speed gives the team an exciting future outlook.",
    time: "12h ago",
  },
];

// ─── Main App ─────────────────────────────────────────────
export default function App() {
  const liveRaces = getRacesWithLiveStatus();
  const nextRace = liveRaces.find((r) => r.liveStatus === "next") ?? liveRaces[liveRaces.length - 1];
  const completedCount = liveRaces.filter((r) => r.liveStatus === "completed").length;

  const [countdown, setCountdown] = useState(getCountdownTo(nextRace.raceDate));
  const [tickerIdx, setTickerIdx] = useState(0);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedRace, setSelectedRace] = useState<(typeof liveRaces)[0] | null>(null);
  const [greeting, setGreeting] = useState(getGreeting());
  const calRef = useRef<HTMLDivElement>(null);

  // Countdown every second
  useEffect(() => {
    const iv = setInterval(() => {
      setCountdown(getCountdownTo(nextRace.raceDate));
    }, 1000);
    return () => clearInterval(iv);
  }, [nextRace.raceDate]);

  // Ticker rotation
  useEffect(() => {
    const iv = setInterval(() => setTickerIdx((p) => (p + 1) % tickerStats.length), 3000);
    return () => clearInterval(iv);
  }, []);

  // Greeting
  useEffect(() => {
    const iv = setInterval(() => setGreeting(getGreeting()), 60000);
    return () => clearInterval(iv);
  }, []);

  const handleDriverClick = useCallback((d: Driver) => setSelectedDriver(d), []);
  const handleTeamClick = useCallback((t: Team) => setSelectedTeam(t), []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="min-h-screen bg-[#faf9f6] text-gray-900" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ═══ LIVE TICKER ═══ */}
      <div className="bg-gray-900 text-white text-xs py-1.5 overflow-hidden sticky top-0 z-40">
        <div className="flex items-center justify-center gap-6">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="uppercase tracking-widest text-[10px] text-gray-400">Live</span>
          </span>
          <span className="font-mono transition-all duration-500">{tickerStats[tickerIdx]}</span>
        </div>
      </div>

      {/* ═══ HEADER ═══ */}
      <header className="bg-[#0d0d0d] text-white">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏁</span>
            <span className="uppercase tracking-[0.3em] text-gray-400">Personal Edition</span>
            <span className="text-gray-600">·</span>
            <span className="uppercase tracking-[0.3em] text-gray-400">F1 2026</span>
          </div>
          <div className="text-gray-400">
            {greeting} · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pb-10 pt-6">
          <h1 className="text-6xl md:text-8xl font-black leading-none">
            MACVOLZ's
          </h1>
          <h1 className="text-6xl md:text-8xl font-black leading-none mt-1">
            <span className="italic text-red-500">Pit Wall</span><span className="text-red-500">.</span>
          </h1>
          <div className="mt-4 inline-block bg-red-600 text-white text-xs uppercase tracking-widest px-3 py-1 rounded-sm font-bold">
            ● Live Edition
          </div>
        </div>
      </header>

      {/* ═══ NEXT RACE HERO ═══ */}
      <section className="bg-[#111] text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs">
                <span className="bg-red-600 text-white px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider">Round {nextRace.round}</span>
                <span className="bg-red-600/30 text-red-400 px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider">Up Next</span>
                <span className="text-gray-400 ml-2 text-lg">{nextRace.flag}</span>
                <span className="text-gray-400 uppercase tracking-widest">{nextRace.countryCode}</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black leading-tight">
                {nextRace.name.split(" ")[0]} <span className="italic text-red-400">Grand</span>
                <br />Prix
              </h2>
              <p className="text-sm text-gray-400">
                {nextRace.circuit} · {nextRace.city}
                <br />
                Round {nextRace.round} of 23 · {nextRace.laps} laps · {nextRace.distance}
              </p>
              <div className="flex items-center gap-8 text-xs text-gray-400 pt-2 border-t border-gray-800 mt-4 flex-wrap">
                <div>
                  <span className="uppercase tracking-widest text-[10px]">Lap Record</span>
                  <p className="text-white font-mono text-lg font-bold mt-1">{nextRace.lapRecord}</p>
                </div>
                <div>
                  <span className="uppercase tracking-widest text-[10px]">Pole {nextRace.lapRecordYear}</span>
                  <p className="text-white font-medium mt-1">{nextRace.lapRecordHolder}</p>
                </div>
                <div>
                  <span className="uppercase tracking-widest text-[10px]">Dates</span>
                  <p className="text-white font-medium mt-1">{nextRace.dates}</p>
                </div>
              </div>
            </div>

            {/* Countdown */}
            <div className="text-center lg:text-right space-y-3">
              <p className="text-xs uppercase tracking-widest text-gray-500">Lights Out In</p>
              <div className="flex items-center gap-3">
                {[
                  { val: countdown.days, label: "Days" },
                  { val: countdown.hours, label: "Hours" },
                  { val: countdown.mins, label: "Mins" },
                  { val: countdown.secs, label: "Secs" },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-800 rounded-xl px-5 py-4 min-w-[72px]">
                    <p className="text-3xl md:text-4xl font-black font-mono">{pad(item.val)}</p>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
              {/* Checkered pattern */}
              <div className="flex justify-end gap-[2px] opacity-20 mt-2">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div key={i} className={`w-2 h-2 ${(Math.floor(i / 8) + (i % 8)) % 2 === 0 ? "bg-white" : "bg-transparent"}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SEASON CALENDAR ═══ */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-black mb-1">
          Season <span className="italic text-red-500">Calendar</span>
        </h2>
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-6">All 23 rounds · 2026 FIA Formula One World Championship</p>

        <div className="relative">
          <button
            onClick={() => calRef.current?.scrollBy({ left: -300, behavior: "smooth" })}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-100 transition"
          >
            ‹
          </button>
          <div ref={calRef} className="flex gap-3 overflow-x-auto pb-4 px-10 snap-x" style={{ scrollbarWidth: "none" }}>
            {liveRaces.map((race) => (
              <button
                key={race.round}
                onClick={() => setSelectedRace(race)}
                className={`snap-start flex-shrink-0 w-[140px] rounded-xl border-2 p-3 text-left transition hover:shadow-lg hover:-translate-y-1 ${
                  race.liveStatus === "next"
                    ? "border-red-500 bg-red-50"
                    : race.liveStatus === "completed"
                    ? "border-gray-300 bg-gray-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-1 mb-2">
                  {race.liveStatus === "completed" && <span className="text-[9px] bg-green-600 text-white px-1 rounded font-bold">DONE</span>}
                  {race.liveStatus === "next" && <span className="text-[9px] bg-red-600 text-white px-1 rounded font-bold animate-pulse">NEXT</span>}
                  <span className="text-[9px] bg-gray-200 text-gray-600 px-1 rounded font-bold">R{race.round}</span>
                </div>
                <div className="text-lg mb-1">{race.flag}</div>
                <p className="font-bold text-sm leading-tight">{race.name}</p>
                <p className="text-[10px] text-gray-500 mt-1">{race.circuit.length > 20 ? race.city : race.circuit}</p>
                <p className="text-[10px] text-gray-400 mt-1">{race.dates}</p>
                {race.liveStatus === "completed" && race.winner && (
                  <p className="text-[10px] text-green-600 font-bold mt-1">🏆 {race.winner}</p>
                )}
              </button>
            ))}
          </div>
          <button
            onClick={() => calRef.current?.scrollBy({ left: 300, behavior: "smooth" })}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-100 transition"
          >
            ›
          </button>
        </div>
      </section>

      {/* ═══ THREE COLUMN: Drivers / Constructors / Paddock Intel ═══ */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Drivers' Championship ── */}
          <div>
            <h2 className="text-2xl font-black">
              Drivers' <span className="italic text-red-500">Championship</span>
            </h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-4">F1 · After {completedCount} rounds</p>
            <div className="space-y-1">
              {drivers.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleDriverClick(d)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition group text-left"
                >
                  <span className="text-xs text-gray-400 w-5 font-mono">{pad(d.pos)}</span>
                  <div className="w-1.5 h-8 rounded-full" style={{ background: getTeamColor(d.teamId) }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm">{d.firstName[0]}. {d.lastName}</span>
                      <span className="text-xs px-1 rounded text-white font-bold" style={{ background: getTeamColor(d.teamId), fontSize: "9px" }}>
                        {d.countryCode}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">{d.team} · #{d.number}</p>
                  </div>
                  <span className="text-lg font-black group-hover:text-red-500 transition">{d.points}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Constructors' Cup ── */}
          <div>
            <h2 className="text-2xl font-black">
              Constructors' <span className="italic text-red-500">Cup</span>
            </h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-4">F1 · After {completedCount} rounds</p>
            <div className="space-y-1">
              {[...teams]
                .sort((a, b) => b.points - a.points)
                .map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => handleTeamClick(t)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition group text-left"
                  >
                    <span className="text-xs text-gray-400 w-5 font-mono">{pad(i + 1)}</span>
                    <div className="w-1.5 h-8 rounded-full" style={{ background: t.color }} />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-sm">{t.name}</span>
                      <p className="text-[10px] text-gray-400">{t.powerUnit}</p>
                    </div>
                    <span className="text-lg font-black group-hover:text-red-500 transition">{t.points}</span>
                  </button>
                ))}
            </div>
          </div>

          {/* ── Paddock Intel ── */}
          <div>
            <h2 className="text-2xl font-black">
              Paddock <span className="italic text-red-500">Intel</span>
            </h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-4">Latest news & rumours</p>
            <div className="space-y-4">
              {paddockIntel.map((item, i) => (
                <div key={i} className="border-l-4 pl-4 py-1" style={{ borderColor: item.color }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded text-white" style={{ background: item.color }}>
                      {item.category}
                    </span>
                    <span className="text-[10px] text-gray-400">{item.time}</span>
                  </div>
                  <h3 className="text-sm font-bold leading-snug">{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-3">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ COMPLETED RACES RESULTS ═══ */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-black mb-1">
          Race <span className="italic text-red-500">Results</span>
        </h2>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-6">Completed rounds · Tap to view full results</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {liveRaces.filter((r) => r.liveStatus === "completed" && r.results).map((race) => (
            <button
              key={race.round}
              onClick={() => setSelectedRace(race)}
              className="bg-white border border-gray-200 rounded-xl p-5 text-left hover:shadow-lg hover:border-gray-300 transition group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase">Round {race.round}</span>
                <span className="text-lg">{race.flag}</span>
              </div>
              <h3 className="text-lg font-black group-hover:text-red-500 transition">{race.officialName}</h3>
              <p className="text-xs text-gray-400 mt-1">{race.circuit}</p>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-xs font-bold">🏆</p>
                  <p className="text-[10px] text-gray-600 font-medium mt-0.5">{race.winner}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-xs font-bold">🏁</p>
                  <p className="text-[10px] text-gray-600 font-medium mt-0.5">{race.polePosition}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-xs font-bold">⚡</p>
                  <p className="text-[10px] text-gray-600 font-medium mt-0.5">{race.fastestLap}</p>
                </div>
              </div>
              {race.results && (
                <div className="mt-3 space-y-1">
                  {race.results.slice(0, 3).map((r) => (
                    <div key={r.pos} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${r.pos === 1 ? "bg-yellow-500" : r.pos === 2 ? "bg-gray-400" : "bg-amber-700"}`}>
                          {r.pos}
                        </span>
                        <span className="font-medium">{r.driver}</span>
                      </div>
                      <span className="text-gray-400">{r.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ═══ SEASON STATS ═══ */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-black mb-8 text-center">
            Season <span className="italic text-red-500">Statistics</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Fastest Lap 2026", value: "1:19.813", sub: "K. Antonelli — Australia" },
              { label: "Most Wins", value: "2", sub: "K. Antonelli — Mercedes" },
              { label: "Championship Leader", value: "72 pts", sub: "K. Antonelli — Mercedes" },
              { label: "Constructor Leader", value: "135 pts", sub: "Mercedes-AMG" },
              { label: "Races Completed", value: `${completedCount} / 23`, sub: `${Math.round((completedCount / 23) * 100)}% of season` },
              { label: "Total Points Scored", value: "356", sub: "Across all drivers" },
              { label: "Different Winners", value: "2", sub: "Antonelli (2), Russell (1)" },
              { label: "Youngest Winner", value: "19y 188d", sub: "K. Antonelli — Record" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 backdrop-blur rounded-xl p-5 text-center hover:bg-white/10 transition">
                <p className="text-2xl md:text-3xl font-black font-mono text-red-400">{stat.value}</p>
                <p className="text-xs font-bold mt-2 uppercase tracking-wider">{stat.label}</p>
                <p className="text-[10px] text-gray-500 mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-[#0d0d0d] text-gray-500 text-center py-10 text-xs space-y-3">
        <div className="flex items-center justify-center gap-2 text-lg">
          <span>🏁</span>
          <span className="font-black text-white text-sm">
            MACVOLZ's <span className="italic text-red-500">Pit Wall</span>
          </span>
        </div>
        <p className="uppercase tracking-[0.3em]">F1 2026 · 23 Rounds · 11 Teams · 20 Drivers</p>
        <p className="text-gray-700">Built with ❤️ for Formula 1 · All data is fictional/illustrative</p>
        <div className="flex items-center justify-center gap-4 mt-2 text-gray-600 flex-wrap">
          {liveRaces.filter(r => r.liveStatus === "completed").map(r => (
            <span key={r.round}>{r.name} ✓</span>
          ))}
          <span className="text-red-500 font-bold">{nextRace.name} →</span>
        </div>
      </footer>

      {/* ═══ MODALS ═══ */}
      {selectedDriver && (
        <DriverModal driver={selectedDriver} onClose={() => setSelectedDriver(null)} />
      )}
      {selectedTeam && (
        <TeamModal
          team={selectedTeam}
          onClose={() => setSelectedTeam(null)}
          onDriverClick={(d) => setSelectedDriver(d)}
        />
      )}
      {selectedRace && (
        <RaceModal race={selectedRace} liveStatus={selectedRace.liveStatus} onClose={() => setSelectedRace(null)} />
      )}
    </div>
  );
}
