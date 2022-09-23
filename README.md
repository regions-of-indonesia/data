[![](./public/Cover.png)](https://regions-of-indonesia.netlify.app)

<p align="center">
  <a href="http://www.npmjs.com/package/@regions-of-indonesia/data"><img src="https://img.shields.io/npm/v/@regions-of-indonesia/data" /></a>
  <a href="https://bundlephobia.com/package/@regions-of-indonesia/data"><img src="https://img.shields.io/bundlephobia/minzip/@regions-of-indonesia/data" /></a>
  <a href="https://indonesia-api.netlify.app/regions-of-indonesia"><img src="https://raw.githubusercontent.com/indonesia-api/indonesia-api/main/public/Badge.svg?sanitize=true" /></a>
</p>

# Regions of Indonesia

Regions of Indonesia

## Features

- Support both [Dynamic API](https://github.com/regions-of-indonesia/api) & [Static API](https://github.com/regions-of-indonesia/static-api)
- Search API for Dynamic API
- [Javascript client SDK](https://github.com/regions-of-indonesia/client)
- Documented with in-app [DEMO](https://regions-of-indonesia.netlify.app)

## Roadmap

- [x] Plain data
- [x] Dynamic API & Static API
- [x] Javascript Client SDK
- [ ] Documentation
- [ ] PHP Client SDK
- [ ] Dart Client SDK
- [ ] Python Client SDK

## Raw data

Install

```bash
npm install @regions-of-indonesia/data
```

Usage

```typescript
import { Provinces, Districts, Subdistricts, Villages } from "@regions-of-indonesia/data";

// Each data is object with type {[key: string]: string}, which is object key as code, and object value as name
```

## Support

- Donate [Ko-Fi](https://ko-fi.com/flamrdevs) or [Trakteer](https://trakteer.id/flamrdevs)

## LICENSE

GPL-3.0
