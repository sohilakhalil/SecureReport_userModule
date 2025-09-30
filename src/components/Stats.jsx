import React, { useEffect, useState } from "react";

function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/analytics/site_stats/")
      .then((res) => res.json())
      .then((data) => {
        if (data.site_stats) {
          setStats(data.site_stats);
        }
      })
      .catch((err) => {
        console.error("فشل في جلب البيانات:", err);
      });
  }, []);

  if (!stats) {
    return (
      <div className="stats" id="stats">
        <p>جاري تحميل الإحصائيات...</p>
      </div>
    );
  }

  return (
    <div className="stats" id="stats">
      <h2>إحصائيات موقعنا</h2>
      <div className="container">
        <div className="box">
          <i className="fas fa-file-alt fa-2x fa-fw"></i>
          <h3>{stats.received_reports}</h3>
          <p>بلاغ مُستلم</p>
        </div>
        <div className="box">
          <i className="fas fa-tasks fa-2x fa-fw"></i>
          <h3>{stats.in_progress_reports}</h3>
          <p>بلاغ تحت المعالجة</p>
        </div>
        <div className="box">
          <i className="fas fa-check-circle fa-2x fa-fw"></i>
          <h3>{stats.closed_reports}</h3>
          <p>بلاغ مغلق</p>
        </div>
        <div className="box">
          <i className="fas fa-handshake fa-2x fa-fw"></i>
          <h3>{stats.collaborating_entities}</h3>
          <p>جهة متعاونة</p>
        </div>
      </div>
    </div>
  );
}

export default Stats;