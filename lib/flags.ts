// ============================================================
// Banderas como EMOJI (sin dependencias, sin CDN).
// football-data devuelve el NOMBRE en inglés del equipo, así que
// mapeamos nombre -> código ISO3 -> emoji.
// Nota: en Windows los emoji de bandera no se pintan por defecto;
// en móvil (iOS/Android) sí. El nombre del equipo siempre se muestra.
// ============================================================

// Nombre (en inglés, como lo da football-data) -> ISO3
export const NAME_TO_CODE: Record<string, string> = {
  Argentina: "ARG", Australia: "AUS", Austria: "AUT", Belgium: "BEL",
  Bolivia: "BOL", Brazil: "BRA", Cameroon: "CMR", Canada: "CAN",
  Chile: "CHI", Colombia: "COL", "Costa Rica": "CRC", Croatia: "CRO",
  Denmark: "DEN", Ecuador: "ECU", Egypt: "EGY", England: "ENG",
  France: "FRA", Germany: "GER", Ghana: "GHA", Iran: "IRN",
  "IR Iran": "IRN", "Ivory Coast": "CIV", "Côte d'Ivoire": "CIV",
  Italy: "ITA", Jamaica: "JAM", Japan: "JPN", "Korea Republic": "KOR",
  "South Korea": "KOR", Mali: "MLI", Mexico: "MEX", Morocco: "MAR",
  Netherlands: "NED", "New Zealand": "NZL", Nigeria: "NGA", Norway: "NOR",
  Panama: "PAN", Paraguay: "PAR", Peru: "PER", Poland: "POL",
  Portugal: "POR", Qatar: "QAT", "Saudi Arabia": "KSA", Senegal: "SEN",
  Serbia: "SRB", "South Africa": "RSA", Spain: "ESP", Sweden: "SWE",
  Switzerland: "SUI", Tunisia: "TUN", Turkey: "TUR", "Türkiye": "TUR",
  Ukraine: "UKR", Uruguay: "URU", "United States": "USA", USA: "USA",
  Uzbekistan: "UZB", Venezuela: "VEN", Wales: "WAL", Algeria: "ALG",
  "DR Congo": "COD", Jordan: "JOR", "Cape Verde": "CPV", Curacao: "CUW",
  Haiti: "HAI", "New Caledonia": "NCL", "Saudi Arabia ": "KSA",
};

// ISO3 -> emoji bandera
export const CODE_TO_FLAG: Record<string, string> = {
  ARG: "🇦🇷", AUS: "🇦🇺", AUT: "🇦🇹", BEL: "🇧🇪", BOL: "🇧🇴", BRA: "🇧🇷",
  CMR: "🇨🇲", CAN: "🇨🇦", CHI: "🇨🇱", COL: "🇨🇴", CRC: "🇨🇷", CRO: "🇭🇷",
  DEN: "🇩🇰", ECU: "🇪🇨", EGY: "🇪🇬", ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", FRA: "🇫🇷", GER: "🇩🇪",
  GHA: "🇬🇭", IRN: "🇮🇷", CIV: "🇨🇮", ITA: "🇮🇹", JAM: "🇯🇲", JPN: "🇯🇵",
  KOR: "🇰🇷", MLI: "🇲🇱", MEX: "🇲🇽", MAR: "🇲🇦", NED: "🇳🇱", NZL: "🇳🇿",
  NGA: "🇳🇬", NOR: "🇳🇴", PAN: "🇵🇦", PAR: "🇵🇾", PER: "🇵🇪", POL: "🇵🇱",
  POR: "🇵🇹", QAT: "🇶🇦", KSA: "🇸🇦", SEN: "🇸🇳", SRB: "🇷🇸", RSA: "🇿🇦",
  ESP: "🇪🇸", SWE: "🇸🇪", SUI: "🇨🇭", TUN: "🇹🇳", TUR: "🇹🇷", UKR: "🇺🇦",
  URU: "🇺🇾", USA: "🇺🇸", UZB: "🇺🇿", VEN: "🇻🇪", WAL: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", ALG: "🇩🇿",
  COD: "🇨🇩", JOR: "🇯🇴", CPV: "🇨🇻", CUW: "🇨🇼", HAI: "🇭🇹", NCL: "🇳🇨",
};

// Código corto para mostrar (ej. en pills de penales)
export function teamCode(name: string): string {
  return NAME_TO_CODE[name] ?? name.slice(0, 3).toUpperCase();
}

// Acepta nombre completo o código ISO3.
export function flag(nameOrCode: string): string {
  const code = NAME_TO_CODE[nameOrCode] ?? nameOrCode;
  return CODE_TO_FLAG[code] ?? "🏳️";
}
