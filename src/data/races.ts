export interface Race {
  round: number;
  name: string;
  officialName: string;
  country: string;
  countryCode: string;
  flag: string;
  circuit: string;
  city: string;
  laps: number;
  distance: string;
  lapRecord: string;
  lapRecordHolder: string;
  lapRecordYear: string;
  dates: string;
  raceDate: string; // ISO date for countdown
  status: "completed" | "next" | "upcoming";
  winner?: string;
  polePosition?: string;
  fastestLap?: string;
  results?: { pos: number; driver: string; team: string; time: string; points: number }[];
}

export const races: Race[] = [
  {
    round: 1,
    name: "Bahrain",
    officialName: "Bahrain Grand Prix",
    country: "Bahrain",
    countryCode: "BH",
    flag: "🇧🇭",
    circuit: "Bahrain International Circuit",
    city: "Sakhir",
    laps: 57,
    distance: "308.238 km",
    lapRecord: "1:31.447",
    lapRecordHolder: "P. de la Rosa",
    lapRecordYear: "2005",
    dates: "Mar 1-3",
    raceDate: "2026-03-01T18:00:00",
    status: "completed",
    winner: "K. Antonelli",
    polePosition: "K. Antonelli",
    fastestLap: "G. Russell",
    results: [
      { pos: 1, driver: "K. Antonelli", team: "Mercedes", time: "1:32:45.123", points: 25 },
      { pos: 2, driver: "G. Russell", team: "Mercedes", time: "+3.456", points: 19 },
      { pos: 3, driver: "L. Hamilton", team: "Ferrari", time: "+8.912", points: 15 },
      { pos: 4, driver: "C. Leclerc", team: "Ferrari", time: "+12.345", points: 12 },
      { pos: 5, driver: "O. Piastri", team: "McLaren", time: "+23.456", points: 10 },
      { pos: 6, driver: "L. Norris", team: "McLaren", time: "+25.789", points: 8 },
      { pos: 7, driver: "O. Bearman", team: "Haas", time: "+34.567", points: 6 },
      { pos: 8, driver: "P. Gasly", team: "Alpine", time: "+38.901", points: 4 },
      { pos: 9, driver: "M. Verstappen", team: "Red Bull", time: "+42.234", points: 2 },
      { pos: 10, driver: "L. Lawson", team: "Red Bull", time: "+45.678", points: 1 },
    ],
  },
  {
    round: 2,
    name: "Saudi Arabia",
    officialName: "Saudi Arabian Grand Prix",
    country: "Saudi Arabia",
    countryCode: "SA",
    flag: "🇸🇦",
    circuit: "Jeddah Corniche Circuit",
    city: "Jeddah",
    laps: 50,
    distance: "308.45 km",
    lapRecord: "1:30.734",
    lapRecordHolder: "M. Verstappen",
    lapRecordYear: "2024",
    dates: "Mar 14-16",
    raceDate: "2026-03-14T20:00:00",
    status: "completed",
    winner: "G. Russell",
    polePosition: "C. Leclerc",
    fastestLap: "M. Verstappen",
    results: [
      { pos: 1, driver: "G. Russell", team: "Mercedes", time: "1:28:34.567", points: 25 },
      { pos: 2, driver: "K. Antonelli", team: "Mercedes", time: "+2.345", points: 18 },
      { pos: 3, driver: "C. Leclerc", team: "Ferrari", time: "+5.678", points: 15 },
      { pos: 4, driver: "L. Norris", team: "McLaren", time: "+12.345", points: 12 },
      { pos: 5, driver: "L. Hamilton", team: "Ferrari", time: "+15.678", points: 10 },
      { pos: 6, driver: "O. Bearman", team: "Haas", time: "+23.456", points: 8 },
      { pos: 7, driver: "O. Piastri", team: "McLaren", time: "+28.789", points: 6 },
      { pos: 8, driver: "M. Verstappen", team: "Red Bull", time: "+32.123", points: 4 },
      { pos: 9, driver: "P. Gasly", team: "Alpine", time: "+35.456", points: 2 },
      { pos: 10, driver: "L. Lawson", team: "Red Bull", time: "+38.789", points: 1 },
    ],
  },
  {
    round: 3,
    name: "Australia",
    officialName: "Australian Grand Prix",
    country: "Australia",
    countryCode: "AU",
    flag: "🇦🇺",
    circuit: "Albert Park Circuit",
    city: "Melbourne",
    laps: 58,
    distance: "306.124 km",
    lapRecord: "1:19.813",
    lapRecordHolder: "C. Leclerc",
    lapRecordYear: "2024",
    dates: "Mar 28-30",
    raceDate: "2026-03-28T06:00:00",
    status: "completed",
    winner: "K. Antonelli",
    polePosition: "K. Antonelli",
    fastestLap: "L. Hamilton",
    results: [
      { pos: 1, driver: "K. Antonelli", team: "Mercedes", time: "1:24:56.789", points: 26 },
      { pos: 2, driver: "C. Leclerc", team: "Ferrari", time: "+1.234", points: 18 },
      { pos: 3, driver: "G. Russell", team: "Mercedes", time: "+4.567", points: 15 },
      { pos: 4, driver: "L. Hamilton", team: "Ferrari", time: "+8.901", points: 13 },
      { pos: 5, driver: "Y. Tsunoda", team: "Aston Martin", time: "+15.234", points: 10 },
      { pos: 6, driver: "P. Gasly", team: "Alpine", time: "+18.567", points: 8 },
      { pos: 7, driver: "M. Verstappen", team: "Red Bull", time: "+22.890", points: 6 },
      { pos: 8, driver: "L. Norris", team: "McLaren", time: "+25.123", points: 4 },
      { pos: 9, driver: "L. Lawson", team: "Red Bull", time: "+28.456", points: 2 },
      { pos: 10, driver: "L. Stroll", team: "Aston Martin", time: "+31.789", points: 1 },
    ],
  },
  {
    round: 4, name: "Miami", officialName: "Miami Grand Prix", country: "United States", countryCode: "US", flag: "🇺🇸",
    circuit: "Miami International Autodrome", city: "Hard Rock Stadium", laps: 57, distance: "308.326 km",
    lapRecord: "1:29.708", lapRecordHolder: "M. Verstappen", lapRecordYear: "2023",
    dates: "May 1-3", raceDate: "2026-05-03T20:00:00", status: "next",
  },
  {
    round: 5, name: "Canada", officialName: "Canadian Grand Prix", country: "Canada", countryCode: "CA", flag: "🇨🇦",
    circuit: "Circuit Gilles Villeneuve", city: "Montreal", laps: 70, distance: "305.27 km",
    lapRecord: "1:13.078", lapRecordHolder: "V. Bottas", lapRecordYear: "2019",
    dates: "May 22-24", raceDate: "2026-05-24T19:00:00", status: "upcoming",
  },
  {
    round: 6, name: "Monaco", officialName: "Monaco Grand Prix", country: "Monaco", countryCode: "MC", flag: "🇲🇨",
    circuit: "Circuit de Monaco", city: "Monte Carlo", laps: 78, distance: "260.286 km",
    lapRecord: "1:12.909", lapRecordHolder: "L. Hamilton", lapRecordYear: "2021",
    dates: "Jun 5-7", raceDate: "2026-06-07T15:00:00", status: "upcoming",
  },
  {
    round: 7, name: "Spain", officialName: "Spanish Grand Prix", country: "Spain", countryCode: "ES", flag: "🇪🇸",
    circuit: "Circuit de Barcelona-Catalunya", city: "Barcelona", laps: 66, distance: "307.236 km",
    lapRecord: "1:16.330", lapRecordHolder: "M. Verstappen", lapRecordYear: "2023",
    dates: "Jun 19-21", raceDate: "2026-06-21T15:00:00", status: "upcoming",
  },
  {
    round: 8, name: "Austria", officialName: "Austrian Grand Prix", country: "Austria", countryCode: "AT", flag: "🇦🇹",
    circuit: "Red Bull Ring", city: "Spielberg", laps: 71, distance: "306.452 km",
    lapRecord: "1:05.619", lapRecordHolder: "C. Sainz", lapRecordYear: "2020",
    dates: "Jun 26-28", raceDate: "2026-06-28T15:00:00", status: "upcoming",
  },
  {
    round: 9, name: "Great Britain", officialName: "British Grand Prix", country: "United Kingdom", countryCode: "GB", flag: "🇬🇧",
    circuit: "Silverstone Circuit", city: "Silverstone", laps: 52, distance: "306.198 km",
    lapRecord: "1:27.097", lapRecordHolder: "M. Verstappen", lapRecordYear: "2020",
    dates: "Jul 3-5", raceDate: "2026-07-05T15:00:00", status: "upcoming",
  },
  {
    round: 10, name: "Belgium", officialName: "Belgian Grand Prix", country: "Belgium", countryCode: "BE", flag: "🇧🇪",
    circuit: "Circuit de Spa-Francorchamps", city: "Spa", laps: 44, distance: "308.052 km",
    lapRecord: "1:46.286", lapRecordHolder: "V. Bottas", lapRecordYear: "2018",
    dates: "Jul 24-26", raceDate: "2026-07-26T15:00:00", status: "upcoming",
  },
  {
    round: 11, name: "Hungary", officialName: "Hungarian Grand Prix", country: "Hungary", countryCode: "HU", flag: "🇭🇺",
    circuit: "Hungaroring", city: "Budapest", laps: 70, distance: "306.63 km",
    lapRecord: "1:16.627", lapRecordHolder: "L. Hamilton", lapRecordYear: "2020",
    dates: "Aug 1-3", raceDate: "2026-08-03T15:00:00", status: "upcoming",
  },
  {
    round: 12, name: "Netherlands", officialName: "Dutch Grand Prix", country: "Netherlands", countryCode: "NL", flag: "🇳🇱",
    circuit: "Circuit Zandvoort", city: "Zandvoort", laps: 72, distance: "306.587 km",
    lapRecord: "1:11.097", lapRecordHolder: "L. Norris", lapRecordYear: "2024",
    dates: "Aug 28-30", raceDate: "2026-08-30T15:00:00", status: "upcoming",
  },
  {
    round: 13, name: "Italy", officialName: "Italian Grand Prix", country: "Italy", countryCode: "IT", flag: "🇮🇹",
    circuit: "Autodromo Nazionale Monza", city: "Monza", laps: 53, distance: "306.72 km",
    lapRecord: "1:21.046", lapRecordHolder: "R. Barrichello", lapRecordYear: "2004",
    dates: "Sep 4-6", raceDate: "2026-09-06T15:00:00", status: "upcoming",
  },
  {
    round: 14, name: "Azerbaijan", officialName: "Azerbaijan Grand Prix", country: "Azerbaijan", countryCode: "AZ", flag: "🇦🇿",
    circuit: "Baku City Circuit", city: "Baku", laps: 51, distance: "306.049 km",
    lapRecord: "1:43.009", lapRecordHolder: "C. Leclerc", lapRecordYear: "2019",
    dates: "Sep 18-20", raceDate: "2026-09-20T14:00:00", status: "upcoming",
  },
  {
    round: 15, name: "Singapore", officialName: "Singapore Grand Prix", country: "Singapore", countryCode: "SG", flag: "🇸🇬",
    circuit: "Marina Bay Street Circuit", city: "Marina Bay", laps: 62, distance: "306.143 km",
    lapRecord: "1:35.867", lapRecordHolder: "L. Hamilton", lapRecordYear: "2023",
    dates: "Oct 2-4", raceDate: "2026-10-04T20:00:00", status: "upcoming",
  },
  {
    round: 16, name: "Japan", officialName: "Japanese Grand Prix", country: "Japan", countryCode: "JP", flag: "🇯🇵",
    circuit: "Suzuka International Racing Course", city: "Suzuka", laps: 53, distance: "307.471 km",
    lapRecord: "1:30.983", lapRecordHolder: "M. Verstappen", lapRecordYear: "2019",
    dates: "Oct 17-19", raceDate: "2026-10-19T06:00:00", status: "upcoming",
  },
  {
    round: 17, name: "United States", officialName: "United States Grand Prix", country: "United States", countryCode: "US", flag: "🇺🇸",
    circuit: "Circuit of the Americas", city: "Austin", laps: 56, distance: "308.405 km",
    lapRecord: "1:36.169", lapRecordHolder: "C. Leclerc", lapRecordYear: "2019",
    dates: "Oct 23-25", raceDate: "2026-10-25T20:00:00", status: "upcoming",
  },
  {
    round: 18, name: "Mexico", officialName: "Mexico City Grand Prix", country: "Mexico", countryCode: "MX", flag: "🇲🇽",
    circuit: "Autódromo Hermanos Rodríguez", city: "Mexico City", laps: 71, distance: "305.354 km",
    lapRecord: "1:17.774", lapRecordHolder: "V. Bottas", lapRecordYear: "2021",
    dates: "Nov 6-8", raceDate: "2026-11-08T20:00:00", status: "upcoming",
  },
  {
    round: 19, name: "Brazil", officialName: "São Paulo Grand Prix", country: "Brazil", countryCode: "BR", flag: "🇧🇷",
    circuit: "Autódromo José Carlos Pace", city: "Interlagos", laps: 71, distance: "305.909 km",
    lapRecord: "1:10.540", lapRecordHolder: "V. Bottas", lapRecordYear: "2018",
    dates: "Nov 13-15", raceDate: "2026-11-15T18:00:00", status: "upcoming",
  },
  {
    round: 20, name: "Las Vegas", officialName: "Las Vegas Grand Prix", country: "United States", countryCode: "US", flag: "🇺🇸",
    circuit: "Las Vegas Strip Circuit", city: "Las Vegas", laps: 50, distance: "306.183 km",
    lapRecord: "1:35.490", lapRecordHolder: "O. Piastri", lapRecordYear: "2024",
    dates: "Nov 20-22", raceDate: "2026-11-22T06:00:00", status: "upcoming",
  },
  {
    round: 21, name: "Qatar", officialName: "Qatar Grand Prix", country: "Qatar", countryCode: "QA", flag: "🇶🇦",
    circuit: "Lusail International Circuit", city: "Lusail", laps: 57, distance: "306.66 km",
    lapRecord: "1:24.319", lapRecordHolder: "M. Verstappen", lapRecordYear: "2023",
    dates: "Nov 27-29", raceDate: "2026-11-29T17:00:00", status: "upcoming",
  },
  {
    round: 22, name: "China", officialName: "Chinese Grand Prix", country: "China", countryCode: "CN", flag: "🇨🇳",
    circuit: "Shanghai International Circuit", city: "Shanghai", laps: 56, distance: "305.066 km",
    lapRecord: "1:32.238", lapRecordHolder: "M. Schumacher", lapRecordYear: "2004",
    dates: "Dec 5-7", raceDate: "2026-12-07T07:00:00", status: "upcoming",
  },
  {
    round: 23, name: "Abu Dhabi", officialName: "Abu Dhabi Grand Prix", country: "UAE", countryCode: "AE", flag: "🇦🇪",
    circuit: "Yas Marina Circuit", city: "Abu Dhabi", laps: 58, distance: "306.183 km",
    lapRecord: "1:26.103", lapRecordHolder: "M. Verstappen", lapRecordYear: "2021",
    dates: "Dec 11-13", raceDate: "2026-12-13T17:00:00", status: "upcoming",
  },
];
