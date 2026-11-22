
import { useState } from "react";
import {
  Link2,
  Zap,
  ShieldCheck,
  BarChart3,
  Copy,
  Check,
  ArrowUpRight,
  MousePointerClick
} from "lucide-react";
import "./App.css";

function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleShorten = async (e) => {
    e.preventDefault();

    if (!originalUrl.trim()) {
      setError("Please enter a URL first.");
      return;
    }

    setLoading(true);
    setError("");
    setShortUrl("");

    try {
      const response = await fetch("http://localhost:5000/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ originalUrl })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setShortUrl(data.shortUrl);
    } catch (err) {
      setError(
        err.message.includes("Failed to fetch")
          ? "Unable to connect to the server. Please check your backend."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Unable to copy the link. Please copy it manually.");
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <a href="/" className="logo">
          <span className="logo-icon">
            <Link2 size={22} />
          </span>
          <span>snip<span className="logo-dot">.</span></span>
        </a>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
        </div>

        <a href="#shortener" className="nav-button">
          Get started <ArrowUpRight size={16} />
        </a>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-badge">
            <Zap size={14} />
            SIMPLE. FAST. SHORT.
          </div>

          <h1>
            Long links?
            <br />
            <span>Make them</span> short.
          </h1>

          <p className="hero-description">
            Turn long, messy URLs into clean, shareable links.
            Less clutter, more connection.
          </p>

          <div className="shortener-box" id="shortener">
            <form onSubmit={handleShorten}>
              <div className="input-wrapper">
                <Link2 size={20} />
                <input
                  type="url"
                  placeholder="Paste your long URL here..."
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  required
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Shortening..." : "Shorten URL"}
                {!loading && <ArrowUpRight size={18} />}
              </button>
            </form>

            {error && <p className="error-message">{error}</p>}

            {shortUrl && (
              <div className="result-box">
                <div>
                  <span className="result-label">YOUR SHORT LINK</span>
                  <a href={shortUrl} target="_blank" rel="noreferrer">
                    {shortUrl}
                  </a>
                </div>

                <button className="copy-button" onClick={handleCopy}>
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            )}
          </div>

          <div className="hero-note">
            <ShieldCheck size={16} />
            Free to use. No sign-up required.
          </div>

          <div className="hero-decoration">
            <div className="decoration-circle circle-one"></div>
            <div className="decoration-circle circle-two"></div>
          </div>
        </section>

        <section className="features" id="features">
          <div className="section-heading">
            <span>WHY SNIP?</span>
            <h2>Small links. Big impact.</h2>
            <p>Everything you need to make sharing easier.</p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Zap size={22} />
              </div>
              <h3>Lightning fast</h3>
              <p>
                Create short links in seconds and share them anywhere.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <ShieldCheck size={22} />
              </div>
              <h3>Simple & reliable</h3>
              <p>
                Your original links stay accessible through your short URLs.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <BarChart3 size={22} />
              </div>
              <h3>Track clicks</h3>
              <p>
                Keep track of how many times your shortened links are visited.
              </p>
            </div>
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <span>THREE SIMPLE STEPS</span>
          <h2>How it works</h2>

          <div className="steps-grid">
            <div className="step">
              <span>01</span>
              <MousePointerClick size={25} />
              <h3>Paste your link</h3>
              <p>Copy your long URL and paste it into the input box.</p>
            </div>

            <div className="step">
              <span>02</span>
              <Zap size={25} />
              <h3>Generate</h3>
              <p>Let Snip create a shorter version of your link.</p>
            </div>

            <div className="step">
              <span>03</span>
              <Copy size={25} />
              <h3>Copy & share</h3>
              <p>Copy your new link and share it with anyone.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a href="/" className="logo">
          <span className="logo-icon">
            <Link2 size={19} />
          </span>
          <span>snip<span className="logo-dot">.</span></span>
        </a>
        <p>Make every character count.</p>
        <span>© 2026 Snip. All rights reserved.</span>
      </footer>
    </div>
  );
}

export default App;
