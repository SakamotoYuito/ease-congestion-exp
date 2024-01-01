"use client";

import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Link from "next/link";

type Spots = {
  title: string;
  content: string;
  place?: string;
  link?: string;
  process: string[];
  caution: string[];
  condition: string[];
};

type Props = {
  spotInfo: Spots;
  thema: string;
  textColor: string;
};

export default function DetailCardComponent({
  spotInfo,
  thema,
  textColor,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card border="success" bg={thema} text={textColor} className="w-full">
      <Card.Header className="text-sm font-bold p-1">
        {spotInfo.title}
      </Card.Header>
      <Card.Body className="p-1">
        <blockquote className="blockquote mb-0">
          <p className="text-xs mb-0 ml-2 font-bold">手順:</p>
          <div className="mb-2">
            {spotInfo.process.map((process, index) => (
              <p key={index} className="text-xs mb-0 ml-3">
                {`${index + 1}. ${process}`}
              </p>
            ))}
          </div>
          {isExpanded && (
            <>
              <p className="text-xs mb-0 ml-2 font-bold">付与条件:</p>
              <div className="mb-2">
                {spotInfo.condition.map((condition, index) => (
                  <p key={index} className="text-xs mb-0 ml-3">
                    {condition}
                  </p>
                ))}
              </div>
            </>
          )}
          <footer>
            <div className="flex justify-between">
              {spotInfo.place && (
                <span className="text-xs font-bold ml-2">
                  場所: <cite>{spotInfo.place}</cite>
                </span>
              )}
              <button
                className="text-xs underline"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "付与条件を隠す" : "付与条件を表示"}
              </button>
            </div>
          </footer>
          {spotInfo.link && (
            <div className="flex justify-center items-center mt-3">
              <Link href={spotInfo.link || "/"}>
                <button className="text-lg bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-lg m-2">
                  イベントに参加
                </button>
              </Link>
            </div>
          )}
        </blockquote>
      </Card.Body>
    </Card>
  );
}
