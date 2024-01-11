"use client";

import { useFormStatus } from "react-dom";

type Props = {
  title: string;
  onClick?: () => void;
};

export default function SubmitButton(props: Props) {
  const { pending } = useFormStatus();

  return (
    <>
      {props.onClick ? (
        <>
          {pending ? (
            <button
              type="submit"
              disabled
              className="bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              {props.title}
            </button>
          ) : (
            <button
              onClick={() => props.onClick}
              type="submit"
              className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded"
            >
              {props.title}
            </button>
          )}
        </>
      ) : (
        <>
          {pending ? (
            <button
              type="submit"
              disabled
              className="bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              {props.title}
            </button>
          ) : (
            <button
              type="submit"
              className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded"
            >
              {props.title}
            </button>
          )}
        </>
      )}
    </>
  );
}
