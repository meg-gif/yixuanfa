const app = document.querySelector("#app");
const TOKEN_KEY = "haimeitong_api_token";
const USER_KEY = "haimeitong_api_user";
const MOCK_AUTH_KEY = "haimeitong_mock_login";
const REDIRECT_KEY = "haimeitong_post_login_redirect";
const DASHBOARD_VIEW_KEY = "haimeitong_dashboard_view";
const apiMode = location.protocol.startsWith("http");

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

function isLoggedIn() {
  return Boolean(getToken()) || localStorage.getItem(MOCK_AUTH_KEY) === "true";
}

function updateStoredUser(patch = {}) {
  const user = getUser();
  if (!user) return null;
  const nextUser = { ...user, ...patch };
  localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  return nextUser;
}

function getRoles() {
  return getUser()?.roles || [];
}

function hasRole(role) {
  return getRoles().includes(role);
}

function getPrimaryRole() {
  const user = getUser();
  if (!user) return "guest";
  if (user.primaryRole) return user.primaryRole;
  return user.roles?.includes("seller") ? "seller" : "buyer";
}

function canAccessBuyerApp() {
  return hasRole("buyer") || hasRole("seller");
}

function canAccessSellerApp() {
  return hasRole("seller");
}

function getDefaultAppRoute() {
  if (getPrimaryRole() === "seller" && canAccessSellerApp()) return "#/seller/dashboard";
  if (canAccessBuyerApp()) return "#/buyer/dashboard";
  return "#/";
}

function setRedirect(hash = window.location.hash || "#/") {
  localStorage.setItem(REDIRECT_KEY, hash);
}

function consumeRedirect() {
  const redirect = localStorage.getItem(REDIRECT_KEY) || "";
  localStorage.removeItem(REDIRECT_KEY);
  return redirect;
}

function setDashboardView(view) {
  if (view === "seller" && canAccessSellerApp()) localStorage.setItem(DASHBOARD_VIEW_KEY, "seller");
  if (view === "buyer" && canAccessBuyerApp()) localStorage.setItem(DASHBOARD_VIEW_KEY, "buyer");
}

function getDashboardView() {
  if (getPrimaryRole() === "seller") {
    return localStorage.getItem(DASHBOARD_VIEW_KEY) === "buyer" ? "buyer" : "seller";
  }
  return "buyer";
}

function setLoggedIn(value, payload = {}) {
  if (value) {
    if (payload.token) localStorage.setItem(TOKEN_KEY, payload.token);
    if (payload.user) localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
    localStorage.setItem(MOCK_AUTH_KEY, "true");
    localStorage.setItem(DASHBOARD_VIEW_KEY, payload.user?.primaryRole === "seller" ? "seller" : "buyer");
  } else {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(MOCK_AUTH_KEY);
    localStorage.removeItem(REDIRECT_KEY);
    localStorage.removeItem(DASHBOARD_VIEW_KEY);
  }
}

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(path, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "请求失败");
  return data;
}

function getRoute() {
  const hash = window.location.hash || "#/";
  return hash.replace("#/", "").split("/").filter(Boolean);
}

async function syncBackendData() {
  if (!apiMode) return;
  try {
    const mediaResponse = await api("/api/media");
    if (Array.isArray(mediaResponse.items)) {
      mediaList.splice(0, mediaList.length, ...mediaResponse.items);
    }
  } catch {
    // file/static preview can continue using mock data.
  }

  if (isLoggedIn()) {
    try {
      const orderResponse = await api("/api/orders");
      if (Array.isArray(orderResponse.items)) {
        orders.splice(0, orders.length, ...orderResponse.items.map(normalizeOrder));
      }
    } catch {
      // Role may not have orders yet.
    }
  }
}

function normalizeOrder(order) {
  return {
    ...order,
    mediaName: order.mediaName || order.mediaId,
    project: order.brandName || order.project || "发稿订单",
    amount: order.amount || 0,
    eta: order.updatedAt ? order.updatedAt.slice(0, 10) : "待确认",
  };
}

async function render() {
  await syncBackendData();
  const [section, subSection, extraSection] = getRoute();
  let page = "";
  let active = "home";
  let variant = "public";

  if (!section) {
    page = homePage();
    active = "home";
  } else if (section === "media" && subSection) {
    page = isLoggedIn() ? mediaDetailPage(subSection) : mediaListPage();
    active = "media";
  } else if (section === "media") {
    page = mediaListPage();
    active = "media";
  } else if (section === "order") {
    if (!isLoggedIn()) {
      setRedirect(window.location.hash || "#/");
      page = loginPage();
      active = "login";
    } else if (!canAccessBuyerApp()) {
      page = permissionDeniedPage("你当前没有 Buyer 权限，不能创建订单。", getDefaultAppRoute());
      active = "login";
    } else {
      page = orderPage(subSection, extraSection);
      active = "media";
    }
  } else if (section === "login") {
    page = loginPage();
    active = "login";
  } else if (section === "register") {
    page = registerPage();
    active = "register";
  } else if (section === "contact") {
    page = contactPage();
    active = "contact";
  } else if (section === "buyer" || section === "account") {
    variant = "app";
    if (!isLoggedIn()) {
      setRedirect("#/buyer");
      variant = "public";
      page = loginPage();
      active = "login";
    } else if (!canAccessBuyerApp()) {
      page = permissionDeniedPage("你当前没有 Buyer 后台访问权限。", getDefaultAppRoute());
      active = "app";
    } else {
      setDashboardView("buyer");
      active = subSection ? `buyer-${subSection}${extraSection ? `-${extraSection}` : ""}` : "buyer-dashboard";
      if (!subSection || subSection === "dashboard") {
        page = buyerDashboardPage();
      } else if (subSection === "favorites") {
        page = buyerFavoritesPage(extraSection || "orders");
      } else if (subSection === "cart") {
        page = buyerCartPage();
      } else if (subSection === "orders") {
        page = buyerOrderListPage();
      } else if (subSection === "apply-seller") {
        page = buyerSellerApplicationPage();
      } else {
        page = buyerDashboardPage();
      }
    }
  } else if (section === "seller" || section === "publisher-dashboard") {
    variant = "app";
    if (!isLoggedIn()) {
      setRedirect("#/seller");
      variant = "public";
      page = loginPage();
      active = "login";
    } else if (!canAccessSellerApp()) {
      page = permissionDeniedPage("Seller 后台需要先完成申请并审核通过。", "#/buyer");
      active = "app";
    } else {
      setDashboardView("seller");
      active = subSection ? `seller-${subSection}` : "seller-dashboard";
      if (!subSection || subSection === "dashboard") {
        page = sellerDashboardPage();
      } else if (subSection === "orders") {
        page = sellerOrdersPage();
      } else if (subSection === "profile") {
        page = sellerProfilePage();
      } else {
        page = sellerDashboardPage();
      }
    }
  } else if (section === "admin") {
    page = permissionDeniedPage("当前展示版本不包含 Admin 系统，管理员后台会独立拆分。", "#/");
    active = "home";
  } else if (section === "publisher") {
    page = registerPage();
    active = "register";
  } else {
    page = homePage();
  }

  app.innerHTML = shell(page, { active, variant });
  bindInteractions();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function bindInteractions() {
  const menuButton = document.querySelector("[data-menu-button]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  menuButton?.addEventListener("click", () => mobileNav?.classList.toggle("open"));

  bindMediaFilters();
  bindAuth();
  bindContactForm();
  bindRecharge();
  bindForms();
  bindEditor();
  bindActionModals();
}

function bindAuth() {
  const loginForm = document.querySelector("[data-login-form]");
  const registerForm = document.querySelector("[data-register-form]");
  const [emailInput, passwordInput] = loginForm?.querySelectorAll("input") || [];

  document.querySelectorAll("[data-demo-login]").forEach((button) => {
    button.addEventListener("click", () => {
      if (emailInput) emailInput.value = button.dataset.email || "";
      if (passwordInput) passwordInput.value = button.dataset.password || "";
      emailInput?.focus();
    });
  });

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = emailInput?.value || "buyer@example.com";
    const password = passwordInput?.value || "buyer123";
    if (apiMode) {
      try {
        const result = await api("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        result.user.primaryRole =
          result.user?.primaryRole || (result.user?.roles?.includes("seller") ? "seller" : "buyer");
        setLoggedIn(true, result);
      } catch (error) {
        alert(`登录失败：${error.message}`);
        return;
      }
    } else {
      const role = email.includes("seller") ? "seller" : "buyer";
      setLoggedIn(true, {
        user: {
          id: `mock_${role}`,
          name: role === "seller" ? "演示卖家" : "演示买家",
          email,
          roles: role === "seller" ? ["buyer", "seller"] : ["buyer"],
          primaryRole: role,
          sellerStatus: role === "seller" ? "approved" : "none",
          balance: role === "seller" ? 0 : 2480,
        },
      });
    }
    const redirect = consumeRedirect();
    window.location.hash = redirect || getDefaultAppRoute();
  });

  registerForm?.querySelectorAll("[data-role-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const role = button.dataset.roleChoice || "buyer";
      const roleInput = registerForm.querySelector("input[name='role']");
      if (roleInput) roleInput.value = role;
      registerForm.querySelectorAll("[data-role-choice]").forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });
    });
  });

  registerForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(registerForm);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      password: String(formData.get("password") || "").trim(),
      role: String(formData.get("role") || "buyer"),
    };
    const agreed = Boolean(formData.get("agree"));

    if (!payload.email || !payload.password) {
      alert("请填写邮箱和密码。");
      return;
    }

    if (!agreed) {
      alert("请先确认服务条款与隐私说明。");
      return;
    }

    if (apiMode) {
      try {
        const result = await api("/api/auth/register", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        result.user.primaryRole =
          result.user?.primaryRole ||
          (payload.role === "seller" && result.user?.roles?.includes("seller") ? "seller" : "buyer");
        setLoggedIn(true, result);
      } catch (error) {
        alert(`注册失败：${error.message}`);
        return;
      }
    } else {
      setLoggedIn(true, {
        user: {
          id: `mock_${payload.role}`,
          name: payload.name || "新用户",
          email: payload.email,
          roles: payload.role === "seller" ? ["buyer", "seller"] : ["buyer"],
          primaryRole: payload.role === "seller" ? "seller" : "buyer",
          sellerStatus: payload.role === "seller" ? "approved" : "none",
          balance: 0,
        },
      });
    }

    window.location.hash = getDefaultAppRoute();
  });

  document.querySelector("[data-logout]")?.addEventListener("click", () => {
    setLoggedIn(false);
    window.location.hash = "#/";
  });

  document.querySelectorAll("[data-switch-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetView = button.dataset.switchView;
      setDashboardView(targetView);
      window.location.hash = targetView === "seller" ? "#/seller/dashboard" : "#/buyer/dashboard";
    });
  });
}

function bindContactForm() {
  document.querySelector("[data-contact-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("你的问题已提交。下一版可以接到真实线索系统或邮件。");
    event.currentTarget.reset();
  });
}

function bindRecharge() {
  const rechargeModal = document.querySelector("[data-recharge-modal]");
  document.querySelectorAll("[data-open-recharge]").forEach((button) => {
    button.addEventListener("click", () => {
      if (rechargeModal) rechargeModal.hidden = false;
    });
  });
  document.querySelector("[data-close-recharge]")?.addEventListener("click", () => {
    if (rechargeModal) rechargeModal.hidden = true;
  });
  rechargeModal?.addEventListener("click", (event) => {
    if (event.target === rechargeModal) rechargeModal.hidden = true;
  });

  document.querySelectorAll("[data-create-deposit]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!apiMode) return alert("静态预览模式下不会保存充值单。请用 npm start 启动后端。");
      try {
        await api("/api/deposits", {
          method: "POST",
          body: JSON.stringify({
            method: button.dataset.method,
            network: button.dataset.network,
            amount: 1000,
          }),
        });
        alert("充值单已创建，请等待管理员确认入账。");
        if (rechargeModal) rechargeModal.hidden = true;
      } catch (error) {
        alert(`充值失败：${error.message}`);
      }
    });
  });
}

function bindForms() {
  document.querySelector("[data-order-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const [section, mediaId, sellerId] = getRoute();
    const inputs = event.currentTarget.querySelectorAll("input");
    const editor = document.querySelector("[data-editor]");
    if (apiMode) {
      try {
        await api("/api/orders", {
          method: "POST",
          body: JSON.stringify({
            mediaId,
            sellerId,
            brandName: inputs[0]?.value || "未命名品牌",
            targetUrl: inputs[1]?.value || "",
            anchor: inputs[2]?.value || "",
            title: inputs[4]?.value || "未命名稿件",
            contentHtml: editor?.innerHTML || "",
            notes: event.currentTarget.querySelector("textarea")?.value || "",
          }),
        });
        alert("订单已提交，已保存到后端。");
      } catch (error) {
        alert(`提交订单失败：${error.message}`);
        return;
      }
    } else {
      alert("静态预览模式下不会保存订单。请用 npm start 启动后端。");
    }
    window.location.hash = "#/buyer";
  });

  document.querySelector("[data-publisher-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!apiMode) return alert("静态预览模式下不会保存媒体。请用 npm start 启动后端。");
    const inputs = event.currentTarget.querySelectorAll("input");
    try {
      await api("/api/media", {
        method: "POST",
        body: JSON.stringify({
          name: inputs[0]?.value || "New Media",
          domain: inputs[1]?.value || "",
          country: inputs[2]?.value || "",
          language: inputs[3]?.value || "",
          category: inputs[4]?.value || "",
          traffic: 0,
          dr: 0,
          da: 0,
          indexed: false,
          description: event.currentTarget.querySelector("textarea")?.value || "",
        }),
      });
      alert("媒体已提交审核，管理员通过后会展示到前台。");
    } catch (error) {
      alert(`提交失败：${error.message}`);
    }
  });

  document.querySelector("[data-seller-application-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const currentUser = getUser();
    if (!currentUser) {
      alert("请先登录 Buyer 账号。");
      window.location.hash = "#/login";
      return;
    }
    if (currentUser.roles?.includes("seller")) {
      alert("你的账号已经开通 Seller 权限。");
      window.location.hash = "#/seller/dashboard";
      return;
    }
    updateStoredUser({ sellerStatus: "pending" });
    alert("Seller 申请已提交，当前状态已更新为审核中。");
    render();
  });

  document.querySelectorAll("[data-demo-action]").forEach((button) => {
    button.addEventListener("click", () => {
      alert("演示按钮。真实保存动作已接到专用表单按钮，例如充值、下单、提交报价、提交发布链接、修改订单状态。");
    });
  });
}

function bindActionModals() {
  const mappings = [
    ["[data-open-seller-form]", "[data-seller-form-modal]"],
    ["[data-open-publish-form]", "[data-publish-form-modal]"],
    ["[data-open-admin-status]", "[data-admin-status-modal]"],
  ];

  mappings.forEach(([triggerSelector, modalSelector]) => {
    const modal = document.querySelector(modalSelector);
    document.querySelectorAll(triggerSelector).forEach((trigger) => {
      trigger.addEventListener("click", () => {
        if (modal) modal.hidden = false;
      });
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest(".modal-backdrop");
      if (modal) modal.hidden = true;
    });
  });

  document.querySelectorAll(".modal-backdrop").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) modal.hidden = true;
    });
  });

  document.querySelector("[data-submit-seller-quote]")?.addEventListener("click", submitSellerQuote);
  document.querySelector("[data-submit-publish-url]")?.addEventListener("click", submitPublishUrl);
  document.querySelector("[data-admin-save-status]")?.addEventListener("click", submitAdminStatus);
}

async function submitSellerQuote() {
  if (!apiMode) return alert("静态预览模式下不会保存报价。请用 npm start 启动后端。");
  const modal = document.querySelector("[data-seller-form-modal]");
  const inputs = modal.querySelectorAll("input");
  const selects = modal.querySelectorAll("select");
  const domain = inputs[0]?.value?.trim();
  const media = mediaList.find((item) => item.domain === domain || item.id === domain) || mediaList[0];
  try {
    await api(`/api/media/${media.id}/sellers`, {
      method: "POST",
      body: JSON.stringify({
        role: selects[0]?.value === "网站所有者" ? "Owner" : "Reseller",
        name: selects[0]?.value || "Reseller/代理商",
        price: Number(String(inputs[1]?.value || "0").replace(/[^\d.]/g, "")),
        delivery: inputs[2]?.value || "5-7天",
        linkType: selects[1]?.value === "No follow" ? "Nofollow" : "Dofollow",
        sponsored: selects[2]?.value === "是",
        indexed: false,
        note: modal.querySelector("textarea")?.value || "",
      }),
    });
    alert("报价已提交审核。");
    modal.hidden = true;
    render();
  } catch (error) {
    alert(`提交报价失败：${error.message}`);
  }
}

async function submitPublishUrl() {
  if (!apiMode) return alert("静态预览模式下不会保存发布链接。请用 npm start 启动后端。");
  const modal = document.querySelector("[data-publish-form-modal]");
  const orderId = modal.querySelector("[data-publish-order-id]")?.value?.trim();
  const publishUrl = modal.querySelector("[data-publish-url]")?.value?.trim();
  if (!orderId) return alert("请填写订单编号。");
  try {
    await api(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "published", publishUrl }),
    });
    alert("发布链接已提交，订单进入待验收。");
    modal.hidden = true;
    render();
  } catch (error) {
    alert(`提交发布链接失败：${error.message}`);
  }
}

async function submitAdminStatus() {
  if (!apiMode) return alert("静态预览模式下不会保存订单状态。请用 npm start 启动后端。");
  const modal = document.querySelector("[data-admin-status-modal]");
  const orderId = modal.querySelector("[data-admin-order-id]")?.value?.trim();
  const status = modal.querySelector("[data-admin-order-status]")?.value;
  if (!orderId) return alert("请填写订单编号。");
  try {
    await api(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    alert("订单状态已更新。");
    modal.hidden = true;
    render();
  } catch (error) {
    alert(`修改状态失败：${error.message}`);
  }
}

function bindEditor() {
  document.querySelectorAll("[data-editor-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const editor = document.querySelector("[data-editor]");
      if (!editor) return;
      const action = button.dataset.editorAction;
      if (["h1", "h2", "h3"].includes(action)) {
        editor.insertAdjacentHTML("beforeend", `<${action}>新${action.toUpperCase()}标题</${action}>`);
      }
      if (action === "link") {
        editor.insertAdjacentHTML("beforeend", '<p><a href="https://example.com" target="_blank">示例链接</a></p>');
      }
      if (action === "image") {
        editor.insertAdjacentHTML("beforeend", '<figure class="editor-image-placeholder">图片占位</figure>');
      }
      editor.focus();
    });
  });
}

function bindMediaFilters() {
  const tableTarget = document.querySelector("[data-media-table]");
  const search = document.querySelector("[data-media-search]");
  const filters = Array.from(document.querySelectorAll("[data-media-filter]"));

  if (!tableTarget || !isLoggedIn()) return;

  const update = () => {
    const keyword = (search?.value || "").trim().toLowerCase();
    const values = Object.fromEntries(filters.map((filter) => [filter.dataset.mediaFilter, filter.value]));

    const filtered = mediaList.filter((media) => {
      const textMatch = [media.name, media.domain, media.country, media.category, media.language].join(" ").toLowerCase().includes(keyword);
      const categoryMatch = !values.category || media.category === values.category;
      const languageMatch = !values.language || media.language === values.language;
      const trafficThreshold = Number(values.traffic || 0);
      const trafficMatch = !trafficThreshold || media.traffic >= trafficThreshold;
      const drMatch = !values.dr || media.dr >= Number(values.dr);
      const daMatch = !values.da || media.da >= Number(values.da);
      const indexedMatch = !values.indexed || String(media.indexed) === values.indexed || media.sellers.some((seller) => String(seller.indexed) === values.indexed);
      const linkMatch = !values.linkType || media.linkType === values.linkType || media.sellers.some((seller) => seller.linkType === values.linkType);
      const sponsoredMatch = !values.sponsored || media.sellers.some((seller) => String(seller.sponsored) === values.sponsored);
      return textMatch && categoryMatch && languageMatch && trafficMatch && drMatch && daMatch && indexedMatch && linkMatch && sponsoredMatch;
    });

    tableTarget.innerHTML = mediaTable(filtered);
  };

  search?.addEventListener("input", update);
  filters.forEach((filter) => filter.addEventListener("change", update));
}

window.addEventListener("hashchange", () => render());
render();
