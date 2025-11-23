export function parseDate(input) {
  if (typeof input !== "string" || input.trim().length === 0) {
    return undefined;
  }
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return date;
}

export function parseStringArray(input) {
  if (Array.isArray(input)) {
    return input
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter((value) => value.length > 0);
  }
  if (typeof input === "string") {
    return input
      .split(",")
      .map((value) => value.trim())
      .filter((value) => value.length > 0);
  }
  return [];
}


