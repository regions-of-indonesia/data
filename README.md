[![cover]][site]

<p align="center">
  <a href="http://www.npmjs.com/package/@regions-of-indonesia/data"><img src="https://img.shields.io/npm/v/@regions-of-indonesia/data" /></a>
  <a href="https://bundlephobia.com/package/@regions-of-indonesia/data"><img src="https://img.shields.io/bundlephobia/minzip/@regions-of-indonesia/data" /></a>
  <a href="https://indonesia-api.netlify.app/regions-of-indonesia"><img src="https://raw.githubusercontent.com/indonesia-api/indonesia-api/main/public/Badge.svg?sanitize=true" /></a>
</p>

<img src="https://hiiits.deno.dev/hit/regions-of-indonesia/data?" width="100%" heigth="10px" />

# Regions of Indonesia

Regions of Indonesia

## Package

Install

```bash
npm install @regions-of-indonesia/data
# or
yarn add @regions-of-indonesia/data
# or
pnpm add @regions-of-indonesia/data
```

Usage

```typescript
import { PROVINCE, DISTRICT, SUBDISTRICT, VILLAGE } from "@regions-of-indonesia/data";

/**
 * PROVINCE is {[key: string]: string}
 * DISTRICT is {[key: string]: string}
 * SUBDISTRICT is {[key: string]: string}
 * VILLAGE is {[key: string]: string}
 *
 * type {[key: string]: string} means, key is region code and value is region name
 */
```

## Support

[![][support:ko-fi-button]][support:ko-fi]

[![][support:trakteer-button]][support:trakteer]

## LICENSE

GPL-3.0

[cover]: https://raw.githubusercontent.com/regions-of-indonesia/regions-of-indonesia/main/public/Cover.png?sanitize=true
[site]: https://regions-of-indonesia.netlify.app
[docs]: https://regions-of-indonesia-docs.netlify.app
[github:api]: https://github.com/regions-of-indonesia/api
[github:static-api]: https://github.com/regions-of-indonesia/static-api
[github:site]: https://github.com/regions-of-indonesia/site
[github:docs]: https://github.com/regions-of-indonesia/docs
[github:client]: https://github.com/regions-of-indonesia/client
[github:data]: https://github.com/regions-of-indonesia/data
[github:php-client]: https://github.com/regions-of-indonesia/php-client
[github:dart-client]: https://github.com/regions-of-indonesia/dart-client
[github:python-client]: https://github.com/regions-of-indonesia/python-client
[github:swr]: https://github.com/regions-of-indonesia/swr
[github:react-query]: https://github.com/regions-of-indonesia/react-query
[github:solid-query]: https://github.com/regions-of-indonesia/solid-query
[github:example-react-ts]: https://github.com/regions-of-indonesia/example-react-ts
[github:example-react-ts-swr]: https://github.com/regions-of-indonesia/example-react-ts-swr
[github:example-react-ts-query]: https://github.com/regions-of-indonesia/example-react-ts-query
[github:example-solid-ts]: https://github.com/regions-of-indonesia/example-solid-ts
[github:example-solid-ts-query]: https://github.com/regions-of-indonesia/example-solid-ts-query
[support:ko-fi]: https://ko-fi.com/flamrdevs
[support:ko-fi-button]: https://flamrdevs.vercel.app/ko-fi.png
[support:trakteer]: https://trakteer.id/flamrdevs
[support:trakteer-button]: https://flamrdevs.vercel.app/trakteer.png
