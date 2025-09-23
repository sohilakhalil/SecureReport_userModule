import React, { useEffect, useState } from "react";

function TrackReport() {
  const [report, setReport] = useState(null);
  const [timeline, setTimeline] = useState([]);

  const stepMessages = {
    "تم استلام البلاغ": "تم تسجيل البلاغ لدينا",
    "قيد المراجعة": "البلاغ تحت التدقيق الآن",
    "قيد المعالجة": "الفريق يعمل على معالجة البلاغ",
    "تم الحل": "تم حل المشكلة بنجاح",
    "تم الإغلاق": "تم إغلاق البلاغ",
  };

  useEffect(() => {
    const form = document.querySelector(".track-report form");

    form.onsubmit = async function (e) {
      e.preventDefault();

      const trackingId = document.querySelector("#tracking").value;

      try {
        const res = await fetch(
          `https://salmakhalil.pythonanywhere.com/api/reports/track/${trackingId}/`
        );
        const data = await res.json();

        if (res.ok) {
          setReport(data);

          const steps = [
            "تم استلام البلاغ",
            "قيد المراجعة",
            "قيد المعالجة",
            "تم الحل",
            "تم الإغلاق",
          ];
          const activeIndex = steps.indexOf(data.case_status);

          const timelineData = steps.map((step, index) => ({
            key: step,
            label: step, // مباشرة من غير mapping
            message: stepMessages[step],
            active: index <= activeIndex,
          }));

          setTimeline(timelineData);

          document.querySelector(".track-report").classList.remove("active");
          document.querySelector(".report-timeline").classList.add("active");
        } else {
          alert(data.message || "لم يتم العثور على البلاغ");
        }
      } catch (err) {
        console.error(err);
        alert("أدخل tracking-id الصحيح");
      }
    };
  }, []);

  // دالة لتنسيق التاريخ بالعربي
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("ar-EG", options);
  };

  return (
    <main>
      <div className="tracking mt-3">
        {/* شاشة إدخال ID */}
        <div className="container track-report active">
          <h1 className="report-title">تابع بلاغك خطوة بخطوة</h1>
          <p className="report-subtitle text-black-50 ms-3 me-3">
            من خلال هذه الصفحة يمكنك متابعة حالة بلاغك خطوة بخطوة ومعرفة إذا تم
            استلامه، معالجته أو إغلاقه.
          </p>

          <div id="trackingBox" className="report-form py-3">
            <form id="trackingForm">
              <label htmlFor="tracking" className="form-label">
                أدخل ID البلاغ
              </label>
              <div className="d-flex">
                <input
                  type="text"
                  id="tracking"
                  className="form-control"
                  placeholder="مثال (123456)"
                  required
                />
                <input type="submit" value="تتبع البلاغ" className="button" />
              </div>
            </form>
          </div>
        </div>

        {/* تفاصيل البلاغ + Timeline */}
        <div className="report-timeline">
          {report && (
            <>
              <div className="report-details">
                <h3>تفاصيل البلاغ</h3>
                <div className="details-grid">
                  <div>
                    <strong>رقم البلاغ:</strong> #{report.id}
                  </div>
                  <div>
                    <strong>تاريخ البلاغ:</strong>{" "}
                    {formatDate(report.created_at)}
                  </div>
                  <div>
                    <strong>نوع البلاغ:</strong> {report.report_type}
                  </div>
                  <div>
                    <strong>الحالة الحالية:</strong> {report.case_status}
                  </div>
                </div>
              </div>

              <h3>تتبع حالة البلاغ</h3>
              <ul className="timeline">
                {timeline.map((step) => (
                  <li key={step.key} className={step.active ? "active" : ""}>
                    <div className="icon">
                      {step.key === "تم استلام البلاغ" && (
                        <i className="fa-solid fa-envelope-open"></i>
                      )}
                      {step.key === "قيد المراجعة" && (
                        <i className="fa-solid fa-search"></i>
                      )}
                      {step.key === "قيد المعالجة" && (
                        <i className="fa-solid fa-cogs"></i>
                      )}
                      {step.key === "تم الحل" && (
                        <i className="fa-solid fa-check-circle"></i>
                      )}
                      {step.key === "تم الإغلاق" && (
                        <i className="fa-solid fa-folder-closed"></i>
                      )}
                    </div>
                    <div className="desc">
                      <p>{step.label}</p>
                      <span>
                        {step.active ? step.message : "لم يتم الوصول إليها بعد"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default TrackReport;
