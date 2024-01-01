import React, { useMemo, useEffect, useState } from "react";
import type { HTMLProcessingParser } from "budoux";

export const useBudouX = () => {
  const [parser, setParser] = useState<HTMLProcessingParser | null>(null);

  useEffect(() => {
    const loadParser = async () => {
      const { loadDefaultJapaneseParser } = await import("budoux");
      const parser = loadDefaultJapaneseParser();
      setParser(parser);
    };

    loadParser();
  }, []);

  const parse = useMemo(() => {
    if (!parser) return null;

    return (text: string) => {
      return parser.parse(text).map((s) => (
        <span className="inline-block" key={s}>
          {s}
        </span>
      ));
    };
  }, [parser]);

  return {
    parse,
  };
};
