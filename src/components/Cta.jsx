import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="cta-section py-5 text-center">
      <div className="container">
        <h2 className="cta-heading">ابدأ بالبلاغ الآن</h2>
        <p className="cta-subtitle">
          سهّل علينا استقبال بلاغك وسنقوم بمعالجته بسرية تامة وبأقصى سرعة
        </p>
        <Link to="/report" className="cta-button mt-3">
          قدّم بلاغك
        </Link>
      </div>
    </section>
  );
}

export default CTA;
