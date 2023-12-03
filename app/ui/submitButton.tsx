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
        <button
          onClick={() => props.onClick}
          type="submit"
          aria-disabled={pending}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {props.title}
        </button>
      ) : (
        <button
          type="submit"
          aria-disabled={pending}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {props.title}
        </button>
      )}
    </>
  );
}
