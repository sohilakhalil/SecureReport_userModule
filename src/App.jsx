import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/home";
import Report from "./pages/Report";
import TrackReportPage from "./pages/Track";

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Header />

        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<Report />} />
            <Route path="/track" element={<TrackReportPage />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
