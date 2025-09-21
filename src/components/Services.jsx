function Services() {
  return (
    <div className="services text-center" id="services">
      <div className="container">
        <h2 className="special-heading">خدماتنا</h2>
        <div className="row text-center pt-5 g-4">
          <div className="col-lg-3 col-md-6">
            <div className="feat">
              <i className="fa-solid fa-lock"></i>
              <h2>سرية كاملة</h2>
              <p>
                نضمن خصوصية بياناتك 100%، كل بلاغ بيتسجل في نظام آمن ومش بيوصل
                لأي طرف غير الجهة المختصة.
              </p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="feat">
              <i className="fa-solid fa-bolt"></i>
              <h2>سهولة الاستخدام</h2>
              <p>
                واجهة بسيطة وسريعة، تقدر تبلغ بخطوة واحدة من غير أي تعقيد أو
                أوراق.
              </p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="feat">
              <i className="fa-solid fa-envelope-open-text"></i>
              <h2>استجابة فورية</h2>
              <p>
                فريق الدعم بيتابع البلاغ لحظة بلحظة، والجهات المختصة بتوصلك أسرع
                رد.
              </p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="feat">
              <i className="fa-solid fa-chart-line"></i>
              <h2>متابعة وشفافية</h2>
              <p>تقدر تتابع حالة بلاغك وتشوف آخر التحديثات لحد ما يتم حله.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Services;
