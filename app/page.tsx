import Feed from "@/components/Feed";

const Home = () => {
  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        Discover & Save
        <br className="max-md:hidden" />
        <span className="orange_gradient text-center">
          AI-Powered Web Summaries
        </span>
      </h1>
      <p className="desc text-center">
        Link Saver is an AI-powered tool that helps you capture, summarize, and
        save useful web content. Simply paste any link to generate a concise
        summary and store personalized notes for future reference.
      </p>
      <Feed />
    </section>
  );
};

export default Home;
