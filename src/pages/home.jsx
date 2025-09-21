import Header from "../components/Header";
import Landing from "../components/Landing";
import Services from "../components/Services";
import Works from "../components/Works";
import Stats from "../components/Stats";
import FAQ from "../components/FAQ";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import "../styles/user.css";

function App() {
  return (
    <>
      <Landing />
      <Services />
      <Works />
      <Stats />
      <FAQ />
      <CTA />
    </>
  );
}

export default App;
