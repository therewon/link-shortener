import { useEffect, useState } from "react";

type LinkItem = {
  id: number;
  original: string;
  short: string;
};

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

function App() {
  const [url, setUrl] = useState<string>("");
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const savedLinks = localStorage.getItem("shortenedLinks");
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("shortenedLinks", JSON.stringify(links));
  }, [links]);

  const handleShorten = () => {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError("Please enter a link.");
      return;
    }

    if (!isValidUrl(trimmedUrl)) {
      setError("Please enter a valid URL.");
      return;
    }

    setError("");

    const fakeShortLink = `https://sho.rt/${Math.random()
      .toString(36)
      .substring(2, 8)}`;

    const newLink: LinkItem = {
      id: Date.now(),
      original: trimmedUrl,
      short: fakeShortLink,
    };

    setLinks((prev) => [newLink, ...prev]);
    setUrl("");
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleDelete = (id: number) => {
    setLinks((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">Link Shortener</h1>
          <p className="mt-3 text-sm text-slate-400 sm:text-base">
            Paste your long URL and generate a clean short link
          </p>
        </header>

        <section className="rounded-2xl bg-slate-900 p-4 shadow-lg sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <input
              type="text"
              placeholder="Enter your URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none transition focus:border-cyan-400"
            />

            <button
              onClick={handleShorten}
              className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
            >
              Shorten
            </button>
          </div>

          {error && (
            <p className="mt-3 text-sm font-medium text-red-400">{error}</p>
          )}
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-semibold">Shortened Links</h2>

          {links.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center text-slate-400">
              No shortened links yet.
            </div>
          ) : (
            <div className="space-y-4">
              {links.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-slate-400">
                      {item.original}
                    </p>
                    <a
                      href={item.short}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block font-semibold text-cyan-400 hover:underline"
                    >
                      {item.short}
                    </a>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleCopy(item.short)}
                      className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-black transition hover:bg-emerald-400"
                    >
                      Copy
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;