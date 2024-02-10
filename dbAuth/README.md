# README

Experimental SSR-Streaming setup with Redwood+Apollo

> **Prerequisites**
>
> - Redwood requires [Node.js](https://nodejs.org/en/) (>=18.x) and [Yarn](https://yarnpkg.com/) (>=1.15)

Start by installing dependencies:

```
yarn install
```

Note that there are `resolutions` and patches that get applied (see root package.json)

Get prisma ready:
```
yarn rw prisma migrate reset --force
```


Good to go!:
```
yarn rw dev
```
