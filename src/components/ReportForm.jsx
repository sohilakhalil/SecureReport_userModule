import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";

function ReportForm() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  useEffect(() => {
    //!--------------------------------------------- Leaflet Map----------------------------------//
    if (!mapRef.current || mapInstance.current) return;

    const cairo = [30.0444, 31.2357];
    const map = L.map(mapRef.current).setView(cairo, 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OSM</a>',
    }).addTo(map);

    const marker = L.marker(cairo, { draggable: true }).addTo(map);
    updateLocation(cairo[0], cairo[1]);

    function updateLocation(lat, lng) {
      //Update the visible link
      document.querySelector(
        "#locationLink"
      ).value = `https://www.google.com/maps?q=${lat},${lng}`;
      //Update hidden inputs
      document.querySelector("#latitude").value = lat;
      document.querySelector("#longitude").value = lng;
    }
    // Update the link when dragging the marker
    marker.on("dragend", () => {
      const { lat, lng } = marker.getLatLng();
      updateLocation(lat, lng);
    });

    // Search box
    const geocoder = L.Control.geocoder({
      placeholder: "ابحث عن المكان...",
      defaultMarkGeocode: false,
      position: "bottomleft", // أو 'topleft'، 'bottomleft', 'bottomright', 'topRight'
    })
      .on("markgeocode", (e) => {
        const latlng = e.geocode.center;
        marker.setLatLng(latlng);
        map.setView(latlng, 15);
        updateLocation(latlng.lat, latlng.lng);
      })
      .addTo(map);

    // click to move marker
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      updateLocation(lat, lng);
    });

    /**
     * We save a copy of the map in ref so that we can use it later without recreating the map.
     */
    mapInstance.current = map;

    const form = document.getElementById("reportForm");
    const popup = document.getElementById("popup");

    let mediaRecorder;
    let audioChunks = [];
    let isRecording = false;

    const recordBtn = document.getElementById("recordBtn");
    const recordStatus = document.getElementById("recordStatus");
    const audioPlayback = document.getElementById("audioPlayback");
    const audioData = document.getElementById("audioData");
    const clearBtn = document.getElementById("clearRecording");

    const fileInput = document.getElementById("file");
    const fileList = document.getElementById("fileList");
    let allFiles = [];

    // استرجاع البيانات من localStorage
    if (window.localStorage.getItem("formData")) {
      const saved = JSON.parse(window.localStorage.getItem("formData"));
      document.querySelector("#type").value = saved.reportType || "اعتداء";
      document.querySelector("#location").value = saved.location;
      document.querySelector("#latitude").value = saved.latitude;
      document.querySelector("#longitude").value = saved.longitude;
      document.querySelector("#date").value = saved.date;
      document.querySelector("#details").value = saved.details;
      document.querySelector("#contact").value = saved.contact;
      document.querySelector("#criminalName").value = saved.criminalName;
      document.querySelector("#criminalDesc").value = saved.criminalDesc;
      document.querySelector("#criminalOther").value = saved.criminalOther;
    }

    // التسجيل الصوتي
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      recordBtn.addEventListener("click", async () => {
        if (!isRecording) {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.start();
          audioChunks = [];
          isRecording = true;

          recordBtn.classList.add("recording");
          recordStatus.textContent = "جاري التسجيل... اضغط للإيقاف";

          mediaRecorder.addEventListener("dataavailable", (event) => {
            audioChunks.push(event.data);
          });

          mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            const audioUrl = URL.createObjectURL(audioBlob);

            audioPlayback.src = audioUrl;
            audioPlayback.style.display = "block";
            clearBtn.style.display = "inline-block";
            recordStatus.textContent = "تم التسجيل ✔️";

            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = () => {
              audioData.value = reader.result;
            };
          });
        } else {
          mediaRecorder.stop();
          isRecording = false;
          recordBtn.classList.remove("recording");
        }
      });

      clearBtn.addEventListener("click", () => {
        audioPlayback.src = "";
        audioPlayback.style.display = "none";
        audioData.value = "";
        clearBtn.style.display = "none";
        recordStatus.textContent = "اضغط للتسجيل";
      });
    } else {
      recordStatus.textContent = "متصفحك لا يدعم التسجيل الصوتي.";
    }

    // رفع الملفات
    fileInput.addEventListener("change", () => {
      Array.from(fileInput.files).forEach((file) => {
        allFiles.push(file);
      });

      fileList.innerHTML = "";
      allFiles.forEach((file, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${file.name}`;
        li.style.color = "#555";
        fileList.appendChild(li);
      });

      fileInput.value = "";
    });

    // حفظ البيانات في localStorage
    form.addEventListener("input", () => {
      const formDataStorage = {
        location: document.querySelector("#location").value,
        latitude: document.querySelector("#latitude").value,
        longitude: document.querySelector("#longitude").value,
        date: document.querySelector("#date").value,
        details: document.querySelector("#details").value,
        contact: document.querySelector("#contact").value,
        reportType: document.querySelector("#type").value,
        criminalName: document.querySelector("#criminalName").value,
        criminalDesc: document.querySelector("#criminalDesc").value,
        criminalOther: document.querySelector("#criminalOther").value,
      };

      window.localStorage.setItem("formData", JSON.stringify(formDataStorage));
    });

    // إرسال البلاغ
    form.onsubmit = async function (e) {
      e.preventDefault();

      const formData = new FormData();

      // Basic data: read values from the form and trim whitespace
      const location = document.querySelector("#location").value.trim();
      const lat = parseFloat(document.querySelector("#latitude").value);
      const lon = parseFloat(document.querySelector("#longitude").value);
      const incident_date = document.querySelector("#date").value.trim();
      const report_details = document.querySelector("#details").value.trim();
      const contact_info = document.querySelector("#contact").value.trim();
      const report_type = document.querySelector("#type").value || "اعتداء";

      // Add data to FormData only if it exists and is valid
      if (location) formData.append("location", location);
      if (Number.isFinite(lat)) formData.append("latitude", lat);
      if (Number.isFinite(lon)) formData.append("longitude", lon);
      if (incident_date) formData.append("incident_date", incident_date);
      if (report_details) formData.append("report_details", report_details);
      if (contact_info) formData.append("contact_info", contact_info);
      formData.append("report_type", report_type);

      // Criminal info: add only if there is at least one non-empty value
      const criminalInfos = [
        {
          name: document.querySelector("#criminalName").value.trim(),
          description: document.querySelector("#criminalDesc").value.trim(),
          other_info: document.querySelector("#criminalOther").value.trim(),
        },
      ].filter((c) => Object.values(c).some((v) => v !== ""));
      if (criminalInfos.length > 0)
        formData.append("criminal_infos", JSON.stringify(criminalInfos));

      // Attachments: add all files if any
      allFiles.forEach((file) => formData.append("attachments", file));

      // Audio recording: add only if a recording exists
      if (audioData.value) {
        const base64 = audioData.value.split(",")[1];
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++)
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        const byteArray = new Uint8Array(byteNumbers);
        formData.append(
          "attachments",
          new Blob([byteArray], { type: "audio/webm" }),
          "audio_recording.webm"
        );
      }

      fetch("http://127.0.0.1:8000/api/reports/new/", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          popup.querySelector(
            ".trackingID"
          ).innerHTML = `كود متابعة بلاغك هو:<br>
   <span style="color:#4ec1f1; font-size:24px; font-weight:bold;">
     ${data.tracking_code}
   </span>`;
        })
        .catch((err) => console.error(err));

      popup.style.display = "flex";

      form.reset();
      audioData.value = "";
      audioPlayback.src = "";
      audioPlayback.style.display = "none";
      clearBtn.style.display = "none";
      allFiles = [];

      window.localStorage.removeItem("formData");
    };

    window.closePopup = function () {
      popup.style.display = "none";
    };

    document
      .getElementById("criminalToggle")
      .addEventListener("change", function () {
        const fields = document.getElementById("criminalFields");
        fields.style.display = this.checked ? "block" : "none";
      });
  }, []);

  return (
    <>
      <div className="report-form container py-3">
        <div className="container">
          <h1 className="report-title">قدّم بلاغك بسرية تامة</h1>
          <p className="report-subtitle">نضمن سرية بياناتك بالكامل</p>

          <form id="reportForm">
            <div className="mb-3">
              <label htmlFor="type" className="form-label">
                نوع البلاغ
              </label>
              <select id="type" className="form-control" required>
                <option value="">اختر نوع البلاغ</option>
                <option>اعتداء</option>
                <option>ابتزاز</option>
                <option>تحرش</option>
                <option>سرقة</option>
                <option>مشادة</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="location" className="form-label">
                العنوان/المكان
              </label>
              <input
                type="text"
                id="location"
                className="form-control"
                placeholder="اكتب الموقع"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">الموقع</label>
              <input
                type="text"
                id="locationLink"
                className="form-control mb-2"
                placeholder="لينك جوجل مابس"
              />

              <input type="hidden" id="latitude" name="latitude" />
              <input type="hidden" id="longitude" name="longitude" />
              <div
                id="map"
                ref={mapRef}
                style={{ height: "200px", width: "100%" }}
              ></div>
            </div>

            <div className="mb-3">
              <label htmlFor="date" className="form-label">
                تاريخ الواقعة
              </label>
              <input type="date" id="date" className="form-control" required />
            </div>

            <div className="mb-3">
              <label htmlFor="details" className="form-label">
                تفاصيل البلاغ
              </label>
              <textarea
                id="details"
                rows="5"
                className="form-control"
                placeholder="اكتب التفاصيل"
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="file" className="form-label">
                إرفاق ملف/ملفات (اختياري)
              </label>
              <input type="file" id="file" className="form-control" />
              <ul id="fileList" className="mt-2"></ul>
            </div>

            <div className="mb-3">
              <label htmlFor="contact" className="form-label">
                وسيلة تواصل (اختياري)
              </label>
              <input
                type="text"
                id="contact"
                className="form-control"
                placeholder="رقم الهاتف أو البريد"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">تسجيل صوتي (اختياري)</label>
              <div className="voice-recorder text-center">
                <button type="button" id="recordBtn" className="record-btn">
                  🎤
                </button>
                <p id="recordStatus" className="mt-2 text-muted">
                  اضغط للتسجيل
                </p>
                <div
                  className="d-flex align-items-center justify-content-end gap-2 mt-2"
                  style={{ flexDirection: "row-reverse" }}
                >
                  <audio
                    id="audioPlayback"
                    controls
                    style={{ display: "none", marginTop: "16px" }}
                  ></audio>
                  <button
                    type="button"
                    id="clearRecording"
                    style={{
                      display: "none",
                      border: "none",
                      backgroundColor: "transparent",
                      fontSize: "18px",
                    }}
                    title="مسح التسجيل"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <input type="hidden" id="audioData" name="audioData" />
                </div>
              </div>
            </div>

            <div className="mb-3 form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="criminalToggle"
              />
              <label className="form-check-label" htmlFor="criminalToggle">
                هل لديك معلومات عن المجرم؟
              </label>
            </div>

            <div id="criminalFields" style={{ display: "none" }}>
              <div className="mb-3">
                <label htmlFor="criminalName" className="form-label">
                  اسم المجرم (إن وُجد)
                </label>
                <input
                  type="text"
                  id="criminalName"
                  className="form-control"
                  placeholder="اكتب الاسم أو اللقب المعروف"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="criminalDesc" className="form-label">
                  أوصاف المجرم
                </label>
                <textarea
                  id="criminalDesc"
                  rows="3"
                  className="form-control"
                  placeholder="مثال: الطول، الشعر، ملابس، لهجة..."
                ></textarea>
              </div>

              <div className="mb-3">
                <label htmlFor="criminalOther" className="form-label">
                  معلومات إضافية
                </label>
                <input
                  type="text"
                  id="criminalOther"
                  className="form-control"
                  placeholder="مثال: رقم هاتف، مكان يتردد عليه..."
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-100">
              إرسال البلاغ
            </button>
          </form>
        </div>
      </div>

      <div className="popup" id="popup" style={{ display: "none" }}>
        <div className="popup-content">
          <h2>✅ تم إرسال البلاغ</h2>
          <p>شكرًا لتعاونك، سيتم التعامل مع البلاغ بسرية.</p>
          <h3
            className="trackingID"
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#081931",
              textAlign: "center",
              marginTop: "20px",
            }}
          ></h3>

          <button onClick={() => window.closePopup()} className="btn-primary">
            تم
          </button>
        </div>
      </div>
    </>
  );
}

export default ReportForm;