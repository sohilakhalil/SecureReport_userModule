import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing pt-5">
      <div className="landing-wrapper d-flex justify-content-between text-center">
        <div className="info">
          <h1>بلّغ عن جريمة بسرية تامة</h1>
          <p>
            منصتنا توفر لك وسيلة آمنة وسهلة للتبليغ عن أي نشاط مشبوه أو جريمة
            دون الحاجة للكشف عن هويتك. نضمن سرية معلوماتك ونعمل مع الجهات
            المختصة للحفاظ على مجتمع أكثر أمانًا.
          </p>
          <div className="go-to d-flex mt-5">
            <Link to="/report" className="btn cta-button ms-2 fw-bold">
              بلّغ الآن <i className="fa-solid fa-arrow-left me-2"></i>
            </Link>
            <Link to="/track" className="btn btn-primary rounded-pill">
              تابع بلاغك <i className="fa-solid fa-magnifying-glass me-2"></i>
            </Link>
          </div>
        </div>
        <img
          src="src/assets/landing2.png"
          className="img-fluid"
          alt="landing image"
        />
      </div>
    </div>
  );
}

export default Landing;
