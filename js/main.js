/* FampanAI Web — tương tác chung */
(function () {
  // Năm bản quyền
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // FAQ accordion
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq");
      var wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq.open").forEach(function (o) { o.classList.remove("open"); });
      if (!wasOpen) item.classList.add("open");
    });
  });
})();
