import { useFormStatus } from "react-dom";

export default function SubmitButton(props: { title: string }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" aria-disabled={pending}>
      {props.title}
    </button>
  );
}
