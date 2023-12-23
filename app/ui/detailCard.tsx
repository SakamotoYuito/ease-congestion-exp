"use client";

import Card from "react-bootstrap/Card";

type Props = {
  title: string;
  content: string;
  place: string;
};

export default function DetailCardComponent({ title, content, place }: Props) {
  return (
    <Card border="success" bg="dark" className="w-full text-left text-white">
      <Card.Header className="text-sm font-bold p-2">{title}</Card.Header>
      <Card.Body className="p-2">
        <blockquote className="blockquote mb-0">
          <p className="text-sm"> {content} </p>
          <footer className="blockquote-footer">
            <span className="text-sm">
              場所: <cite>{place}</cite>
            </span>
          </footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}
