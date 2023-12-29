import React, { useMemo } from "react";
import { loadDefaultJapaneseParser } from "budoux";
const parser = loadDefaultJapaneseParser();

export const useBudouX = () => {
  const parse = useMemo(() => {
    return (text: string) => {
      return parser.parse(text).map((s) => (
        <span className="inline-block" key={s}>
          {s}
        </span>
      ));
    };
  }, []);
  return {
    parse,
  };
};
