function FAQ() {
  const faqs = [
    {
      question: "هل لازم أسجل حساب عشان أقدم بلاغ؟",
      answer:
        "لا، تقدر تقدّم البلاغ مباشرة بدون أي تسجيل أو إدخال بيانات شخصية.",
    },
    {
      question: "إزاي بضمن إن بياناتي سرية؟",
      answer:
        "كل البيانات بتتشفّر تلقائيًا، ومش بيتم تخزين أي معلومات تعريفية عن المستخدم.",
    },
    {
      question: "هل ممكن أتابع حالة البلاغ بعد إرساله؟",
      answer:
        "نعم، بعد ما تقدم البلاغ بيظهرلك رقم تتبع خاص تقدر تستخدمه لمتابعة حالته.",
    },
    {
      question: "مين اللي بيشوف البلاغات؟",
      answer: "البلاغات بتوصل فقط للجهات المختصة وبتتعامل بسرية تامة.",
    },
    {
      question: "كيف يمكنني متابعة حالة البلاغ؟",
      answer:
        "بعد الإرسال، تحصل على رقم تتبع خاص يمكنك استخدامه لمعرفة حالة البلاغ.",
    },
    {
      question: "هل سأحصل على رد أو إشعار؟",
      answer:
        "في بعض الحالات، يتم إرسال تحديثات عبر رقم التتبع، دون الكشف عن أي بيانات.",
    },
    {
      question: "كم يستغرق الرد على البلاغ؟",
      answer:
        "يختلف حسب نوع البلاغ، لكن يتم التعامل مع البلاغات الحرجة بشكل فوري.",
    },
  ];

  return (
    <section className="faq-section py-5" id="faq">
      <div className="container">
        <h2 className="special-heading">الأسئلة الشائعة</h2>
        <div className="accordion pt-4" id="faqAccordion">
          {faqs.map((faq, index) => (
            <div className="accordion-item" key={index}>
              <h2 className="accordion-header" id={`faq${index + 1}`}>
                <button
                  className={`accordion-button ${
                    index !== 0 ? "collapsed" : ""
                  }`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#answer${index + 1}`}
                  aria-expanded={index === 0 ? "true" : "false"}
                  aria-controls={`answer${index + 1}`}
                >
                  {faq.question}
                </button>
              </h2>
              <div
                id={`answer${index + 1}`}
                className={`accordion-collapse collapse ${
                  index === 0 ? "show" : ""
                }`}
                aria-labelledby={`faq${index + 1}`}
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
