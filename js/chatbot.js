/* Chatbot tư vấn dịch vụ làm web — câu hỏi cố định + trả lời theo từ khóa.
   Form lấy thông tin khách: tự mở Zalo với tin nhắn soạn sẵn để khách bấm Gửi. */
(function () {
  var PHONE = "0372569504";
  var ZALO = "https://zalo.me/0372569504";

  var QUICK = [
    { q: "💰 Giá làm web bao nhiêu?", a: "Bảng giá trọn gói: <b>Landing page từ 1.500.000đ</b>, <b>Web doanh nghiệp từ 4.900.000đ</b>, <b>Web bán hàng từ 9.900.000đ</b>, gói theo yêu cầu thì báo giá riêng. Thanh toán 50% khi chốt, 50% khi nghiệm thu ạ." },
    { q: "⏱️ Làm web mất bao lâu?", a: "Landing page 3–5 ngày, web doanh nghiệp 7–10 ngày, web bán hàng 10–15 ngày. Gói theo yêu cầu báo tiến độ riêng khi chốt phạm vi ạ." },
    { q: "🛡️ Có bảo hành không?", a: "Có ạ — bảo hành kỹ thuật <b>12 tháng miễn phí</b>, sau đó vẫn hỗ trợ trọn đời sử dụng." },
    { q: "📝 Để lại thông tin liên hệ", form: true },
  ];

  var box = document.getElementById("chat-box");
  var msgs = document.getElementById("chat-msgs");
  var quick = document.getElementById("chat-quick");
  var form = document.getElementById("chat-form");
  var input = document.getElementById("chat-input");

  QUICK.forEach(function (item) {
    var b = document.createElement("button");
    b.textContent = item.q;
    b.onclick = function () {
      user(item.q);
      setTimeout(function () { item.form ? leadForm() : bot(item.a); }, 350);
    };
    quick.appendChild(b);
  });

  document.getElementById("chat-fab").onclick = function () {
    box.classList.toggle("open");
    if (box.classList.contains("open") && !msgs.dataset.hi) {
      msgs.dataset.hi = "1";
      bot("Chào bạn! Mình tư vấn dịch vụ làm web FampanAI. Bạn cần làm loại web nào ạ? Bấm câu hỏi nhanh bên dưới hoặc nhắn trực tiếp nhé.");
    }
  };
  document.getElementById("chat-close").onclick = function () { box.classList.remove("open"); };

  /* Tự động mở khung chat khi mở web (mỗi phiên 1 lần) */
  try {
    if (!sessionStorage.getItem("web_chat_auto")) {
      sessionStorage.setItem("web_chat_auto", "1");
      setTimeout(function () {
        if (!box.classList.contains("open")) document.getElementById("chat-fab").click();
      }, 1500);
    }
  } catch (e) {}

  function scroll() { msgs.scrollTop = msgs.scrollHeight; }
  function bot(html) {
    var d = document.createElement("div");
    d.className = "msg bot"; d.innerHTML = html;
    msgs.appendChild(d); scroll();
  }
  function user(t) {
    var d = document.createElement("div");
    d.className = "msg user"; d.textContent = t;
    msgs.appendChild(d); scroll();
  }

  function leadForm() {
    var wrap = document.createElement("div");
    wrap.className = "msg bot";
    wrap.innerHTML =
      "<b>Để lại thông tin, mình tư vấn & báo giá chi tiết:</b>" +
      "<div class='lead-form'>" +
      "<input id='lf-name' placeholder='Tên của bạn'>" +
      "<input id='lf-phone' placeholder='Số điện thoại / Zalo' inputmode='tel'>" +
      "<textarea id='lf-need' rows='2' placeholder='Nhu cầu: ví dụ cần web bán hàng mỹ phẩm...'></textarea>" +
      "<button id='lf-send'>Gửi thông tin</button></div>";
    msgs.appendChild(wrap); scroll();
    wrap.querySelector("#lf-send").onclick = function () {
      var name = wrap.querySelector("#lf-name").value.trim();
      var phone = wrap.querySelector("#lf-phone").value.trim();
      var need = wrap.querySelector("#lf-need").value.trim();
      if (!name || !phone) { bot("Bạn nhập giúp mình <b>tên</b> và <b>số điện thoại</b> nhé."); return; }
      if (phone.replace(/\D/g, "").length < 9) { bot("Số điện thoại chưa đúng, bạn kiểm tra lại giúp mình nhé."); return; }
      try {
        var leads = JSON.parse(localStorage.getItem("fampanai_web_leads") || "[]");
        leads.push({ name: name, phone: phone, need: need, at: new Date().toISOString() });
        localStorage.setItem("fampanai_web_leads", JSON.stringify(leads));
      } catch (e) {}
      user("Đã gửi: " + name + " - " + phone);
      var text = encodeURIComponent("KHÁCH MỚI từ web web.fampanai.com\nTên: " + name + "\nSĐT: " + phone + "\nNhu cầu: " + (need || "tư vấn làm web"));
      var zaloUrl = ZALO + "?text=" + text;
      window.open(zaloUrl, "_blank");
      bot("Cảm ơn <b>" + name + "</b>! Mình đã mở Zalo với tin nhắn soạn sẵn — bạn bấm <b>Gửi</b> là Mr QUYẾT (" + PHONE + ") nhận được ngay. Nếu Zalo chưa tự mở, bấm nút bên dưới:<br><br><a href='" + zaloUrl + "' target='_blank' style='display:inline-block;background:#0068ff;color:#fff;padding:10px 22px;border-radius:20px;text-decoration:none'>Gửi qua Zalo Mr QUYẾT " + PHONE + "</a>");
    };
  }

  function autoReply(t) {
    var s = t.toLowerCase();
    var has = function () { for (var i = 0; i < arguments.length; i++) if (s.includes(arguments[i])) return true; return false; };
    if (has("giá", "bao nhiêu", "báo giá", "chi phí")) return "Bảng giá trọn gói: <b>Landing page từ 1.500.000đ</b> · <b>Web doanh nghiệp từ 4.900.000đ</b> · <b>Web bán hàng từ 9.900.000đ</b> · Gói theo yêu cầu báo giá riêng. Nhắn Zalo <a href='" + ZALO + "' target='_blank'><b>" + PHONE + "</b></a> (Mr QUYẾT) để được tư vấn miễn phí ạ.";
    if (has("bao lâu", "thời gian", "tiến độ", "nhanh")) return "Landing page 3–5 ngày, web doanh nghiệp 7–10 ngày, web bán hàng 10–15 ngày ạ.";
    if (has("bảo hành")) return "Bảo hành kỹ thuật <b>12 tháng miễn phí</b>, hỗ trợ trọn đời sử dụng ạ.";
    if (has("seo", "google", "lên top")) return "Web được làm chuẩn SEO cơ bản: tốc độ nhanh, cấu trúc heading, sitemap, khai báo Google Search Console — đủ nền để SEO lên top ạ.";
    if (has("mẫu", "demo", "xem thử")) return "Bạn xem mẫu thật đang chạy: <a href='https://sonnano.fampanai.com' target='_blank'><b>Web bán sơn</b></a> và <a href='https://fampanai.com' target='_blank'><b>Web FampanAI</b></a>. Cần thêm demo ngành khác thì nhắn Zalo mình gửi ạ.";
    if (has("zalo", "liên hệ", "đặt", "làm web", "sđt", "sdt", "điện thoại", "hotline")) return "Bạn nhắn Zalo/call: <a href='" + ZALO + "' target='_blank'><b>" + PHONE + "</b></a> (Mr QUYẾT) — tư vấn miễn phí, báo giá ngay ạ.";
    if (has("chào", "hello", "hi", "xin chào")) return "Chào bạn! Mình tư vấn làm web: landing page, web doanh nghiệp, web bán hàng. Bạn cần loại nào ạ?";
    if (has("cảm ơn", "thanks", "thank")) return "Dạ không có gì! Cần gì thêm bạn cứ nhắn, hoặc Zalo Mr QUYẾT " + PHONE + " nhé.";
    return "Mình chưa hiểu rõ ý bạn. Bạn bấm câu hỏi nhanh bên dưới, hoặc nhắn Zalo Mr QUYẾT <a href='" + ZALO + "' target='_blank'>" + PHONE + "</a> để được tư vấn trực tiếp nhé.";
  }

  form.onsubmit = function (e) {
    e.preventDefault();
    var t = input.value.trim();
    if (!t) return;
    user(t); input.value = "";
    setTimeout(function () { bot(autoReply(t)); }, 400);
  };
})();
