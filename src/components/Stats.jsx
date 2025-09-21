function Stats() {
  return (
    <div className="stats" id="stats">
      <h2>إحصائيات موقعنا</h2>
      <div className="container">
        <div className="box">
          <i className="fas fa-file-alt fa-2x fa-fw"></i>
          <h3>150</h3>
          <p>بلاغ مُستلم</p>
        </div>
        <div className="box">
          <i className="fas fa-tasks fa-2x fa-fw"></i>
          <h3>120</h3>
          <p>بلاغ تمت معالجته</p>
        </div>
        <div className="box">
          <i className="fas fa-check-circle fa-2x fa-fw"></i>
          <h3>95</h3>
          <p>بلاغ مغلق</p>
        </div>
        <div className="box">
          <i className="fas fa-handshake fa-2x fa-fw"></i>
          <h3>20</h3>
          <p>جهة متعاونة</p>
        </div>
      </div>
    </div>
  );
}
export default Stats;
