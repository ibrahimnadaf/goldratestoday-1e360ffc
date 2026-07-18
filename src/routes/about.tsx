
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">

      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold text-yellow-600">
          About GoldRatesToday.in
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
          GoldRatesToday.in provides accurate, reliable and regularly updated
          gold and silver prices for India and international markets including
          Dubai, UAE, Kuwait, the United States and the United Kingdom.
        </p>
      </section>

      {/* Mission */}
      <section className="grid md:grid-cols-2 gap-8 mb-12">

        <div className="rounded-2xl shadow-lg border p-8">
          <h2 className="text-2xl font-bold mb-4">
            🎯 Our Mission
          </h2>

          <p className="text-gray-600 leading-8">
            Our mission is to make gold price information simple,
            transparent and accessible for everyone. Whether you're
            purchasing jewellery, investing in gold, comparing rates or
            tracking market trends, we provide trustworthy information
            that helps you make informed decisions.
          </p>
        </div>

        <div className="rounded-2xl shadow-lg border p-8">
          <h2 className="text-2xl font-bold mb-4">
            👁️ Our Vision
          </h2>

          <p className="text-gray-600 leading-8">
            To become India's most trusted destination for live gold
            prices, silver prices, investment tools, financial news,
            calculators and precious metals market insights.
          </p>
        </div>

      </section>

      {/* Features */}

      <section className="mb-16">

        <h2 className="text-3xl font-bold text-center mb-10">
          Why Choose GoldRatesToday.in?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {[
            "Live Gold Prices",
            "Live Silver Prices",
            "City-wise Gold Rates",
            "International Gold Prices",
            "Gold Price Calculator",
            "Gold Loan Calculator",
            "Historical Price Charts",
            "Investment Guides",
            "Daily Market News",
            "Fast & Mobile Friendly",
            "SEO Optimized",
            "Free to Use",
          ].map((item) => (
            <div
              key={item}
              className="border rounded-xl p-6 shadow hover:shadow-xl transition"
            >
              <h3 className="font-semibold text-lg">
                ✓ {item}
              </h3>
            </div>
          ))}

        </div>

      </section>

      {/* Data Sources */}

      <section className="bg-gray-50 rounded-2xl p-10 mb-12">

        <h2 className="text-3xl font-bold mb-6">
          Our Data Sources
        </h2>

        <p className="text-gray-600 leading-8">
          We collect gold and silver pricing information from trusted
          international precious metal markets, financial data providers,
          bullion exchanges and local jewellery market references.
          Prices are updated regularly to provide the most accurate
          information possible.
        </p>

      </section>

      {/* Disclaimer */}

      <section className="rounded-2xl border p-10 mb-12">

        <h2 className="text-3xl font-bold mb-6">
          Disclaimer
        </h2>

        <p className="text-gray-600 leading-8">
          The prices displayed on GoldRatesToday.in are intended for
          informational purposes only. Actual gold and silver prices may
          vary depending on city, jeweller, taxes, making charges,
          purity and market conditions. Please verify rates with your
          local jeweller before making any purchase or investment
          decisions.
        </p>

      </section>

      {/* Contact */}

      <section className="text-center rounded-2xl bg-yellow-500 text-white p-12">

        <h2 className="text-4xl font-bold mb-4">
          Stay Updated
        </h2>

        <p className="text-lg">
          Follow GoldRatesToday.in for live gold prices, silver prices,
          financial news, investment insights and powerful gold tools.
        </p>

      </section>

    </main>
  );
}
