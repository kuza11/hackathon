export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Input content="Location" buttonContent="Calculate" />
      <Graph />
      <Input content="Number of panels" buttonContent="Show statistics" />
    </main>
  );
}

function Input({ content, buttonContent }) {
  return (
    <>
      <input
        className="rounded-lg border-2 border-slate-400 bg-slate-100 px-1 text-slate-400"
        placeholder={content}
      />
      <button className="rounded-lg border-2 border-slate-400 bg-slate-200 px-1">
        {buttonContent}
      </button>
    </>
  );
}

function Graph() {
  return <p>Graph</p>;
}
