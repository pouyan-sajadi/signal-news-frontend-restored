
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog"

export function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <div className="container flex h-14 items-center justify-between">
        <p className="text-sm text-muted-foreground">
          The Signal: Your AI-powered news analyst.
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link">About The Signal</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>About The Signal</DialogTitle>
              <DialogDescription>
                The Signal cuts through the noise. We use a team of AI agents to read the news, analyze sources, and write a comprehensive report on any topic you choose. No more bias, no more endless scrolling—just the clear, synthesized information you need.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </footer>
  )
}
