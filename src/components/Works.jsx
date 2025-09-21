function Works() {
  return (
    <section className="steps-section py-5" id="works">
      <div className="container">
        <h2 className="special-heading">كيف يعمل الموقع</h2>

        <div className="row text-center pt-5 g-4">
          <div className="col-lg-3 col-md-6">
            <div className="step-box">
              <div className="icon-circle">
                <i className="fa-solid fa-pen-to-square"></i>
              </div>
              <span className="step-number">1</span>
              <h2>تقديم البلاغ</h2>
              <p>
                اختر نوع البلاغ، اكتب التفاصيل، وارفق أي ملفات داعمة. لا حاجة
                لتسجيل الدخول أو ذكر أي بيانات شخصية.
              </p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="step-box">
              <div className="icon-circle">
                <i className="fa-solid fa-lock"></i>
              </div>
              <span className="step-number">2</span>
              <h2>حماية الهوية</h2>
              <p>
                يتم تشفير جميع البيانات تلقائيًا، ولا يتم تخزين أي معلومات
                تعريفية عنك.
              </p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="step-box">
              <div className="icon-circle">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <span className="step-number">3</span>
              <h2>استلام رقم تتبع</h2>
              <p>
                بعد إرسال البلاغ، تحصل على رقم خاص يمكنك استخدامه لاحقًا لمتابعة
                حالته.
              </p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="step-box">
              <div className="icon-circle">
                <i className="fa-solid fa-chart-line"></i>
              </div>
              <span className="step-number">4</span>
              <h2>مراجعة وإجراء</h2>
              <p>
                يتم مراجعة البلاغ من قبل الجهات المختصة، واتخاذ الإجراءات
                المناسبة بسرية تامة.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Works;
