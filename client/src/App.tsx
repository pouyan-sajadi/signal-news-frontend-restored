import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { LayoutWithSidebar } from "./components/LayoutWithSidebar"
import { HomePage } from "./pages/HomePage"
import { ReportPage } from "./pages/ReportPage"
import { BlankPage } from "./pages/BlankPage"
import { useState } from "react"

function App() {
  const [reportCount, setReportCount] = useState(0);

  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<LayoutWithSidebar reportCount={reportCount} setReportCount={setReportCount} />}>
            <Route index element={<HomePage />} />
            <Route path="/report/:id" element={<ReportPage />} />
          </Route>
          <Route path="*" element={<BlankPage />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  )
}

export default App