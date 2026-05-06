function categorySummary(limit = 4) {
  return Object.entries(
    mediaList.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function sellerMix(media) {
  const ownerCount = media.sellers.filter((seller) => seller.role === "Owner").length;
  return ownerCount ? "含网站所有者报价" : "仅代理/合作方报价";
}

function homePage() {
  const featured = mediaList.filter((item) => item.featured);
  const categoryCards = categorySummary();
  const fastTrack = [...mediaList]
    .sort((a, b) => minSellerPrice(a) - minSellerPrice(b))
    .slice(0, 3);
  return `
    <section class="hero hero--editorial">
      <div class="hero-copy">
        <p class="eyebrow">海外媒体发稿 · Digital PR · AI Visibility</p>
        <h1>让你的品牌被看见，在 Google 和 AI 工具里持续被找到</h1>
        <p class="lead">易宣发面向中国出海品牌、营销团队和代理商，帮助你更高效地找到全球媒体资源、管理海外发稿、提升品牌曝光率，并为搜索引擎和 AI 工具建立长期可见度。</p>
        <div class="hero-badges">
          <span>品牌曝光</span>
          <span>Digital PR</span>
          <span>SEO & AI Visibility</span>
        </div>
        <div class="hero-actions">
          <a class="button primary" href="#/media">浏览媒体市场</a>
          <a class="button secondary" href="#/register">注册进入工作台</a>
        </div>
        <div class="hero-mini-stats">
          <div><span>上线媒体</span><strong>${stats.mediaCount}</strong></div>
          <div><span>平均交付</span><strong>${stats.avgDelivery}</strong></div>
          <div><span>覆盖国家</span><strong>${stats.countries}</strong></div>
        </div>
      </div>
      <div class="hero-panel hero-panel--stack" aria-label="平台业务概览">
        <div class="panel-top">
          <span>GLOBAL BRAND VISIBILITY</span>
          <strong>帮助品牌进入媒体、搜索与 AI 推荐语境</strong>
        </div>
        <div class="signal-card">
          <div>
            <span>适合的使用场景</span>
            <strong>品牌发布、融资消息、产品上线、SEO 外链、地区市场造势</strong>
          </div>
          <b>+18%</b>
        </div>
        <div class="market-board">
          <div class="board-row headline">
            <span>品牌曝光并不只发生在搜索里</span><em>媒体提及、搜索结果与 AI 回答会共同影响用户认知</em>
          </div>
          ${categoryCards
            .map(
              ([name, count]) => `
                <div class="board-row">
                  <span>${name}</span><em>${count} 个可浏览资源</em>
                </div>
              `
            )
            .join("")}
          <div class="board-chart" aria-hidden="true">
            <i style="height: 38%"></i><i style="height: 61%"></i><i style="height: 52%"></i>
            <i style="height: 74%"></i><i style="height: 68%"></i><i style="height: 86%"></i>
          </div>
        </div>
        <div class="quote-ladder">
          ${fastTrack
            .map(
              (item) => `
                <div>
                  <span>${item.name}</span>
                  <strong>$${minSellerPrice(item)} 起</strong>
                  <em>${sellerMix(item)} · 适合品牌曝光与外链建设</em>
                </div>
              `
            )
            .join("")}
        </div>
        <div class="mini-list">
          <span>媒体审核</span><strong>92%</strong>
          <span>Google / AI 可见度</span><strong>长期积累</strong>
          <span>跨市场资源</span><strong>持续扩展</strong>
        </div>
      </div>
    </section>

    <section class="stats">
      ${metric("媒体资源", stats.mediaCount)}
      ${metric("覆盖国家", stats.countries)}
      ${metric("平均发布", stats.avgDelivery)}
      ${metric("行业分类", stats.categories)}
    </section>

    <section class="section story-strip">
      <div class="section-head">
        <div>
          <p class="eyebrow">A. 让你的品牌被看见</p>
          <h2>把媒体资源、网站指标与市场信息放在一起，帮助你更快做出曝光决策</h2>
        </div>
      </div>
      <div class="hero-badges tool-badges">
        <span>Ahrefs</span>
        <span>Moz</span>
        <span>Similarweb</span>
        <span>Google Index</span>
        <span>Search Visibility</span>
      </div>
      <div class="insight-grid">
        <article>
          <span>01</span>
          <strong>基于数据看资源</strong>
          <p>在浏览媒体时，同步参考国家、语言、DR、DA、流量、收录和链接规则，而不是只凭单一报价做决定。</p>
        </article>
        <article>
          <span>02</span>
          <strong>把品牌内容放进可信语境</strong>
          <p>当用户在 Google、媒体站点或 AI 工具中搜索行业信息时，公开内容和媒体提及会不断强化品牌信任。</p>
        </article>
        <article>
          <span>03</span>
          <strong>减少人工沟通和试错</strong>
          <p>将媒体筛选、资源浏览和后续登录工作台的路径拆开，让用户先理解平台，再逐步进入操作流程。</p>
        </article>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div>
          <p class="eyebrow">B. 在 Google 和 AI 工具中被看到</p>
          <h2>品牌宣发不只影响搜索结果，也会影响 ChatGPT、Perplexity、Claude、Gemini 等工具对品牌的引用概率</h2>
        </div>
      </div>
      <div class="category-grid">
        ${categoryCards
          .map(
            ([name, count], index) => `
              <article class="category-card">
                <span>0${index + 1}</span>
                <strong>${name}</strong>
                <p>${count} 个可浏览资源，可用于品牌宣发、产品发布、知识内容分发和外链建设，帮助品牌在公开语料中被不断看到。</p>
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="section featured-section">
      <div class="section-head">
        <div>
          <p class="eyebrow">精选资源</p>
          <h2>适合海外曝光的媒体资源</h2>
        </div>
        <a class="text-link" href="#/media">查看全部</a>
      </div>
      <div class="featured-layout">
        <div class="card-grid">
          ${featured.map(mediaCard).join("")}
        </div>
        <aside class="content-block compare-card">
          <p class="eyebrow">为什么这很重要</p>
          <h2>你的品牌在公开网络上的存在感，会影响用户和 AI 对你的认知</h2>
          <div class="todo-list">
            <div><span class="status success">Google</span><strong>品牌词、产品词、行业词相关内容会长期沉淀在搜索环境中</strong></div>
            <div><span class="status info">AI 工具</span><strong>公开可引用内容越丰富，越容易在 AI 总结和推荐中被提及</strong></div>
            <div><span class="status warning">品牌信任</span><strong>海外用户更愿意相信在多个公开来源里都能被找到的品牌</strong></div>
          </div>
          <a class="button ghost full" href="#/media">去浏览媒体市场</a>
        </aside>
      </div>
    </section>

    <section class="section split split-alt">
      <div>
        <p class="eyebrow">C. 我们能帮你做什么</p>
        <h2>从资源浏览到实际投放，易宣发帮助你缩短海外媒体曝光的启动路径</h2>
        <p class="muted">对于品牌方，你可以更快找到适合自己市场、语言和预算的媒体资源；对于团队和代理商，你可以把原本分散的资源筛选、询价和执行前准备整合到同一套路径里。</p>
      </div>
      <div class="steps">
        ${["资源筛选", "品牌宣发", "SEO 外链", "多市场扩展", "工作台管理"]
          .map((step, index) => `<div><span>${index + 1}</span><strong>${step}</strong></div>`)
          .join("")}
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div>
          <p class="eyebrow">D. 我们的品牌是全球化的</p>
          <h2>易宣发面向全球市场做资源组织，帮助中国品牌进入更多国家、语言和行业环境</h2>
        </div>
      </div>
      <div class="market-summary">
        <article><span>覆盖国家</span><strong>${stats.countries}</strong><em>支持本地市场和多地区并行布局</em></article>
        <article><span>语言环境</span><strong>多语种</strong><em>适合英文及更多国际化场景</em></article>
        <article><span>行业方向</span><strong>${stats.categories}</strong><em>科技、金融、Web3 与综合垂直资源并行</em></article>
        <article><span>合作方式</span><strong>灵活</strong><em>支持品牌方、营销团队、代理商和 Seller 协作</em></article>
      </div>
    </section>

    <section class="section cta-band">
      <div>
        <p class="eyebrow">准备继续完善这个项目</p>
        <h2>当前先保留官网四页结构。你确认首页方向后，我再继续细化媒体市场、联系我们和登录/注册页。</h2>
      </div>
      <a class="button primary" href="#/register">注册体验工作台</a>
    </section>
  `;
}

function mediaListPage() {
  const loggedIn = isLoggedIn();
  const visibleItems = loggedIn ? mediaList.slice(0, 20) : mediaList.slice(0, 20);
  const disabled = loggedIn ? "" : "disabled";
  const lowestPrice = Math.min(...mediaList.map((item) => minSellerPrice(item)));
  const ownerReady = mediaList.filter((item) => item.sellers.some((seller) => seller.role === "Owner")).length;
  const indexedReady = mediaList.filter((item) => item.indexed || item.sellers.some((seller) => seller.indexed)).length;
  const spotlight = visibleItems.slice(0, 6);

  return `
    <section class="page-title">
      <p class="eyebrow">媒体市场</p>
      <h1>全球媒体资源 Marketplace</h1>
      <p class="muted">易宣发提供可公开浏览的海外媒体市场，帮助品牌、营销团队和代理商快速了解不同国家、行业与语言环境下的媒体资源。未登录时你可以浏览，登录后再进入工作台继续操作。</p>
    </section>

    <section class="market-summary">
      <article><span>可浏览资源</span><strong>${mediaList.length}</strong><em>当前公开站先展示精选媒体资源能力</em></article>
      <article><span>最低起价</span><strong>$${lowestPrice}</strong><em>适合品牌先做预算感知</em></article>
      <article><span>含 Owner 报价</span><strong>${ownerReady}</strong><em>支持网站所有者与代理商双重资源视角</em></article>
      <article><span>可做收录承诺</span><strong>${indexedReady}</strong><em>部分资源支持更强的收录预期</em></article>
    </section>

    ${loggedIn ? "" : publicMarketplaceLockedNotice()}

    <section class="filters ${loggedIn ? "" : "is-locked"}">
      <label class="search-field">
        <span>搜索</span>
        <input type="search" placeholder="输入国家、行业、媒体名称" data-media-search ${disabled} />
      </label>
      ${select("行业", [{ label: "全部", value: "" }, "金融媒体", "科技媒体", "区块链媒体", "多产业垂直媒体"], `data-media-filter="category" ${disabled}`)}
      ${select("语言", [{ label: "全部", value: "" }, "英文", "中文"], `data-media-filter="language" ${disabled}`)}
      ${select("月流量", [{ label: "全部", value: "" }, { label: "5万+", value: "50000" }, { label: "10万+", value: "100000" }, { label: "20万+", value: "200000" }, { label: "30万+", value: "300000" }], `data-media-filter="traffic" ${disabled}`)}
      ${select("DR", [{ label: "全部", value: "" }, { label: "DR 40+", value: "40" }, { label: "DR 50+", value: "50" }, { label: "DR 60+", value: "60" }], `data-media-filter="dr" ${disabled}`)}
      ${select("DA", [{ label: "全部", value: "" }, { label: "DA 40+", value: "40" }, { label: "DA 50+", value: "50" }, { label: "DA 60+", value: "60" }], `data-media-filter="da" ${disabled}`)}
      ${select("是否包谷歌收录", [{ label: "全部", value: "" }, { label: "是", value: "true" }, { label: "否", value: "false" }], `data-media-filter="indexed" ${disabled}`)}
      ${select("链接属性", [{ label: "全部", value: "" }, { label: "Do follow", value: "Dofollow" }, { label: "No follow", value: "Nofollow" }], `data-media-filter="linkType" ${disabled}`)}
      ${select("Sponsored", [{ label: "全部", value: "" }, { label: "是", value: "true" }, { label: "否", value: "false" }], `data-media-filter="sponsored" ${disabled}`)}
    </section>

    <section class="section no-top">
      <div class="section-head">
        <div>
          <h2>Marketplace Spotlight</h2>
          <p class="muted">${loggedIn ? "已登录时可继续进入工作台路径；当前仍保留品牌展示式布局。" : "当前为公开浏览模式，只展示资源截图与核心信息，不提供直接购买操作。"}</p>
        </div>
      </div>
      <div class="marketplace-showcase" data-media-table>
        ${spotlight.map(marketplaceBrandCard).join("")}
      </div>
    </section>

    <section class="section split split-alt">
      <div>
        <p class="eyebrow">全球资源网络</p>
        <h2>易宣发覆盖多国家、多语言与多行业的媒体资源环境</h2>
        <p class="muted">你可以在公开市场里先理解资源结构，再决定是否登录注册。对于不熟悉 SEO 或海外媒体投放的团队，也可以直接通过联系我们获取人工建议。</p>
      </div>
      <div class="steps">
        ${["科技媒体", "金融媒体", "Web3 媒体", "综合垂直媒体", "国际市场扩展"]
          .map((step, index) => `<div><span>${index + 1}</span><strong>${step}</strong></div>`)
          .join("")}
      </div>
    </section>

    <section class="section featured-section">
      <div class="section-head">
        <div>
          <p class="eyebrow">参数与能力</p>
          <h2>在公开市场中，你可以先了解资源质量与后续可用能力</h2>
        </div>
      </div>
      <div class="insight-grid">
        <article>
          <span>01</span>
          <strong>SEO 参数参考</strong>
          <p>公开展示 DR、DA、月流量、收录情况等基础参数，帮助你快速形成资源判断。</p>
        </article>
        <article>
          <span>02</span>
          <strong>多类型投放场景</strong>
          <p>适合品牌宣发、链接建设、产品发布、地区市场曝光与知识内容扩散。</p>
        </article>
        <article>
          <span>03</span>
          <strong>登录后继续操作</strong>
          <p>登录或注册后进入 Buyer / Seller 工作台，继续查看详情、提交需求与管理资源。</p>
        </article>
      </div>
    </section>

    <section class="section cta-band">
      <div>
        <p class="eyebrow">Ready to continue?</p>
        <h2>先浏览资源，再登录进入工作台。对资源选择有疑问，也可以先联系我们。</h2>
      </div>
      <div class="hero-actions">
        <a class="button primary" href="#/register">注册</a>
        <a class="button secondary" href="#/login">登录</a>
      </div>
    </section>
  `;
}

function mediaDetailPage(id) {
  const media = mediaList.find((item) => item.id === id) || mediaList[0];
  const ownerSeller = media.sellers.find((seller) => seller.role === "Owner");
  return `
    <section class="media-buy-header">
      <div class="buy-title-row">
        <div>
          <p class="eyebrow">${media.category}</p>
          <h1>${media.domain}</h1>
          <div class="tag-row">
            <span>${media.country}</span>
            <span>${media.language}</span>
            <span>${media.linkType === "Nofollow" ? "No follow" : "Do follow"}</span>
            <span>${media.indexed ? "包收录" : "不包收录"}</span>
          </div>
        </div>
        <a class="button ghost" href="#/media">返回媒体列表</a>
      </div>
      <div class="site-metrics-grid">
        <div><span>内容发布起价</span><strong>$${minSellerPrice(media)}</strong></div>
        <div><span>Ahrefs Organic Traffic</span><strong>${media.trafficLabel}</strong></div>
        <div><span>Moz DA</span><strong>${media.da}</strong></div>
        <div><span>Ahrefs DR</span><strong>${media.dr}</strong></div>
        <div><span>Language</span><strong>${media.language}</strong></div>
        <div><span>Country</span><strong>${media.country}</strong></div>
        <div><span>Link attribution type</span><strong>${media.linkType === "Nofollow" ? "No follow" : "Do follow"}</strong></div>
        <div><span>Indexing</span><strong>${media.indexed ? "包收录" : "不包收录"}</strong></div>
      </div>
    </section>

    <section class="detail-grid media-detail-grid">
      <article class="content-block wide detail-overview-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">媒体概览</p>
            <h2>${media.name}</h2>
          </div>
          <span class="status ${ownerSeller ? "success" : "info"}">${ownerSeller ? "含网站所有者直连报价" : "仅代理报价"}</span>
        </div>
        <p>${media.description}</p>
        <div class="detail-chip-grid">
          <div><span>最低报价</span><strong>$${minSellerPrice(media)}</strong></div>
          <div><span>卖家数量</span><strong>${media.sellers.length}</strong></div>
          <div><span>推荐交付</span><strong>${media.delivery}</strong></div>
          <div><span>适合场景</span><strong>${media.type}</strong></div>
        </div>
      </article>
      <article class="content-block">
        <p class="eyebrow">适合发布</p>
        <h2>接稿范围</h2>
        <div class="tag-row">
          ${media.accepts.map((item) => `<span>${item}</span>`).join("")}
        </div>
        <h3>不接受内容</h3>
        <div class="tag-row warning-tags">
          ${media.rejects.map((item) => `<span>${item}</span>`).join("")}
        </div>
      </article>
      <article class="content-block">
        <p class="eyebrow">投稿要求</p>
        <h2>编辑规则</h2>
        <p>${media.requirements}</p>
        <h3>适合选题</h3>
        <div class="channel-list">
          ${media.examples.map((example) => `<div class="channel-row"><strong>${example}</strong><span>适合品牌稿或新闻稿切入</span></div>`).join("")}
        </div>
      </article>
    </section>

    <section class="performer-section">
      <div class="section-head">
        <div>
          <p class="eyebrow">Owner / Reseller 报价</p>
          <h2>选择适合你的发布服务商</h2>
          <p class="muted">同一个网站可能由网站所有者直接接单，也可能由合作编辑、SEO 专家或媒体代理 Reseller/代理商接单。</p>
        </div>
      </div>
      <div class="performer-list">
          ${media.sellers
            .map(
              (seller) => `
                <article class="performer-card ${seller.role === "Owner" ? "is-owner" : ""}">
                  <div class="performer-main">
                    <h3>${seller.name}</h3>
                    <p>${seller.note}</p>
                    <div class="tag-row"><span>${seller.role === "Owner" ? "网站所有者" : "Reseller/代理商"}</span></div>
                  </div>
                  <div class="performer-data">
                    <div><span>Content placement</span><strong>$${seller.price}</strong></div>
                    <div><span>Turn around time</span><strong>${seller.delivery}</strong></div>
                    <div><span>Links</span><strong>${seller.linkType === "Nofollow" ? "No follow" : "Do follow"}</strong></div>
                    <div><span>Sponsored</span><strong>${seller.sponsored ? "Yes" : "No"}</strong></div>
                    <div><span>Indexing</span><strong>${seller.indexed ? "包收录" : "不包收录"}</strong></div>
                    <div><span>Max links</span><strong>2</strong></div>
                    <div><span>Min words</span><strong>500 words</strong></div>
                  </div>
                  <div class="performer-actions">
                    <button class="mini-button subtle" data-demo-action>收藏</button>
                    <a class="button primary" href="#/order/${media.id}/${seller.id}">Buy Now</a>
                  </div>
                </article>
              `
            )
            .join("")}
      </div>
    </section>
  `;
}

function orderPage(id, sellerId) {
  const media = mediaList.find((item) => item.id === id) || mediaList[0];
  const seller = media.sellers.find((item) => item.id === sellerId) || primarySeller(media);
  return `
    <section class="page-title">
      <p class="eyebrow">创建订单</p>
      <h1>提交发稿需求</h1>
      <p class="muted">你正在通过「${seller.name}」购买 ${media.name} 的发布服务。该卖家身份：${seller.role === "Owner" ? "网站所有者" : "Reseller/代理商"}。</p>
    </section>

    <section class="form-layout">
      <form class="form-card" data-order-form>
        <h2>项目与稿件信息</h2>
        <div class="form-grid">
          <label><span>品牌 / 公司名称</span><input required placeholder="例如：某 AI SaaS 公司" /></label>
          <label><span>目标网站</span><input required placeholder="https://example.com" /></label>
          <label><span>锚文本</span><input placeholder="英文锚文本或品牌名" /></label>
          <label><span>服务类型</span><input value="自备稿件" readonly /></label>
        </div>
        <label><span>文章标题</span><input placeholder="请输入英文或中文稿件标题" /></label>
        <div class="editor-wrap">
          <span>正文编辑器</span>
          <div class="editor-toolbar">
            <button type="button" data-editor-action="h1">H1</button>
            <button type="button" data-editor-action="h2">H2</button>
            <button type="button" data-editor-action="h3">H3</button>
            <button type="button" data-editor-action="link">插入链接</button>
            <button type="button" data-editor-action="image">插入图片</button>
          </div>
          <div class="mock-editor" contenteditable="true" data-editor>
            <h2>请在这里粘贴或编辑你的自备稿件</h2>
            <p>支持设置 H1 / H2 / H3 标题、插入链接和图片占位。当前为前端原型编辑器。</p>
          </div>
        </div>
        <label><span>补充备注</span><textarea rows="4" placeholder="例如：可接受编辑调整标题，不接受敏感表达等"></textarea></label>
        <button class="button primary" type="submit">提交模拟订单</button>
      </form>

      <aside class="summary-card">
        <h2>订单摘要</h2>
        <div class="summary-media">
          <strong>${media.name}</strong>
          <span>${media.country} · ${media.category}</span>
        </div>
        <div class="info-list">
          <div><span>卖家</span><strong>${seller.name}</strong></div>
          <div><span>卖家身份</span><strong>${seller.role === "Owner" ? "网站所有者" : "Reseller/代理商"}</strong></div>
          <div><span>发布价格</span><strong>$${seller.price}</strong></div>
          <div><span>链接属性</span><strong>${seller.linkType === "Nofollow" ? "No follow" : "Do follow"}</strong></div>
          <div><span>Sponsored</span><strong>${seller.sponsored ? "Yes" : "No"}</strong></div>
          <div><span>收录承诺</span><strong>${seller.indexed ? "包收录" : "不包收录"}</strong></div>
          <div><span>预计交付</span><strong>${seller.delivery}</strong></div>
        </div>
        <p class="notice">MVP 阶段仅生成模拟订单，真实版本会进入支付托管和平台审核流程。</p>
      </aside>
    </section>
  `;
}

function loginPage() {
  return `
    <section class="login-shell">
      <div class="login-intro">
        <p class="eyebrow">账号入口</p>
        <h1>登录后直接进入你的工作台</h1>
        <p class="muted">已注册账号不需要再次选择角色。系统会根据账号本身的身份，自动进入 Buyer 或 Seller 工作台。</p>
        <div class="todo-list">
          <div><span class="status success">Buyer</span><strong>登录后查看订单、收藏、购物车和资金信息</strong></div>
          <div><span class="status info">Seller</span><strong>Seller 账号登录后直接进入卖家工作台，并默认拥有 Buyer 能力</strong></div>
          <div><span class="status warning">注册</span><strong>如果还没有账号，请在注册页选择 Buyer 或 Seller 身份</strong></div>
        </div>
      </div>
      <div class="login-panel">
        <form class="form-card login-card" data-login-form>
          <p class="eyebrow">账号演示</p>
          <h2>输入账号密码</h2>
          <label><span>邮箱</span><input type="email" placeholder="name@example.com" /></label>
          <label><span>密码</span><input type="password" placeholder="请输入密码" /></label>
          <button class="button primary" type="submit">登录进入系统</button>
        </form>
        <aside class="content-block demo-account-card">
          <p class="eyebrow">快速填充</p>
          <h2>演示账号</h2>
          <div class="demo-account-list">
            <button class="mini-button" type="button" data-demo-login data-email="buyer@example.com" data-password="buyer123">买家账号</button>
            <button class="mini-button" type="button" data-demo-login data-email="seller@example.com" data-password="seller123">卖家账号</button>
          </div>
          <p class="muted">Seller 登录后默认进入 Seller 后台，并可切换到 Buyer 视角；Buyer 不能直接进入 Seller 后台。</p>
        </aside>
      </div>
    </section>
  `;
}

function publicMarketplaceLockedNotice() {
  return `
    <section class="gate-banner">
      <div>
        <strong>当前市场页仅提供浏览能力</strong>
        <p>你可以先了解平台资源与市场结构；登录或注册后进入工作台，再继续查看详情和后续操作。</p>
      </div>
      <a class="button primary" href="#/login">登录后继续</a>
    </section>
  `;
}

function marketplaceBrandCard(media) {
  const previewSeed = media.name.replace(/\s+/g, "+");
  return `
    <article class="marketplace-brand-card">
      <div class="marketplace-shot">
        <img src="https://placehold.co/640x420/f3efe8/1d2939?text=${previewSeed}" alt="${media.name} preview" />
      </div>
      <div class="marketplace-brand-body">
        <div class="media-card-head">
          <div>
            <p class="eyebrow">${media.country} · ${media.language} · ${media.category}</p>
            <h3>${media.name}</h3>
            <p class="muted">${media.domain}</p>
          </div>
          <span class="price-badge">$${minSellerPrice(media)} 起</span>
        </div>
        <p>${media.description}</p>
        <div class="tag-row">
          <span>DR ${media.dr}</span>
          <span>DA ${media.da}</span>
          <span>${media.trafficLabel} Traffic</span>
          <span>${media.indexed ? "包收录" : "不包收录"}</span>
        </div>
        <div class="card-action">
          <strong>${sellerMix(media)}</strong>
          <a class="button ghost" href="#/login">登录后查看</a>
        </div>
      </div>
    </article>
  `;
}

function registerPage() {
  return `
    <section class="login-shell">
      <div class="login-intro">
        <p class="eyebrow">Create Account</p>
        <h1>注册易宣发账号，先选择你是谁</h1>
        <p class="muted">参考 Linkhouse 的注册方式，注册时先确认身份。Buyer 可直接开始使用，Seller 适合媒体资源方、站长和合作代理。</p>
        <div class="todo-list">
          <div><span class="status success">Buyer</span><strong>适合品牌方、营销团队、代理商，直接进入采购与管理流程</strong></div>
          <div><span class="status info">Seller</span><strong>适合媒体资源方、网站所有者或长期合作代理，注册后进入 Seller 工作台</strong></div>
          <div><span class="status warning">自动分流</span><strong>注册成功后，系统会按你选择的身份进入对应后台</strong></div>
        </div>
      </div>
      <div class="login-panel">
        <form class="form-card login-card" data-register-form>
          <p class="eyebrow">注册</p>
          <h2>Who are you?</h2>
          <input type="hidden" name="role" value="buyer" />
          <div class="role-pick-grid">
            <button type="button" class="role-pick-card is-active" data-role-choice="buyer">
              <span class="status success">Buyer</span>
              <strong>Advertiser / Buyer</strong>
              <p>用于浏览媒体、收藏资源、加入购物车、创建订单与管理投放。</p>
            </button>
            <button type="button" class="role-pick-card" data-role-choice="seller">
              <span class="status info">Seller</span>
              <strong>Publisher / Seller</strong>
              <p>用于管理媒体资源、处理订单与维护个人 Seller profile。</p>
            </button>
          </div>
          <label><span>姓名</span><input name="name" placeholder="你的名字或公司名" /></label>
          <label><span>邮箱</span><input name="email" type="email" placeholder="name@example.com" /></label>
          <label><span>密码</span><input name="password" type="password" placeholder="至少 6 位" /></label>
          <label class="agree-line"><input type="checkbox" name="agree" /> <span>我已阅读并同意 Terms 与 Privacy Policy</span></label>
          <button class="button primary" type="submit">注册并进入工作台</button>
        </form>
        <aside class="content-block demo-account-card">
          <p class="eyebrow">已有账号？</p>
          <h2>直接登录</h2>
          <a class="button ghost full" href="#/login">去登录</a>
        </aside>
      </div>
    </section>
  `;
}

function contactPage() {
  return `
    <section class="page-title">
      <p class="eyebrow">Contact Us</p>
      <h1>如果你想了解资源、合作或投放方案，可以直接把问题提交给我们</h1>
      <p class="muted">这一页先保留轻量线索表单。后续你确认后，我可以继续把它做成更完整的品牌联系页。</p>
    </section>

    <section class="login-shell">
      <div class="login-intro">
        <p class="eyebrow">联系方式</p>
        <h2>适合提交的问题</h2>
        <div class="todo-list">
          <div><span class="status success">资源咨询</span><strong>想了解某类国家、行业或语言的媒体资源</strong></div>
          <div><span class="status info">品牌投放</span><strong>想让我们帮助规划曝光、PR 或 SEO 发布方案</strong></div>
          <div><span class="status warning">Seller 合作</span><strong>想接入媒体资源、提交站点或成为长期合作方</strong></div>
        </div>
      </div>
      <div class="login-panel">
        <form class="form-card login-card" data-contact-form>
          <p class="eyebrow">留言表单</p>
          <h2>提交你的问题</h2>
          <label><span>姓名</span><input name="name" placeholder="你的姓名" /></label>
          <label><span>邮箱</span><input name="email" type="email" placeholder="name@example.com" /></label>
          <label><span>公司 / 品牌</span><input name="company" placeholder="公司名称（可选）" /></label>
          <label><span>问题类型</span><select name="topic"><option>媒体资源咨询</option><option>品牌曝光合作</option><option>成为 Seller</option><option>其他问题</option></select></label>
          <label><span>详细问题</span><textarea name="message" rows="6" placeholder="请描述你的需求、目标市场、预算区间或想咨询的问题"></textarea></label>
          <button class="button primary" type="submit">提交问题</button>
        </form>
      </div>
    </section>
  `;
}

function dashboardSidebar(active) {
  const isSellerView = active.startsWith("seller");
  const sellerStatus = getUser()?.sellerStatus || "none";
  return `
    <aside class="sidebar">
      <a class="sidebar-brand" href="${isSellerView ? "#/seller/dashboard" : "#/buyer/dashboard"}">
        <span class="brand-mark">Y</span>
        <span>
          <strong>易宣发</strong>
          <small>${isSellerView ? "Seller Workspace" : "Buyer Workspace"}</small>
        </span>
      </a>
      ${
        isSellerView
          ? `
            <a class="${active === "seller-dashboard" ? "active" : ""}" href="#/seller/dashboard">My dashboard</a>
            <a class="${active === "seller-orders" ? "active" : ""}" href="#/seller/orders">订单</a>
            <a class="${active === "seller-profile" ? "active" : ""}" href="#/seller/profile">profile</a>
            <button class="mini-button" data-switch-view="buyer">切换到 Buyer</button>
          `
          : `
            <a class="${active === "buyer-dashboard" ? "active" : ""}" href="#/buyer/dashboard">dashboard</a>
            <a class="${active.startsWith("buyer-favorites") ? "active" : ""}" href="#/buyer/favorites/orders">收藏</a>
            <a class="${active === "buyer-cart" ? "active" : ""}" href="#/buyer/cart">购物车</a>
            <a class="${active === "buyer-orders" ? "active" : ""}" href="#/buyer/orders">订单列表</a>
            ${typeof canAccessSellerApp === "function" && !canAccessSellerApp() ? `<a class="${active === "buyer-apply-seller" ? "active" : ""}" href="#/buyer/apply-seller">${sellerStatus === "pending" ? "Seller 申请中" : "申请 Seller"}</a>` : ""}
            ${typeof canAccessSellerApp === "function" && canAccessSellerApp() ? '<button class="mini-button" data-switch-view="seller">切换到 Seller</button>' : ""}
          `
      }
      <button class="mini-button subtle" data-logout>退出登录</button>
    </aside>
  `;
}

function buyerDashboardPage() {
  return `
    <section class="dashboard">
      ${dashboardSidebar("buyer-dashboard")}
      <div class="dashboard-main">
        <div class="page-title compact-title">
          <p class="eyebrow">Buyer Workspace</p>
          <h1>买家后台</h1>
          <p class="muted">用于发稿客户管理余额、订单、稿件和售后。</p>
        </div>
        <div class="stats">
          ${metric("总订单", orders.length)}
          ${metric("进行中", 2)}
          ${metric("已完成", 1)}
          ${metric("模拟余额", "$2,480")}
        </div>
        <section class="wallet-panel">
          <div>
            <p class="eyebrow">账户余额</p>
            <h2>$2,480</h2>
            <p class="muted">支持 USDT 与人民币充值方式，当前为前端原型演示。</p>
          </div>
          <button class="button primary" data-open-recharge>充值</button>
        </section>
        <section class="content-block">
          <div class="section-head">
            <div>
              <h2>最近订单</h2>
              <p class="muted">买家可以跟踪付款、卖家接单、发布、验收和售后状态。</p>
            </div>
            <a class="button ghost" href="#/media">创建新订单</a>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>订单编号</th><th>媒体</th><th>项目</th><th>金额</th><th>状态</th><th>预计交付</th><th>操作</th></tr></thead>
              <tbody>
                ${orders
                  .map((order, index) => `<tr><td><strong>${order.id}</strong></td><td>${order.mediaName}</td><td>${order.project}</td><td>$${order.amount}</td><td>${orderStatus(order.status)}</td><td>${order.eta}</td><td><button class="mini-button" data-demo-action>${index === 1 ? "确认验收" : "查看详情"}</button><button class="mini-button subtle" data-demo-action>申请修改</button></td></tr>`)
                  .join("")}
              </tbody>
            </table>
          </div>
        </section>
        <section class="admin-grid">
          <article class="content-block">
            <h2>待处理事项</h2>
            <div class="todo-list">
              <div><span class="status warning">待验收</span><strong>1 个订单已发布，等待确认</strong></div>
              <div><span class="status info">稿件</span><strong>2 篇自备稿件待补充图片</strong></div>
              <div><span class="status neutral">余额</span><strong>余额充足，可继续下单</strong></div>
            </div>
          </article>
          <article class="content-block">
            <h2>常用入口</h2>
            <div class="workspace-actions single">
              <a class="action-tile" href="#/media"><span>发稿</span><strong>选择媒体网站</strong></a>
              <a class="action-tile" href="#/buyer"><span>财务</span><strong>充值与余额</strong></a>
            </div>
          </article>
        </section>
        <section class="workspace-actions">
          <a class="action-tile" href="#/buyer/favorites/orders"><span>收藏</span><strong>查看订单收藏与 Seller 收藏</strong></a>
          <a class="action-tile" href="#/buyer/cart"><span>购物车</span><strong>管理待下单资源</strong></a>
          ${
            typeof canAccessSellerApp === "function" && canAccessSellerApp()
              ? '<a class="action-tile" href="#/seller/dashboard"><span>切换身份</span><strong>进入 Seller 后台</strong></a>'
              : `<a class="action-tile" href="#/buyer/apply-seller"><span>${getUser()?.sellerStatus === "pending" ? "Seller 审核中" : "开始合作"}</span><strong>${getUser()?.sellerStatus === "pending" ? "查看申请状态" : "申请成为 Seller"}</strong></a>`
          }
        </section>
      </div>
    </section>
  `;
}

function buyerSellerApplicationPage() {
  const sellerStatus = getUser()?.sellerStatus || "none";
  const isPending = sellerStatus === "pending";
  return `
    <section class="dashboard">
      ${dashboardSidebar("buyer-apply-seller")}
      <div class="dashboard-main">
        <div class="page-title compact-title">
          <p class="eyebrow">Buyer / Seller Application</p>
          <h1>${isPending ? "Seller 申请审核中" : "申请成为 Seller"}</h1>
          <p class="muted">${isPending ? "你的申请已经提交，当前账号仍可正常使用 Buyer 工作台。审核通过后会自动开通 Seller 后台。": "适合网站所有者、媒体资源方和长期合作代理。提交申请后，审核通过即可获得 Seller 后台权限。"}
          </p>
        </div>
        ${
          isPending
            ? `
              <section class="content-block">
                <div class="todo-list">
                  <div><span class="status warning">审核中</span><strong>平台正在核查你的资源类型、合作身份和发布规则</strong></div>
                  <div><span class="status info">当前权限</span><strong>你仍可继续使用 Buyer 后台的收藏、购物车和订单列表</strong></div>
                  <div><span class="status success">审核通过后</span><strong>系统会为当前账号开通 Seller 工作台，并默认保留 Buyer 能力</strong></div>
                </div>
              </section>
            `
            : `
              <section class="split publisher-intro">
                <div>
                  <h2>Seller 开通后你可以做什么</h2>
                  <div class="benefit-grid">
                    <div><strong>提交媒体资源</strong><p>管理网站、媒体截图、报价和接稿规则。</p></div>
                    <div><strong>处理订单</strong><p>查看买家订单、接单、提交发布链接与交付说明。</p></div>
                    <div><strong>保留 Buyer 能力</strong><p>Seller 开通后仍可继续用当前账号采购媒体资源。</p></div>
                  </div>
                </div>
                <form class="form-card" data-seller-application-form>
                  <h2>提交 Seller 申请</h2>
                  <div class="form-grid">
                    <label><span>联系人 / 团队名</span><input value="${getUser()?.name || ""}" placeholder="你的姓名或团队名称" /></label>
                    <label><span>联系邮箱</span><input value="${getUser()?.email || ""}" placeholder="name@example.com" /></label>
                    <label><span>身份类型</span><input placeholder="网站所有者 / 媒体代理 / PR 服务商" /></label>
                    <label><span>主营市场</span><input placeholder="例如：美国、英国、东南亚" /></label>
                  </div>
                  <label><span>资源与合作说明</span><textarea rows="6" placeholder="请说明你拥有的网站资源、行业方向、内容规则、是否支持 sponsored、链接属性、交付周期等"></textarea></label>
                  <button class="button primary" type="submit">提交 Seller 申请</button>
                </form>
              </section>
            `
        }
      </div>
    </section>
  `;
}

function buyerFavoritesPage(tab = "orders") {
  const isOrderFavorites = tab !== "sellers";
  return `
    <section class="dashboard">
      ${dashboardSidebar(`buyer-favorites-${tab}`)}
      <div class="dashboard-main">
        <div class="page-title compact-title">
          <p class="eyebrow">Buyer / 收藏</p>
          <h1>收藏</h1>
          <p class="muted">这里区分订单收藏与卖家收藏，方便你从不同维度管理关注对象。</p>
        </div>
        <div class="tab-row">
          <a class="mini-button ${isOrderFavorites ? "" : "subtle"}" href="#/buyer/favorites/orders">订单收藏</a>
          <a class="mini-button ${!isOrderFavorites ? "" : "subtle"}" href="#/buyer/favorites/sellers">卖家收藏</a>
        </div>
        <section class="content-block">
          <div class="section-head">
            <div>
              <h2>${isOrderFavorites ? "订单收藏" : "卖家收藏"}</h2>
              <p class="muted">${isOrderFavorites ? "收集你想继续跟进的订单或媒体资源。" : "保留值得长期合作的卖家和资源方。"}</p>
            </div>
          </div>
          <div class="todo-list">
            ${
              isOrderFavorites
                ? `
                  <div><span class="status success">NorthTech Daily</span><strong>AI SaaS 海外曝光项目，适合后续继续跟进</strong></div>
                  <div><span class="status info">Global Business Brief</span><strong>跨境 B2B 品牌稿，适合企业传播类内容</strong></div>
                `
                : `
                  <div><span class="status success">网站所有者</span><strong>NorthTech Daily 直连资源，交付稳定</strong></div>
                  <div><span class="status info">Web3 PR 服务商</span><strong>适合区块链类品牌长期合作</strong></div>
                `
            }
          </div>
        </section>
      </div>
    </section>
  `;
}

function buyerCartPage() {
  return `
    <section class="dashboard">
      ${dashboardSidebar("buyer-cart")}
      <div class="dashboard-main">
        <div class="page-title compact-title">
          <p class="eyebrow">Buyer / 购物车</p>
          <h1>购物车</h1>
          <p class="muted">用于集中管理准备继续下单的媒体资源与卖家报价。</p>
        </div>
        <section class="content-block">
          <div class="table-wrap">
            <table>
              <thead><tr><th>媒体</th><th>卖家</th><th>价格</th><th>交付周期</th><th>动作</th></tr></thead>
              <tbody>
                <tr><td><strong>NorthTech Daily</strong></td><td>网站所有者</td><td>$680</td><td>5-7天</td><td><a class="table-link" href="#/order/tech-daily-us/owner">继续下单</a></td></tr>
                <tr><td><strong>Chain Pulse Weekly</strong></td><td>Web3 PR 服务商</td><td>$880</td><td>3-6天</td><td><a class="table-link" href="#/order/chain-pulse/web3-reseller">继续下单</a></td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  `;
}

function buyerOrderListPage() {
  return `
    <section class="dashboard">
      ${dashboardSidebar("buyer-orders")}
      <div class="dashboard-main">
        <div class="page-title compact-title">
          <p class="eyebrow">Buyer / 订单列表</p>
          <h1>订单列表</h1>
          <p class="muted">集中查看全部下单记录、状态和后续验收动作。</p>
        </div>
        <section class="content-block">
          <div class="table-wrap">
            <table>
              <thead><tr><th>订单编号</th><th>媒体</th><th>项目</th><th>金额</th><th>状态</th><th>操作</th></tr></thead>
              <tbody>
                ${orders
                  .map((order) => `<tr><td><strong>${order.id}</strong></td><td>${order.mediaName}</td><td>${order.project}</td><td>$${order.amount}</td><td>${orderStatus(order.status)}</td><td><button class="mini-button" data-demo-action>查看</button></td></tr>`)
                  .join("")}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  `;
}

function publisherPage() {
  return `
    <section class="page-title">
      <p class="eyebrow">网站合作入驻</p>
      <h1>申请成为 Seller，接入易宣发的媒体供给网络</h1>
      <p class="muted">这里是未登录也可访问的公开合作页。Buyer 可先注册账号，再提交 Seller 申请；审核通过后进入 Seller 工作台。</p>
    </section>

    <section class="split publisher-intro">
      <div>
        <h2>入驻后你可以获得</h2>
        <div class="benefit-grid">
          <div><strong>稳定订单来源</strong><p>面向中国出海客户展示媒体资源。</p></div>
          <div><strong>多卖家报价展示</strong><p>同一网站可展示 Owner 与 Reseller 的不同报价与交付规则。</p></div>
          <div><strong>审核制 Seller</strong><p>Seller 需要审核通过后开通，开通后默认同时拥有 Buyer 权限。</p></div>
        </div>
      </div>
      <form class="form-card" data-publisher-form>
        <h2>提交 Seller 申请 / 媒体资源</h2>
        <div class="form-grid">
          <label><span>网站名称</span><input required placeholder="例如：Global Tech Review" /></label>
          <label><span>网站域名</span><input required placeholder="https://example.com" /></label>
          <label><span>国家 / 地区</span><input placeholder="例如：美国" /></label>
          <label><span>主要语言</span><input placeholder="例如：英文" /></label>
          <label><span>行业分类</span><input placeholder="例如：科技媒体、金融媒体" /></label>
          <label><span>最低发布价格</span><input placeholder="例如：500 USD 起" /></label>
        </div>
        <label><span>卖家身份和内容规则</span><textarea rows="5" placeholder="请说明你是网站所有者还是 Reseller/代理商，以及可接行业、Sponsored、链接属性、是否包谷歌收录、报价等"></textarea></label>
        <button class="button primary" type="submit">提交审核</button>
      </form>
    </section>
  `;
}

function sellerDashboardPage() {
  return `
    <section class="dashboard">
      ${dashboardSidebar("seller-dashboard")}
      <div class="dashboard-main">
        <div class="page-title compact-title">
          <p class="eyebrow">Seller Workspace</p>
          <h1>卖家后台</h1>
          <p class="muted">卖家可以是网站所有者，也可以是 Reseller/代理商。Seller 默认同时拥有 Buyer 能力，可随时切换查看 Buyer 工作台。</p>
        </div>
        <div class="stats">
          ${metric("我的媒体", mediaList.length)}
          ${metric("卖家报价", mediaList.reduce((sum, item) => sum + item.sellers.length, 0))}
          ${metric("待接单", 3)}
          ${metric("待结算", "$1,240")}
        </div>
        <section class="content-block">
          <div class="section-head">
            <div>
              <h2>我的媒体与报价</h2>
              <p class="muted">卖家可提交网站，也可提交自己拥有合作关系的网站报价。网站管理员审核后展示到前台。</p>
            </div>
            <button class="button ghost" data-open-seller-form>新增媒体/报价</button>
          </div>
          ${mediaTable(mediaList.slice(0, 5))}
        </section>
        <section class="content-block">
          <div class="section-head"><div><h2>收到的订单</h2><p class="muted">卖家处理接单、提交发布链接、修改稿件和结算。</p></div></div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>订单</th><th>媒体</th><th>买家项目</th><th>卖家身份</th><th>状态</th><th>收入</th><th>操作</th></tr></thead>
              <tbody>
                ${orders
                  .map((order, index) => `<tr><td><strong>${order.id}</strong></td><td>${order.mediaName}</td><td>${order.project}</td><td>${index === 1 ? "Reseller/代理商" : "网站所有者"}</td><td>${orderStatus(index === 0 ? "待接单" : order.status)}</td><td>$${Math.round(order.amount * 0.78)}</td><td><button class="mini-button" data-demo-action>接单</button><button class="mini-button subtle" data-demo-action>拒单</button><button class="mini-button subtle" data-open-publish-form>提交链接</button></td></tr>`)
                  .join("")}
              </tbody>
            </table>
          </div>
        </section>
        <section class="admin-grid">
          <article class="content-block">
            <h2>报价规则</h2>
            <div class="todo-list">
              <div><span class="status success">Owner</span><strong>网站所有者直接接单会在购买页高亮推荐</strong></div>
              <div><span class="status info">Reseller</span><strong>代理商报价需说明合作关系和交付规则</strong></div>
              <div><span class="status warning">Sponsored</span><strong>如带 Sponsored 标签需在报价中明确</strong></div>
            </div>
          </article>
          <article class="content-block">
            <h2>结算概览</h2>
            <div class="info-list">
              <div><span>可结算</span><strong>$1,240</strong></div>
              <div><span>结算中</span><strong>$680</strong></div>
              <div><span>平台服务费</span><strong>20%</strong></div>
            </div>
          </article>
        </section>
        <section class="workspace-actions">
          <a class="action-tile" href="#/buyer/dashboard"><span>Buyer 视角</span><strong>切换查看我的订单与余额</strong></a>
          <a class="action-tile" href="#/seller/orders"><span>订单</span><strong>集中管理 Seller 侧订单</strong></a>
          <a class="action-tile" href="#/seller/profile"><span>profile</span><strong>查看 Seller 资料与合作信息</strong></a>
        </section>
      </div>
    </section>
    ${sellerActionModals()}
  `;
}

function sellerOrdersPage() {
  return `
    <section class="dashboard">
      ${dashboardSidebar("seller-orders")}
      <div class="dashboard-main">
        <div class="page-title compact-title">
          <p class="eyebrow">seller / 订单</p>
          <h1>订单</h1>
          <p class="muted">Seller 视角下集中处理接单、拒单、交付和验收前操作。</p>
        </div>
        <section class="content-block">
          <div class="table-wrap">
            <table>
              <thead><tr><th>订单编号</th><th>媒体</th><th>项目</th><th>状态</th><th>收入</th><th>操作</th></tr></thead>
              <tbody>
                ${orders
                  .map((order) => `<tr><td><strong>${order.id}</strong></td><td>${order.mediaName}</td><td>${order.project}</td><td>${orderStatus(order.status)}</td><td>$${Math.round(order.amount * 0.78)}</td><td><button class="mini-button subtle" data-open-publish-form>提交链接</button></td></tr>`)
                  .join("")}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  `;
}

function sellerProfilePage() {
  return `
    <section class="dashboard">
      ${dashboardSidebar("seller-profile")}
      <div class="dashboard-main">
        <div class="page-title compact-title">
          <p class="eyebrow">seller / profile</p>
          <h1>profile</h1>
          <p class="muted">这里展示 Seller 的基本资料、合作定位与后续可补充的资质信息。</p>
        </div>
        <section class="content-block">
          <div class="info-list">
            <div><span>账号名称</span><strong>${getUser()?.name || "演示卖家"}</strong></div>
            <div><span>角色</span><strong>Seller（同时拥有 Buyer 权限）</strong></div>
            <div><span>合作类型</span><strong>网站所有者 / Reseller</strong></div>
            <div><span>当前状态</span><strong>已开通</strong></div>
          </div>
        </section>
      </div>
    </section>
  `;
}

function permissionDeniedPage(message, href = "#/") {
  return `
    <section class="login-shell">
      <div class="login-intro">
        <p class="eyebrow">访问限制</p>
        <h1>当前页面不对你的身份开放</h1>
        <p class="muted">${message}</p>
      </div>
      <div class="content-block demo-account-card">
        <p class="eyebrow">下一步</p>
        <h2>返回可访问的工作台</h2>
        <a class="button primary full" href="${href}">返回可访问页面</a>
      </div>
    </section>
  `;
}

function siteAdminDashboardPage() {
  return `
    <section class="dashboard admin-dashboard">
      ${dashboardSidebar("admin")}
      <div class="dashboard-main">
        <div class="page-title compact-title">
          <p class="eyebrow">Admin Workspace</p>
          <h1>网站管理员后台</h1>
          <p class="muted">平台方管理用户、媒体、卖家报价、订单履约、充值入账和风险审核。</p>
        </div>
        <div class="stats">
          ${metric("待审核媒体", 4)}
          ${metric("待审核报价", 6)}
          ${metric("进行中订单", 8)}
          ${metric("异常提醒", 3)}
        </div>
        <section class="admin-grid">
          <article class="content-block">
            <h2>运营待办</h2>
            <div class="todo-list">
              <div><span class="status warning">待审核</span><strong>4 个媒体资源等待审核</strong></div>
              <div><span class="status info">卖家</span><strong>6 个 Owner/Reseller 报价需要复核</strong></div>
              <div><span class="status warning">风险</span><strong>1 个金融类订单需要人工复核</strong></div>
              <div><span class="status success">结算</span><strong>本周可结算媒体主 $3,420</strong></div>
            </div>
          </article>
          <article class="content-block">
            <h2>平台交易趋势</h2>
            <div class="admin-chart" aria-hidden="true">
              <i style="height: 34%"></i><i style="height: 58%"></i><i style="height: 46%"></i>
              <i style="height: 72%"></i><i style="height: 64%"></i><i style="height: 86%"></i>
            </div>
          </article>
        </section>
        <section class="content-block">
          <div class="section-head"><div><h2>媒体与卖家审核</h2><p class="muted">管理员可查看每个媒体下不同 Owner/Reseller 的报价。</p></div></div>
          ${mediaTable(mediaList)}
          <div class="admin-action-row">
            <button class="button primary" data-demo-action>审核通过选中媒体</button>
            <button class="button ghost" data-demo-action>驳回并要求修改</button>
            <button class="button ghost" data-open-admin-status>修改订单状态</button>
          </div>
        </section>
        <section class="content-block">
          <div class="section-head"><div><h2>资金与充值审核</h2><p class="muted">MVP 展示充值方式与人工入账流程，真实版本需对接支付或链上监听。</p></div></div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>充值单</th><th>用户</th><th>方式</th><th>金额</th><th>状态</th><th>操作</th></tr></thead>
              <tbody>
                <tr><td><strong>DEP-001</strong></td><td>上海某 SaaS</td><td>USDT TRC20</td><td>$1,000</td><td>${orderStatus("待确认")}</td><td><button class="mini-button" data-demo-action>确认入账</button><button class="mini-button subtle" data-demo-action>驳回</button></td></tr>
                <tr><td><strong>DEP-002</strong></td><td>深圳跨境品牌</td><td>支付宝</td><td>¥5,000</td><td>${orderStatus("已完成")}</td><td><button class="mini-button subtle" data-demo-action>查看</button></td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
    ${adminActionModal()}
  `;
}

function sellerActionModals() {
  return `
    <div class="modal-backdrop" data-seller-form-modal hidden>
      <div class="modal">
        <div class="section-head">
          <div><p class="eyebrow">卖家操作</p><h2>新增媒体或报价</h2></div>
          <button class="mini-button subtle" data-close-modal>关闭</button>
        </div>
        <div class="form-grid">
          <label><span>网站域名</span><input placeholder="填写已有媒体域名，例如 northtechdaily.com" /></label>
          <label><span>卖家身份</span><select><option>网站所有者</option><option>Reseller/代理商</option></select></label>
          <label><span>报价</span><input placeholder="590 USD" /></label>
          <label><span>交付周期</span><input placeholder="5-7天" /></label>
          <label><span>链接属性</span><select><option>Do follow</option><option>No follow</option></select></label>
          <label><span>Sponsored 标签</span><select><option>否</option><option>是</option></select></label>
        </div>
        <label><span>合作说明</span><textarea rows="4" placeholder="说明你与该网站的合作关系、交付规则和限制行业"></textarea></label>
        <button class="button primary" data-submit-seller-quote>提交审核</button>
      </div>
    </div>
    <div class="modal-backdrop" data-publish-form-modal hidden>
      <div class="modal">
        <div class="section-head">
          <div><p class="eyebrow">订单交付</p><h2>提交发布链接</h2></div>
          <button class="mini-button subtle" data-close-modal>关闭</button>
        </div>
        <label><span>订单编号</span><input placeholder="ORD-20260420-001" data-publish-order-id /></label>
        <label><span>发布链接</span><input placeholder="https://media.com/article-url" data-publish-url /></label>
        <label><span>交付备注</span><textarea rows="4" placeholder="说明发布时间、是否已收录、是否可修改等"></textarea></label>
        <button class="button primary" data-submit-publish-url>提交给买家验收</button>
      </div>
    </div>
  `;
}

function adminActionModal() {
  return `
    <div class="modal-backdrop" data-admin-status-modal hidden>
      <div class="modal">
        <div class="section-head">
          <div><p class="eyebrow">管理员操作</p><h2>修改订单状态</h2></div>
          <button class="mini-button subtle" data-close-modal>关闭</button>
        </div>
        <div class="form-grid">
          <label><span>订单编号</span><input placeholder="ORD-20260420-001" data-admin-order-id /></label>
          <label><span>订单状态</span><select data-admin-order-status><option value="pending_payment">待付款</option><option value="paid">已付款</option><option value="accepted">卖家已接单</option><option value="publishing">发布中</option><option value="published">已发布待验收</option><option value="completed">已完成</option><option value="refund_requested">售后中</option></select></label>
        </div>
        <label><span>管理员备注</span><textarea rows="4" placeholder="记录修改原因，方便后续审计"></textarea></label>
        <button class="button primary" data-admin-save-status>保存状态</button>
      </div>
    </div>
  `;
}
