import { useFormStatus } from "react-dom";

export default function SubmitButton(props: { title: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {props.title}
    </button>
  );
}
