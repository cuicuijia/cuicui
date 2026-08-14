# 崔崔个人作品集

崔崔的原创品牌视觉、香水与四季系列、茶道系列、猫咪 IP、海报及动态影像作品集。

## 本地运行

```bash
npm ci
npm run dev
```

生产构建：

```bash
npm run build
```

## 项目结构

- `public/portfolio.html`：作品集主页
- `public/styles.css`：视觉样式与鼠标交互
- `public/script.js`：筛选、分页、轮播及作品预览
- `public/portfolio-data.js`：作品分类和媒体清单
- `public/图片`：网页压缩图片
- `public/视频`：网页压缩视频
- `app/`、`worker/`：Sites 托管入口

仓库只包含网页发布所需的压缩素材，不包含原始高清源文件。
