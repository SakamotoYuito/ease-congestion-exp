export default function TestComponent(props: {
  action: (formData: FormData) => Promise<void>;
}) {
  const { action } = props;
  return (
    <form action={action}>
      <label htmlFor="name">Name</label>
      <input type="text" name="name" id="name" />
      <button type="submit">Submit</button>
    </form>
  );
}
