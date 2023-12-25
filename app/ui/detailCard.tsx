"use client";

import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Link from "next/link";

type Spots = {
  title: string;
  content: string;
  place?: string;
  link?: string;
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
  const [displayContent, setDisplayContent] = useState(spotInfo.content);

  useEffect(() => {
    if (spotInfo.content.length > 20 && !isExpanded) {
      setDisplayContent(`${spotInfo.content.substring(0, 20)}...`);
    } else {
      setDisplayContent(spotInfo.content);
    }
  }, [spotInfo.content, isExpanded]);
  return (
    <Card border="success" bg={thema} text={textColor} className="w-full">
      <Card.Header className="text-sm font-bold p-2">
        {spotInfo.title}
      </Card.Header>
      <Card.Body className="p-2">
        <blockquote className="blockquote mb-0">
          <p className="text-sm"> {displayContent} </p>
          <footer>
            <div className="flex justify-between">
              {spotInfo.place && (
                <span className="text-sm">
                  --場所: <cite>{spotInfo.place}</cite>
                </span>
              )}
              {spotInfo.content.length > 20 && (
                <button
                  className="text-sm underline"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? "詳細を隠す" : "詳細を表示"}
                </button>
              )}
            </div>
          </footer>
          {spotInfo.link && (
            <div className="flex justify-center items-center mt-3">
              <Link href={spotInfo.link || "/"}>
                <button className="text-lg bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg m-2">
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
