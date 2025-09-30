// src/pages/ReportForm.jsx
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";

function ReportForm() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
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
      document.querySelector(
        "#locationLink"
      ).value = `https://www.google.com/maps?q=${lat},${lng}`;
      document.querySelector("#latitude").value = lat;
      document.querySelector("#longitude").value = lng;
    }

    // Marker drag
    marker.on("dragend", () => {
      const { lat, lng } = marker.getLatLng();
      updateLocation(lat, lng);
    });

    // Search
    const geocoder = L.Control.geocoder({
      placeholder: "ابحث عن المكان...",
      defaultMarkGeocode: false,
      position: "bottomleft",
    })
      .on("markgeocode", (e) => {
        const latlng = e.geocode.center;
        marker.setLatLng(latlng);
        map.setView(latlng, 15);
        updateLocation(latlng.lat, latlng.lng);
      })
      .addTo(map);

    // Click map
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      updateLocation(lat, lng);
    });

    mapInstance.current = map;

    // -------- FORM --------
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

    // ============ LocalStorage Encode/Decode ============
    function encodeBase64Unicode(str) {
      return btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) =>
          String.fromCharCode("0x" + p1)
        )
      );
    }

    function decodeBase64Unicode(str) {
      return decodeURIComponent(
        atob(str)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
    }

    // ============ Restore LocalStorage ============
    if (window.localStorage.getItem("formData")) {
      try {
        const saved = JSON.parse(
          decodeBase64Unicode(window.localStorage.getItem("formData"))
        );
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
      } catch (err) {
        console.error("خطأ في استرجاع البيانات من localStorage:", err);
        window.localStorage.removeItem("formData");
      }
    }

    // ============ Voice Recording ============
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

    // ============ Files Handling ============
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

    // ============ Save Form to LocalStorage ============
    function saveFormData() {
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
      const encoded = encodeBase64Unicode(JSON.stringify(formDataStorage));
      window.localStorage.setItem("formData", encoded);
    }

    // Save periodically
    form.addEventListener("input", saveFormData);

    // ============ Submit Handler ============
    form.onsubmit = async function (e) {
      e.preventDefault();
      let errors = [];

      const textRegex = /^[\u0600-\u06FFa-zA-Z0-9\s.,!?'"-]{3,200}$/;
      const phoneRegex = /^(?:\+20|0)?1[0-9]{9}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const mapRegex =
        /^https:\/\/www\.google\.com\/maps\?q=(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)$/;
      const criminalRegex = /^[\u0600-\u06FFa-zA-Z0-9\s.,!?'"-]{0,200}$/;

      const location = document.querySelector("#location").value.trim();
      const lat = parseFloat(document.querySelector("#latitude").value);
      const lon = parseFloat(document.querySelector("#longitude").value);
      const locationLink = document.querySelector("#locationLink").value.trim();
      const incident_date = document.querySelector("#date").value.trim();
      const report_details = document.querySelector("#details").value.trim();
      const contact_info = document.querySelector("#contact").value.trim();
      const report_type = document.querySelector("#type").value || "اعتداء";

      const criminalName = document.querySelector("#criminalName").value.trim();
      const criminalDesc = document.querySelector("#criminalDesc").value.trim();
      const criminalOther = document
        .querySelector("#criminalOther")
        .value.trim();

      // ✅ التحقق من المدخلات
      if (!textRegex.test(location))
        errors.push("📍 العنوان يجب أن يكون نصًا صحيحًا بدون رموز غير مسموحة.");
      if (!mapRegex.test(locationLink))
        errors.push("🗺️ يجب إدخال رابط صحيح من جوجل مابس.");
      if (incident_date) {
        const today = new Date();
        const inputDate = new Date(incident_date);
        if (inputDate > today)
          errors.push("📅 تاريخ الواقعة لا يمكن أن يكون في المستقبل.");
      } else errors.push("📅 تاريخ الواقعة مطلوب.");
      if (!textRegex.test(report_details))
        errors.push(
          "📝 تفاصيل البلاغ يجب أن تكون نصًا صحيحًا (٣ أحرف على الأقل)."
        );
      if (
        contact_info &&
        !(phoneRegex.test(contact_info) || emailRegex.test(contact_info))
      )
        errors.push(
          "📞 وسيلة التواصل يجب أن تكون رقم هاتف صحيح أو بريد إلكتروني صحيح."
        );
      if (criminalName && !criminalRegex.test(criminalName))
        errors.push("⚠️ اسم المجرم يحتوي على رموز غير مسموحة.");
      if (criminalDesc && !criminalRegex.test(criminalDesc))
        errors.push("⚠️ وصف المجرم يحتوي على رموز غير مسموحة.");
      if (criminalOther && !criminalRegex.test(criminalOther))
        errors.push("⚠️ معلومات إضافية عن المجرم تحتوي على رموز غير مسموحة.");

      // ✅ التحقق من الملفات
      const maxFileSize = 10 * 1024 * 1024;
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/bmp",
        "image/tiff",
        "image/heic",
        "image/heif",
        "image/x-icon",
        "image/jpg",
        "video/mp4",
        "video/quicktime",
        "video/x-matroska",
        "video/webm",
        "video/avi",
        "video/mpeg",
        "application/pdf",
      ];

      allFiles.forEach((file) => {
        if (!allowedTypes.includes(file.type))
          errors.push(`❌ نوع الملف (${file.name}) غير مسموح.`);
        if (file.size > maxFileSize)
          errors.push(`❌ حجم الملف (${file.name}) أكبر من 10 ميجابايت.`);
      });

      const errorBox = document.getElementById("formErrors");
      if (errors.length > 0) {
        errorBox.innerHTML = errors.map((e) => `<li>${e}</li>`).join("");
        errorBox.style.display = "block";
        errorBox.scrollIntoView({ behavior: "smooth" });
        return;
      } else {
        errorBox.style.display = "none";
      }

      // ✅ تجهيز البيانات
      const formData = new FormData();
      formData.append("location", location);
      formData.append("latitude", lat);
      formData.append("longitude", lon);
      formData.append("location_link", locationLink);
      formData.append("incident_date", incident_date);
      formData.append("report_details", report_details);
      if (contact_info) formData.append("contact_info", contact_info);
      formData.append("report_type", report_type);

      const criminalInfos = [
        {
          name: criminalName,
          description: criminalDesc,
          other_info: criminalOther,
        },
      ].filter((c) => Object.values(c).some((v) => v !== ""));
      if (criminalInfos.length > 0)
        formData.append("criminal_infos", JSON.stringify(criminalInfos));

      allFiles.forEach((file) => formData.append("attachments", file));

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

      // ✅ زرار الإرسال loading
      const submitBtn = form.querySelector("button[type='submit']");
      submitBtn.disabled = true;
      submitBtn.textContent = "جارٍ الإرسال...";

      try {
        const res = await fetch("http://127.0.0.1:8000/api/reports/", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        // ✅ فتح البوب أب بعد ما يجي الريسبونس
        popup.querySelector(
          ".trackingID"
        ).innerHTML = `كود متابعة بلاغك هو:<br><span style="color:#4ec1f1; font-size:28px; font-weight:bold;">${data.tracking_code}</span>`;
        popup.style.display = "flex";

        // ✅ Reset الفورم
        form.reset();
        audioData.value = "";
        audioPlayback.src = "";
        audioPlayback.style.display = "none";
        clearBtn.style.display = "none";
        allFiles = [];
        window.localStorage.removeItem("formData");
      } catch (err) {
        console.error(err);
        alert("حدث خطأ أثناء إرسال البلاغ. حاول مرة أخرى.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "إرسال البلاغ";
      }
    };

    // Toggle criminal fields
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
            <ul
              id="formErrors"
              style={{
                display: "none",
                backgroundColor: "#ffe6e6",
                color: "#b30000",
                padding: "10px",
                borderRadius: "5px",
                marginBottom: "15px",
                listStyle: "disc inside",
              }}
            ></ul>

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
                placeholder="اكتب العنوان (مثال: شارع التحرير، القاهرة)"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">الموقع</label>
              <input
                type="text"
                id="locationLink"
                className="form-control mb-2"
                placeholder="https://www.google.com/maps?q=30.0444,31.2357"
                required
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
                placeholder="اكتب تفاصيل البلاغ بشكل واضح (٣ أحرف على الأقل)"
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="file" className="form-label">
                إرفاق ملف/ملفات (اختياري)
              </label>
              <input type="file" id="file" className="form-control" multiple />
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
                placeholder="مثال: +201234567890 أو name@email.com"
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
                  اسم المجرم
                </label>
                <input
                  type="text"
                  id="criminalName"
                  className="form-control"
                  placeholder="اكتب اسم المجرم (اختياري)"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="criminalDesc" className="form-label">
                  وصف المجرم
                </label>
                <textarea
                  id="criminalDesc"
                  rows="3"
                  className="form-control"
                  placeholder="وصف المجرم (اختياري)"
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="criminalOther" className="form-label">
                  معلومات إضافية عن المجرم
                </label>
                <textarea
                  id="criminalOther"
                  rows="3"
                  className="form-control"
                  placeholder="معلومات إضافية (اختياري)"
                ></textarea>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              إرسال البلاغ
            </button>
          </form>
        </div>

        <div className="popup" id="popup" style={{ display: "none" }}>
          {" "}
          <div className="popup-content">
            {" "}
            <h2>✅ تم إرسال البلاغ</h2>{" "}
            <p>شكرًا لتعاونك، سيتم التعامل مع البلاغ بسرية.</p>{" "}
            <h3
              className="trackingID"
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#081931",
                textAlign: "center",
                marginTop: "20px",
              }}
            ></h3>{" "}
            <button onClick={() => window.closePopup()} className="btn-primary">
              {" "}
              تم{" "}
            </button>{" "}
          </div>{" "}
        </div>
      </div>
    </>
  );
}

export default ReportForm;