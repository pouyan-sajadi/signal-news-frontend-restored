
import { Button } from "./ui/button"
import { useState } from "react";

export function Footer() {
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  return (
    <footer className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t mt-12 py-8">
      <div className="container flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground space-y-4 md:space-y-0">
        <div className="text-center">
          <p>&copy; {new Date().getFullYear()} The Signal. All rights reserved.</p>
          <p>Built with ❤️ for learning and exploration.</p>
        </div>
        <div className="md:mx-auto">
          <div className="flex justify-center">
          <Button variant="link" onClick={() => setIsAboutExpanded(!isAboutExpanded)} className="font-bold">
            About The Signal
          </Button>
        </div>
        </div>
        <div className="flex items-center space-x-4 text-center md:ml-auto">
          <p>Contact: <a href="mailto:pouyan.sajadi@gmail.com" className="hover:underline">info@example.com</a></p>
          {/* Placeholder for social media/GitHub icons */}
        </div>
      </div>
      {isAboutExpanded && (
        <div className="container mt-8 text-muted-foreground text-center max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold mb-2 text-center">Our Story</h3>
          <p className="mb-4 text-center">
            The Signal was born out of a personal frustration with information overload and the challenge of finding unbiased, comprehensive insights in the fast-paced tech world. I realized that while data was abundant, true understanding was scarce.
          </p>
          <p className="mb-4 text-center">
            Leveraging the incredible power of LLMs and multi-agent systems, I set out to build a tool that could cut through the noise. The agents act as specialized analysts, working together to search, profile, synthesize, and edit information, delivering nuanced reports in seconds.
          </p>
          <p className="text-center">
            This project is built with passion, driven by the desire to make complex information accessible, and constantly evolving with the latest advancements in AI and agent technology.
          </p>
        </div>
      )}
    </footer>
  )
}
