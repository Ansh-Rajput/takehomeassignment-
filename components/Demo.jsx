"use client";

import { useEffect, useState } from "react";
import { icons } from "@/constants/constant";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const { copy, linkIcon, loader, tick } = icons;

const Demo = () => {
  const [query, setQuery] = useState("");
  const [summary, setSummary] = useState("");
  const [article, setArticle] = useState({ url: "", summary: "" });
  const [allArticle, setAllArticle] = useState([]);
  const [copyed, setCopyed] = useState("");

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );
    if (articlesFromLocalStorage) {
      setAllArticle(articlesFromLocalStorage);
    }
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const target = encodeURIComponent(query?.trim());
      const res = await fetch(`https://r.jina.ai/${target}`);
      const summary = await res.text();
      setSummary(summary);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = (copyUrl) => {
    setCopyed(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopyed(false), 3000);
  };
  return (
    <section className="mt-16 w-full max-w-xl">
      <div className="flex flex-col w-full">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link_icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />
          <input
            type="url"
            name="url"
            id="url"
            placeholder="Enter a URL"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            required
            className="url_input peer"
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            ↵
          </button>
        </form>
        {/* Browse URL History */}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticle.slice(0, 5).map((item, index) => {
            return (
              <div
                key={`link-${index}`}
                onClick={() => setArticle(item)}
                className="link_card"
              >
                <div className="copy_btn" onClick={() => handleCopy(item.url)}>
                  <img
                    src={copyed === item.url ? tick : copy}
                    alt="copyIcon"
                    className="w-[40%] h-[40%] object-contain"
                  />
                </div>
                <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                  {item.url}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Diaplay Results */}

      {/* <div className="my-10 max-w-full flex justify-center items-center">
        {isSubmitting ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Well, that wasn&apos;t supposed to happen...
            <br />
            <span className="font-satoshi font-normal text-gray-700">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          summary && (
            <div className="flex flex-col gap-3 container">
              <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                Article <span className="blue_gradient">Summary</span>
              </h2>
              <div className="summary_box">
                <p className="font-inter font-medium text-sm text-gray-700">
                  {summary}
                </p>
              </div>
            </div>
          )
        )}
      </div> */}
      <Dialog open={summary} onOpenChange={() => setSummary("")}>
        <DialogContent className=" min-w-[90vw]  summary_box">
          <DialogHeader>
            <h2 className="font-satoshi font-bold text-gray-600 text-xl">
              Article <span className="blue_gradient">Summary</span>
            </h2>
          </DialogHeader>
          <pre className="font-inter font-medium text-sm max-h-[90vh] text-gray-700  overflow-y-scroll scroll-container">
            {summary}
          </pre>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Demo;
