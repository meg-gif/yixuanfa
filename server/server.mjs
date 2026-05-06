import crypto from "node:crypto";
import http from "node:http";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const PORT = Number(process.env.PORT || 4173);
const ROOT = resolve(".");
const DATA_DIR = resolve("server/data");
const DATA_FILE = join(DATA_DIR, "app-data.json");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

const initialData = {
  users: [
    {
      id: "user_admin",
      name: "平台管理员",
      email: "admin@example.com",
      roles: ["admin", "buyer", "seller"],
      primaryRole: "admin",
      sellerStatus: "approved",
      passwordHash: hashPassword("admin123"),
      balance: 2480,
      createdAt: now(),
    },
    {
      id: "user_buyer",
      name: "演示买家",
      email: "buyer@example.com",
      roles: ["buyer"],
      primaryRole: "buyer",
      sellerStatus: "none",
      passwordHash: hashPassword("buyer123"),
      balance: 2480,
      createdAt: now(),
    },
    {
      id: "user_seller",
      name: "演示卖家",
      email: "seller@example.com",
      roles: ["buyer", "seller"],
      primaryRole: "seller",
      sellerStatus: "approved",
      passwordHash: hashPassword("seller123"),
      balance: 0,
      createdAt: now(),
    },
  ],
  sessions: [],
  media: [
    {
      id: "tech-daily-us",
      name: "NorthTech Daily",
      domain: "northtechdaily.com",
      country: "美国",
      language: "英文",
      category: "科技媒体",
      dr: 72,
      da: 68,
      traffic: 420000,
      trafficLabel: "420K",
      indexed: true,
      status: "approved",
      submittedBy: "user_seller",
      createdAt: now(),
      description: "覆盖 SaaS、AI、消费电子和创业公司动态。",
      sellers: [
        {
          id: "seller_owner_tech",
          userId: "user_seller",
          role: "Owner",
          name: "网站所有者",
          price: 680,
          linkType: "Dofollow",
          indexed: true,
          sponsored: false,
          delivery: "5-7天",
          status: "approved",
          note: "网站所有者直接接单",
        },
        {
          id: "seller_reseller_tech",
          userId: "user_seller",
          role: "Reseller",
          name: "认证 SEO 合作方",
          price: 590,
          linkType: "Dofollow",
          indexed: true,
          sponsored: false,
          delivery: "7-10天",
          status: "approved",
          note: "网站合作编辑，代理商接单",
        },
      ],
    },
    {
      id: "chain-pulse",
      name: "Chain Pulse Weekly",
      domain: "chainpulseweekly.io",
      country: "美国",
      language: "英文",
      category: "区块链媒体",
      dr: 69,
      da: 63,
      traffic: 310000,
      trafficLabel: "310K",
      indexed: true,
      status: "approved",
      submittedBy: "user_seller",
      createdAt: now(),
      description: "关注 Web3 基础设施、交易所、钱包、NFT 与链上工具。",
      sellers: [
        {
          id: "seller_reseller_chain",
          userId: "user_seller",
          role: "Reseller",
          name: "Web3 PR 服务商",
          price: 880,
          linkType: "Dofollow",
          indexed: true,
          sponsored: false,
          delivery: "3-6天",
          status: "approved",
          note: "适合项目公告和品牌稿",
        },
      ],
    },
  ],
  orders: [],
  deposits: [],
};

async function main() {
  await ensureData();
  const server = http.createServer(async (req, res) => {
    try {
      if (req.url?.startsWith("/api/")) {
        await handleApi(req, res);
      } else {
        await serveStatic(req, res);
      }
    } catch (error) {
      json(res, error.status || 500, { error: error.message || "server_error" });
    }
  });

  server.listen(PORT, () => {
    console.log(`易宣发 MVP running at http://localhost:${PORT}`);
  });
}

async function handleApi(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const method = req.method || "GET";
  const path = url.pathname;
  const data = await loadData();
  const user = currentUser(req, data);

  if (method === "GET" && path === "/api/health") return json(res, 200, { ok: true });

  if (method === "POST" && path === "/api/auth/register") {
    const body = await readJson(req);
    const email = normalizeEmail(body.email);
    if (!email || !body.password) return json(res, 400, { error: "email_password_required" });
    if (data.users.some((item) => item.email === email)) return json(res, 409, { error: "email_exists" });
    const role = ["buyer", "seller"].includes(body.role) ? body.role : "buyer";
    const nextUser = {
      id: id("user"),
      name: body.name || email,
      email,
      roles: role === "seller" ? ["buyer", "seller"] : ["buyer"],
      primaryRole: role === "seller" ? "seller" : "buyer",
      sellerStatus: role === "seller" ? "approved" : "none",
      passwordHash: hashPassword(body.password),
      balance: 0,
      createdAt: now(),
    };
    data.users.push(nextUser);
    const token = createSession(data, nextUser.id);
    await saveData(data);
    return json(res, 201, { token, user: publicUser(nextUser) });
  }

  if (method === "POST" && path === "/api/auth/login") {
    const body = await readJson(req);
    const found = data.users.find((item) => item.email === normalizeEmail(body.email));
    if (!found || found.passwordHash !== hashPassword(body.password || "")) return json(res, 401, { error: "invalid_login" });
    const token = createSession(data, found.id);
    await saveData(data);
    return json(res, 200, { token, user: publicUser(found) });
  }

  if (method === "GET" && path === "/api/me") {
    if (!user) return json(res, 401, { error: "unauthorized" });
    return json(res, 200, { user: publicUser(user) });
  }

  if (method === "GET" && path === "/api/media") {
    const filtered = filterMedia(data.media, url.searchParams, Boolean(user));
    return json(res, 200, { items: filtered, total: filtered.length, locked: !user });
  }

  const mediaMatch = path.match(/^\/api\/media\/([^/]+)$/);
  if (method === "GET" && mediaMatch) {
    const media = data.media.find((item) => item.id === mediaMatch[1]);
    if (!media) return json(res, 404, { error: "media_not_found" });
    return json(res, 200, { media });
  }

  if (method === "POST" && path === "/api/media") {
    requireRole(user, "seller");
    const body = await readJson(req);
    const media = {
      id: id("media"),
      name: body.name,
      domain: body.domain,
      country: body.country,
      language: body.language,
      category: body.category,
      dr: Number(body.dr || 0),
      da: Number(body.da || 0),
      traffic: Number(body.traffic || 0),
      trafficLabel: body.trafficLabel || String(body.traffic || 0),
      indexed: Boolean(body.indexed),
      description: body.description || "",
      status: "pending",
      submittedBy: user.id,
      createdAt: now(),
      sellers: [],
    };
    data.media.push(media);
    await saveData(data);
    return json(res, 201, { media });
  }

  const sellerMatch = path.match(/^\/api\/media\/([^/]+)\/sellers$/);
  if (method === "POST" && sellerMatch) {
    requireRole(user, "seller");
    const media = findMedia(data, sellerMatch[1]);
    const body = await readJson(req);
    const seller = {
      id: id("seller"),
      userId: user.id,
      role: body.role === "Owner" ? "Owner" : "Reseller",
      name: body.name || (body.role === "Owner" ? "网站所有者" : "Reseller/代理商"),
      price: Number(body.price || 0),
      linkType: body.linkType === "Nofollow" ? "Nofollow" : "Dofollow",
      indexed: Boolean(body.indexed),
      sponsored: Boolean(body.sponsored),
      delivery: body.delivery || "5-7天",
      note: body.note || "",
      status: "pending",
    };
    media.sellers.push(seller);
    await saveData(data);
    return json(res, 201, { seller });
  }

  const approveMediaMatch = path.match(/^\/api\/admin\/media\/([^/]+)\/approve$/);
  if (method === "PATCH" && approveMediaMatch) {
    requireRole(user, "admin");
    const media = findMedia(data, approveMediaMatch[1]);
    media.status = "approved";
    await saveData(data);
    return json(res, 200, { media });
  }

  const approveSellerMatch = path.match(/^\/api\/admin\/media\/([^/]+)\/sellers\/([^/]+)\/approve$/);
  if (method === "PATCH" && approveSellerMatch) {
    requireRole(user, "admin");
    const media = findMedia(data, approveSellerMatch[1]);
    const seller = media.sellers.find((item) => item.id === approveSellerMatch[2]);
    if (!seller) return json(res, 404, { error: "seller_not_found" });
    seller.status = "approved";
    await saveData(data);
    return json(res, 200, { seller });
  }

  if (method === "POST" && path === "/api/orders") {
    requireRole(user, "buyer");
    const body = await readJson(req);
    const media = findMedia(data, body.mediaId);
    const seller = media.sellers.find((item) => item.id === body.sellerId);
    if (!seller) return json(res, 404, { error: "seller_not_found" });
    const order = {
      id: id("order"),
      buyerId: user.id,
      sellerUserId: seller.userId,
      mediaId: media.id,
      sellerId: seller.id,
      mediaName: media.name,
      sellerName: seller.name,
      amount: seller.price,
      status: "pending_payment",
      brandName: body.brandName,
      targetUrl: body.targetUrl,
      anchor: body.anchor,
      title: body.title,
      contentHtml: body.contentHtml,
      notes: body.notes || "",
      publishUrl: "",
      createdAt: now(),
      updatedAt: now(),
    };
    data.orders.push(order);
    await saveData(data);
    return json(res, 201, { order });
  }

  if (method === "GET" && path === "/api/orders") {
    if (!user) return json(res, 401, { error: "unauthorized" });
    const items = data.orders.filter((order) => {
      if (hasRole(user, "admin")) return true;
      if (hasRole(user, "seller") && order.sellerUserId === user.id) return true;
      return order.buyerId === user.id;
    });
    return json(res, 200, { items });
  }

  const orderStatusMatch = path.match(/^\/api\/orders\/([^/]+)\/status$/);
  if (method === "PATCH" && orderStatusMatch) {
    if (!user) return json(res, 401, { error: "unauthorized" });
    const order = findOrder(data, orderStatusMatch[1]);
    const body = await readJson(req);
    if (!canEditOrder(user, order)) return json(res, 403, { error: "forbidden" });
    order.status = body.status || order.status;
    order.publishUrl = body.publishUrl ?? order.publishUrl;
    order.updatedAt = now();
    await saveData(data);
    return json(res, 200, { order });
  }

  if (method === "POST" && path === "/api/deposits") {
    requireRole(user, "buyer");
    const body = await readJson(req);
    const deposit = {
      id: id("deposit"),
      userId: user.id,
      method: body.method,
      network: body.network || "",
      amount: Number(body.amount || 0),
      status: "pending",
      createdAt: now(),
      confirmedAt: "",
    };
    data.deposits.push(deposit);
    await saveData(data);
    return json(res, 201, { deposit });
  }

  if (method === "GET" && path === "/api/deposits") {
    if (!user) return json(res, 401, { error: "unauthorized" });
    const items = hasRole(user, "admin") ? data.deposits : data.deposits.filter((item) => item.userId === user.id);
    return json(res, 200, { items });
  }

  const confirmDepositMatch = path.match(/^\/api\/admin\/deposits\/([^/]+)\/confirm$/);
  if (method === "PATCH" && confirmDepositMatch) {
    requireRole(user, "admin");
    const deposit = data.deposits.find((item) => item.id === confirmDepositMatch[1]);
    if (!deposit) return json(res, 404, { error: "deposit_not_found" });
    deposit.status = "confirmed";
    deposit.confirmedAt = now();
    const owner = data.users.find((item) => item.id === deposit.userId);
    if (owner) owner.balance += deposit.amount;
    await saveData(data);
    return json(res, 200, { deposit });
  }

  return json(res, 404, { error: "not_found" });
}

function filterMedia(media, params, authenticated) {
  let items = media.filter((item) => item.status === "approved");
  const keyword = (params.get("q") || "").toLowerCase();
  if (keyword) {
    items = items.filter((item) => [item.name, item.domain, item.country, item.language, item.category].join(" ").toLowerCase().includes(keyword));
  }
  const category = params.get("category");
  const language = params.get("language");
  const traffic = Number(params.get("traffic") || 0);
  const dr = Number(params.get("dr") || 0);
  const da = Number(params.get("da") || 0);
  const indexed = params.get("indexed");
  const linkType = params.get("linkType");
  const sponsored = params.get("sponsored");

  if (category) items = items.filter((item) => item.category === category);
  if (language) items = items.filter((item) => item.language === language);
  if (traffic) items = items.filter((item) => item.traffic >= traffic);
  if (dr) items = items.filter((item) => item.dr >= dr);
  if (da) items = items.filter((item) => item.da >= da);
  if (indexed) items = items.filter((item) => String(item.indexed) === indexed || item.sellers.some((seller) => String(seller.indexed) === indexed));
  if (linkType) items = items.filter((item) => item.sellers.some((seller) => seller.linkType === linkType));
  if (sponsored) items = items.filter((item) => item.sellers.some((seller) => String(seller.sponsored) === sponsored));
  return authenticated ? items : items.slice(0, 20);
}

async function serveStatic(req, res) {
  const url = new URL(req.url || "/", `http://localhost:${PORT}`);
  const requested = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const filePath = normalize(join(ROOT, requested));
  if (!filePath.startsWith(ROOT)) return text(res, 403, "Forbidden");

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) throw new Error("not_file");
    res.writeHead(200, { "Content-Type": contentTypes[extname(filePath)] || "application/octet-stream" });
    createReadStream(filePath).pipe(res);
  } catch {
    const fallback = await readFile(join(ROOT, "index.html"));
    res.writeHead(200, { "Content-Type": contentTypes[".html"] });
    res.end(fallback);
  }
}

async function ensureData() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(DATA_FILE, "utf8");
  } catch {
    await saveData(initialData);
  }
}

async function loadData() {
  return JSON.parse(await readFile(DATA_FILE, "utf8"));
}

async function saveData(data) {
  await writeFile(DATA_FILE, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function currentUser(req, data) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const session = data.sessions.find((item) => item.token === token);
  if (!session) return null;
  return data.users.find((item) => item.id === session.userId) || null;
}

function createSession(data, userId) {
  const token = crypto.randomBytes(24).toString("hex");
  data.sessions.push({ token, userId, createdAt: now() });
  return token;
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    roles: user.roles,
    primaryRole: user.primaryRole || (user.roles?.includes("seller") ? "seller" : "buyer"),
    sellerStatus: user.sellerStatus || (user.roles?.includes("seller") ? "approved" : "none"),
    balance: user.balance,
  };
}

function hasRole(user, role) {
  return Boolean(user?.roles?.includes(role));
}

function requireRole(user, role) {
  if (!user) throw Object.assign(new Error("unauthorized"), { status: 401 });
  if (!hasRole(user, role) && !hasRole(user, "admin")) throw Object.assign(new Error("forbidden"), { status: 403 });
}

function canEditOrder(user, order) {
  return hasRole(user, "admin") || order.buyerId === user.id || order.sellerUserId === user.id;
}

function findMedia(data, mediaId) {
  const media = data.media.find((item) => item.id === mediaId);
  if (!media) throw Object.assign(new Error("media_not_found"), { status: 404 });
  return media;
}

function findOrder(data, orderId) {
  const order = data.orders.find((item) => item.id === orderId);
  if (!order) throw Object.assign(new Error("order_not_found"), { status: 404 });
  return order;
}

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function text(res, status, body) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(body);
}

function normalizeEmail(email = "") {
  return String(email).trim().toLowerCase();
}

function hashPassword(password) {
  return crypto.createHash("sha256").update(`haimeitong:${password}`).digest("hex");
}

function id(prefix) {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
}

function now() {
  return new Date().toISOString();
}

main();
