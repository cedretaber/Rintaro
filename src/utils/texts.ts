import { Line } from "../domains/mod";

export function parseLine(text_: string): Line {
  const text = text_.replace(/(\n|\r\n|\r)$/u, "");
  const commentMatch = /^((?:[^#'"]|"[^"]*"|'[^']*')*)(#.*)?$/u.exec(text);
  if (commentMatch) {
    const code = commentMatch[1];
    if (code.length === 0) {
      return text;
    } else {
      const matched = /^([^:]+:\d+)\s+"(.*)"$/u.exec(code.trim());
      if (matched) {
        const key = matched[1];
        const value = matched[2].replaceAll("\\n", "\n");
        const comment = commentMatch[2] || "";
        return { key, value, comment };
      } else {
        return text;
      }
    }
  } else {
    return text;
  }
}

export function transformLocalisationYmlStyle(text: string): string {
  return `"${text.replaceAll("\n", "\\n")}"`;
}
