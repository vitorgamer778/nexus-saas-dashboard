export function safeCsvCell(value: string | number) {
  let text = String(value);
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}

export function createCsv(rows: (string | number)[][]) {
  return (
    "\uFEFF" + rows.map((row) => row.map(safeCsvCell).join(",")).join("\r\n")
  );
}
