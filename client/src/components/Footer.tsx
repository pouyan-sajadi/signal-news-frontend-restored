
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t mt-12 py-8">
      <div className="container flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground space-y-4 md:space-y-0">
        <div>
          <p>&copy; {new Date().getFullYear()} The Signal. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:underline">Terms of Service</Link>
          <a href="mailto:pouyan.sajadi@gmail.com" className="hover:underline">Contact</a>
        </div>
      </div>
    </footer>
  )
}
