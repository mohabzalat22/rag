import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Hotel, Car, Search, Sparkles, Globe, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container px-4 md:px-8 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Travel Solutions
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Find Your Perfect Stay or Ride with{" "}
              <span className="text-primary">Morag</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your intelligent RAG system that connects multiple alternatives to
              get you the best hotel reservations and car rentals in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="container px-4 md:px-8 py-20 bg-muted/50"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">
                Why Choose Morag?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience the future of travel booking with our intelligent
                system
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background rounded-lg p-6 space-y-4 border">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Hotel className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Hotel Reservations</h3>
                <p className="text-muted-foreground">
                  Access thousands of hotels worldwide and find the perfect
                  accommodation for your journey.
                </p>
              </div>
              <div className="bg-background rounded-lg p-6 space-y-4 border">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Car className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Car Rentals</h3>
                <p className="text-muted-foreground">
                  Compare and book from multiple car rental services to get the
                  best deals and options.
                </p>
              </div>
              <div className="bg-background rounded-lg p-6 space-y-4 border">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Smart Search</h3>
                <p className="text-muted-foreground">
                  Our RAG system intelligently searches across multiple
                  platforms to find you the best options.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="container px-4 md:px-8 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get your perfect booking in three simple steps
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4 text-center">
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                  1
                </div>
                <h3 className="text-xl font-semibold">Tell Us What You Need</h3>
                <p className="text-muted-foreground">
                  Simply describe your travel requirements - destination, dates,
                  and preferences.
                </p>
              </div>
              <div className="space-y-4 text-center">
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                  2
                </div>
                <h3 className="text-xl font-semibold">AI Searches For You</h3>
                <p className="text-muted-foreground">
                  Our RAG system searches multiple platforms and compares all
                  available options.
                </p>
              </div>
              <div className="space-y-4 text-center">
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                  3
                </div>
                <h3 className="text-xl font-semibold">Book Instantly</h3>
                <p className="text-muted-foreground">
                  Review curated options and complete your booking with
                  confidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          className="container px-4 md:px-8 py-20 bg-muted/50"
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">About Morag</h2>
              <p className="text-lg text-muted-foreground">
                Morag is an intelligent RAG (Retrieval-Augmented Generation)
                system designed to revolutionize how you book travel
                accommodations. By connecting to multiple hotel and car rental
                platforms, we provide you with comprehensive options and
                competitive pricing, all through a simple, intuitive interface.
              </p>
              <div className="grid md:grid-cols-3 gap-6 pt-8">
                <div className="space-y-2">
                  <Globe className="w-8 h-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Global Coverage</h3>
                  <p className="text-sm text-muted-foreground">
                    Access to worldwide travel services
                  </p>
                </div>
                <div className="space-y-2">
                  <Clock className="w-8 h-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Real-Time Results</h3>
                  <p className="text-sm text-muted-foreground">
                    Instant availability and pricing updates
                  </p>
                </div>
                <div className="space-y-2">
                  <Sparkles className="w-8 h-8 text-primary mx-auto" />
                  <h3 className="font-semibold">AI-Powered</h3>
                  <p className="text-sm text-muted-foreground">
                    Smart recommendations tailored to you
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container px-4 md:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8 bg-primary text-primary-foreground rounded-2xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Transform Your Travel Planning?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Join thousands of travelers who trust Morag to find their perfect
              accommodations and rentals.
            </p>
            <Link href="/sign-up">
              <Button size="lg" variant="secondary" className="font-semibold">
                Get Started Now - It&apos;s Free
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
