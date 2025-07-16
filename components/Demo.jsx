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
import { createClient } from "@/lib/supabase/client";
import { getFaviconFromUrl } from "@/lib/utils";

const { copy, linkIcon, loader, tick } = icons;

const Demo = () => {
  const [query, setQuery] = useState("");
  const [summary, setSummary] = useState("");
  const [history, setHistory] = useState([]);
  const [isLodingHistory, setIsLodingHistory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [article, setArticle] = useState({ url: "", summary: "" });
  const [allArticle, setAllArticle] = useState([]);
  const [copyed, setCopyed] = useState("");

  const getHistory = async () => {
    try {
      setIsLodingHistory(true);
      const response = await fetch("/api/posts", {
        method: "GET",
      });

      const history = await response?.json();
      setHistory(history?.posts || []);
      return history;
    } catch (error) {
      console.log(error);
      return [];
    } finally {
      setIsLodingHistory(false);
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const target = encodeURIComponent(query?.split(":")?.[1]?.trim());
      // const res = await fetch(`https://r.jina.ai/${target}`);
      // const summary = await res.text();
      const summary = "somthing";

      if (summary) {
        const response = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: target,
            favicon: getFaviconFromUrl(query),
            summary,
          }),
        });

        setSummary(summary);
      }
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
      <div className="flex flex-col w-full gap-2">
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
        <div className="flex flex-col gap-1 max-h-96 overflow-y-scroll scroll-container">
          {history?.map((item, index) => {
            return (
              <div
                key={`link-${index}`}
                onClick={() => setSummary(item?.summary)}
                className="link_card"
              >
                <div className="copy_btn" onClick={() => handleCopy(item.url)}>
                  <img
                    src={item.favicon}
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

      <div className="my-10 max-w-full flex justify-center items-center">
        {isSubmitting && (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        )}
      </div>

      <Dialog open={summary} onOpenChange={() => setSummary("")}>
        <DialogContent className=" min-w-[90vw]  summary_box">
          <DialogHeader>
            <h2 className="font-satoshi font-bold text-gray-600 text-xl">
              URL <span className="blue_gradient">Summary</span>
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
