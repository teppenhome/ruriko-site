// サイト共通のエントリ（Vite から SCSS を読み込み）
import "../../src/styles/main.scss";

/* =========================
  トップビジュアル読み込み完了までローディング
========================= */
const body = document.body;
const mvLoaderImages = document.querySelectorAll(".js-mv-image");

const finishLoading = () => {
  body.classList.remove("is-loading");
};

if (mvLoaderImages.length === 0) {
  finishLoading();
} else {
  let loadedCount = 0;

  mvLoaderImages.forEach((img) => {
    if (img.complete) {
      loadedCount++;
    } else {
      img.addEventListener("load", () => {
        loadedCount++;
        if (loadedCount === mvLoaderImages.length) finishLoading();
      });

      img.addEventListener("error", () => {
        loadedCount++;
        if (loadedCount === mvLoaderImages.length) finishLoading();
      });
    }
  });

  if (loadedCount === mvLoaderImages.length) {
    finishLoading();
  }
}

/* =========================
  MV画像フェード切り替え
========================= */
const mvImages = document.querySelectorAll(".p-top-mv__picture .p-top-mv__image");

if (mvImages.length > 0) {
  let currentIndex = 0;

  // 最初は1枚目だけ active に
  mvImages.forEach((img, i) => {
    img.classList.toggle("is-active", i === 0);
  });

  if (mvImages.length > 1) {
    setInterval(() => {
      const prevIndex = currentIndex;
      currentIndex = (currentIndex + 1) % mvImages.length;

      mvImages[currentIndex].classList.add("is-active");

      setTimeout(() => {
        mvImages[prevIndex].classList.remove("is-active");
      }, 300);
    }, 2000); // 少し長めにすると自然
  }
}

/* =========================
  MVラベル 横から表示
========================= */
const mvLabelsWrap = document.querySelector(".p-top-mv__labels");
const mvLabels = document.querySelectorAll(".p-top-mv__label");

if (mvLabelsWrap && mvLabels.length > 0) {
  requestAnimationFrame(() => {
    mvLabelsWrap.classList.add("is-ready");

    setTimeout(() => {
      mvLabels.forEach((label) => {
        label.classList.add("is-show");
      });
    }, 300);
  });
}

/* =========================
  MV店舗イメージ スクロール発火
========================= */
const shopSection = document.querySelector(".p-top-mv__shops");

if (shopSection) {
  const items = shopSection.querySelectorAll(
    ".p-top-mv__shop, .p-top-mv__deco"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 順番に表示
          items.forEach((el, index) => {
            setTimeout(() => {
              el.classList.add("is-show");
            }, index * 200); // ← ここでスピード調整
          });

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.3, // 30%見えたら発火
    }
  );

  observer.observe(shopSection);
}

/* =========================
  汎用フェードアップ（トップ）
========================= */
const initFadeUp = () => {
  const targets = Array.from(
    document.querySelectorAll(".js-fade-up, .js-title-mask"),
  );

  if (targets.length === 0 || !("IntersectionObserver" in window)) {
    return;
  }

  const excludeSelector = [
    ".p-top-mv__image",
    ".p-top-mv__label",
    ".p-top-mv__shop",
    ".p-top-mv__deco",
    ".js-hero-reveal",
  ].join(", ");

  let autoDelayIndex = 0;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const el = entry.target;
        el.classList.add("is-visible");
        observer.unobserve(el);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  targets.forEach((el) => {
    if (el.matches(excludeSelector)) {
      return;
    }

    const hasExistingInlineAnimation =
      (el.style.animation && el.style.animation !== "none") ||
      (el.style.transition && el.style.transition !== "none");

    if (hasExistingInlineAnimation) {
      return;
    }

    if (!el.classList.contains("js-title-mask")) {
      const rawDelay = el.dataset.delay;
      const delay =
        rawDelay !== undefined && rawDelay !== ""
          ? Number.parseFloat(rawDelay)
          : autoDelayIndex++ * 0.1;

      const safeDelay = Number.isFinite(delay) && delay >= 0 ? delay : 0;
      el.style.transitionDelay = `${safeDelay}s`;
    }
    observer.observe(el);
  });
};

initFadeUp();

/* =========================
  スマホ：ハンバーガーメニュー
========================= */
const initMobileNav = () => {
  const header = document.querySelector(".p-header");
  const hamburger = document.querySelector(".p-header__hamburger");
  const overlay = document.querySelector(".p-header__overlay");
  const nav = document.getElementById("global-nav");

  if (!header || !hamburger || !overlay || !nav) {
    return;
  }

  const mqMobile = window.matchMedia("(max-width: 768px)");
  const links = nav.querySelectorAll("a.p-header__link");

  const open = () => {
    header.classList.add("is-open");
    document.body.classList.add("is-lock");
    hamburger.setAttribute("aria-expanded", "true");
    hamburger.setAttribute("aria-label", "メニューを閉じる");
    overlay.setAttribute("aria-hidden", "false");
  };

  const close = () => {
    header.classList.remove("is-open");
    document.body.classList.remove("is-lock");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "メニューを開く");
    overlay.setAttribute("aria-hidden", "true");
  };

  const toggle = () => {
    if (header.classList.contains("is-open")) {
      close();
    } else {
      open();
    }
  };

  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggle();
  });

  overlay.addEventListener("click", close);

  links.forEach((link) => {
    link.addEventListener("click", () => {
      if (mqMobile.matches) {
        close();
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 769px)").matches) {
      close();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && header.classList.contains("is-open")) {
      close();
      hamburger.focus();
    }
  });
};

initMobileNav();

/* =========================
  Company MV ピルアニメーション
========================= */
const pill = document.querySelector(".p-mv-pill");

if (pill) {
  window.addEventListener("load", () => {
    pill.classList.add("is-active");
  });
}

const overview = document.querySelector(".p-company-overview");
const bg = document.querySelector(".p-company-overview__bg");

if (overview && bg) {
  const handleBgBlur = () => {
    const rect = overview.getBoundingClientRect();

    if (rect.bottom < window.innerHeight - 200) {
      bg.classList.add("is-blur");
    } else {
      bg.classList.remove("is-blur");
    }
  };

  window.addEventListener("scroll", handleBgBlur);
  handleBgBlur();
}