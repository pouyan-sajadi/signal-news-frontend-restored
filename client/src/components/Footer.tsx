
import { Link } from "react-router-dom";
import { Button } from "./ui/button"
import { useState } from "react";

export function Footer() {
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  return (
    <footer className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t mt-12 py-8">
      <div className="container flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground space-y-4 md:space-y-0">
        <div>
          <p>&copy; {new Date().getFullYear()} The Signal. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Button variant="link" onClick={() => setIsAboutExpanded(!isAboutExpanded)} className="p-0 h-auto text-muted-foreground">
            About
          </Button>
          <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:underline">Terms of Service</Link>
          <a href="mailto:pouyan.sajadi@gmail.com" className="hover:underline">Contact</a>
        </div>
      </div>
      {isAboutExpanded && (
        <div className="container mt-8 text-muted-foreground text-center max-w-2xl mx-auto animate-fade-in">
          <h3 className="text-lg font-semibold mb-2">Our Story</h3>
          <p className="mb-4">
            The Signal was born out of a personal frustration with information overload and the challenge of finding unbiased, comprehensive insights in the fast-paced tech world. I realized that while data was abundant, true understanding was scarce.
          </p>
          <p className="mb-4">
            Leveraging the incredible power of LLMs and multi-agent systems, I set out to build a tool that could cut through the noise. The agents act as specialized analysts, working together to search, profile, synthesize, and edit information, delivering nuanced reports in seconds.
          </p>
          <p>
            This project is built with passion, driven by the desire to make complex information accessible, and constantly evolving with the latest advancements in AI and agent technology.
          </p>
        </div>
      )}
    </footer>
  )
}
