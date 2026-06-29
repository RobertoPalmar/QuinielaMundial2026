// ============================================================
// Banderas con flag-icons (SVG/CSS empaquetado, sin CDN).
// Se renderizan en todos los sistemas (incl. Windows), a diferencia
// de los emoji de bandera. football-data da el NOMBRE en inglés.
// Devolvemos el código para la clase `fi fi-<code>`.
// ============================================================

// Nombre (inglés, como lo da football-data) -> código flag-icons (ISO2 / subdivisión)
export const NAME_TO_ISO2: Record<string, string> = {
  Argentina: "ar", Australia: "au", Austria: "at", Belgium: "be",
  Bolivia: "bo", Brazil: "br", Cameroon: "cm", Canada: "ca",
  Chile: "cl", Colombia: "co", "Costa Rica": "cr", Croatia: "hr",
  Denmark: "dk", Ecuador: "ec", Egypt: "eg", England: "gb-eng",
  France: "fr", Germany: "de", Ghana: "gh", Iran: "ir", "IR Iran": "ir",
  "Ivory Coast": "ci", "Côte d'Ivoire": "ci", Italy: "it", Jamaica: "jm",
  Japan: "jp", "Korea Republic": "kr", "South Korea": "kr", Mali: "ml",
  Mexico: "mx", Morocco: "ma", Netherlands: "nl", "New Zealand": "nz",
  Nigeria: "ng", Norway: "no", Panama: "pa", Paraguay: "py", Peru: "pe",
  Poland: "pl", Portugal: "pt", Qatar: "qa", "Saudi Arabia": "sa",
  Senegal: "sn", Serbia: "rs", "South Africa": "za", Spain: "es",
  Sweden: "se", Switzerland: "ch", Tunisia: "tn", Turkey: "tr",
  "Türkiye": "tr", Ukraine: "ua", Uruguay: "uy", "United States": "us",
  USA: "us", Uzbekistan: "uz", Venezuela: "ve", Wales: "gb-wls",
  Scotland: "gb-sct", Algeria: "dz", "DR Congo": "cd", Jordan: "jo",
  "Cape Verde": "cv", "Cabo Verde": "cv", Curacao: "cw", "Curaçao": "cw",
  Haiti: "ht", "New Caledonia": "nc", Greece: "gr", Romania: "ro",
};

// Nombre -> ISO3 corto para mostrar como etiqueta (ej. pills de penales)
export const NAME_TO_CODE: Record<string, string> = {
  Argentina: "ARG", Australia: "AUS", Austria: "AUT", Belgium: "BEL",
  Bolivia: "BOL", Brazil: "BRA", Cameroon: "CMR", Canada: "CAN",
  Chile: "CHI", Colombia: "COL", "Costa Rica": "CRC", Croatia: "CRO",
  Denmark: "DEN", Ecuador: "ECU", Egypt: "EGY", England: "ENG",
  France: "FRA", Germany: "GER", Ghana: "GHA", Iran: "IRN",
  "Ivory Coast": "CIV", Italy: "ITA", Jamaica: "JAM", Japan: "JPN",
  "South Korea": "KOR", "Korea Republic": "KOR", Mali: "MLI", Mexico: "MEX",
  Morocco: "MAR", Netherlands: "NED", "New Zealand": "NZL", Nigeria: "NGA",
  Norway: "NOR", Panama: "PAN", Paraguay: "PAR", Peru: "PER", Poland: "POL",
  Portugal: "POR", Qatar: "QAT", "Saudi Arabia": "KSA", Senegal: "SEN",
  Serbia: "SRB", "South Africa": "RSA", Spain: "ESP", Sweden: "SWE",
  Switzerland: "SUI", Tunisia: "TUN", Turkey: "TUR", Ukraine: "UKR",
  Uruguay: "URU", "United States": "USA", USA: "USA", Uzbekistan: "UZB",
  Venezuela: "VEN", Wales: "WAL", Algeria: "ALG", "DR Congo": "COD",
  Jordan: "JOR", "Cape Verde": "CPV", Curacao: "CUW", Haiti: "HAI",
  "New Caledonia": "NCL",
};

// Nombre en inglés (como lo da la API) -> nombre en español (solo display)
export const NAME_ES: Record<string, string> = {
  Argentina: "Argentina", Australia: "Australia", Austria: "Austria",
  Belgium: "Bélgica", Bolivia: "Bolivia", Brazil: "Brasil",
  Cameroon: "Camerún", Canada: "Canadá", Chile: "Chile", Colombia: "Colombia",
  "Costa Rica": "Costa Rica", Croatia: "Croacia", Denmark: "Dinamarca",
  Ecuador: "Ecuador", Egypt: "Egipto", England: "Inglaterra", France: "Francia",
  Germany: "Alemania", Ghana: "Ghana", Iran: "Irán", "IR Iran": "Irán",
  "Ivory Coast": "Costa de Marfil", "Côte d'Ivoire": "Costa de Marfil",
  Italy: "Italia", Jamaica: "Jamaica", Japan: "Japón",
  "South Korea": "Corea del Sur", "Korea Republic": "Corea del Sur",
  Mali: "Malí", Mexico: "México", Morocco: "Marruecos", Netherlands: "Países Bajos",
  "New Zealand": "Nueva Zelanda", Nigeria: "Nigeria", Norway: "Noruega",
  Panama: "Panamá", Paraguay: "Paraguay", Peru: "Perú", Poland: "Polonia",
  Portugal: "Portugal", Qatar: "Catar", "Saudi Arabia": "Arabia Saudita",
  Senegal: "Senegal", Serbia: "Serbia", "South Africa": "Sudáfrica",
  Spain: "España", Sweden: "Suecia", Switzerland: "Suiza", Tunisia: "Túnez",
  Turkey: "Turquía", "Türkiye": "Turquía", Ukraine: "Ucrania", Uruguay: "Uruguay",
  "United States": "Estados Unidos", USA: "Estados Unidos", Uzbekistan: "Uzbekistán",
  Venezuela: "Venezuela", Wales: "Gales", Scotland: "Escocia", Algeria: "Argelia",
  "DR Congo": "RD Congo", Jordan: "Jordania", "Cape Verde": "Cabo Verde",
  "Cabo Verde": "Cabo Verde", Curacao: "Curazao", "Curaçao": "Curazao",
  Haiti: "Haití", "New Caledonia": "Nueva Caledonia", Greece: "Grecia",
  Romania: "Rumania", "Por definir": "Por definir",
};

// Nombre para mostrar en español. Fallback: el mismo nombre.
export function teamES(name: string): string {
  return NAME_ES[name] ?? name;
}

// Etiqueta corta (3 letras). Fallback: primeras 3 letras del nombre.
export function teamCode(name: string): string {
  return NAME_TO_CODE[name] ?? name.slice(0, 3).toUpperCase();
}

// Código flag-icons para la clase `fi fi-<code>`. "" si no hay match.
export function flagCode(name: string): string {
  return NAME_TO_ISO2[name] ?? "";
}
