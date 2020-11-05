# react-ssg
Generate your static site (blogs, docs, books, ...) with react

## Why not .... which we use and love?

### Jekyll
* You should work with html instead of react with modular, declarative style and great ecosystem
  * With Jekyll, you can't even use nested layout (AFAIK).
* No SPA
  * No offline support and service worker.
  * No caching of links user probably click.

What you lose:
* All of your website will be loaded on first click (I promise that will be less than 500KB gzipped)

### Gatsby
* Every bit of your app is related to gatsby.
  * You can remove or add react-ssg in 5 minutes but it takes days to get rid of gatsby (I tried!)
  * You can use react-ssg in your existing app.
  * react-ssg is "vanilla react".
* Graphql is overkill and ugly
  * React-ssg have the same functionality with a single hook.
  * You have the full access and are not limited to graph ql api provided by gatsby js


What you lose:
* Responsive images (Ideas welcome)
* Integeration with wordpress and other CMS (Pull request welcome)


## Usage
Maybe the best way of starting from scratch is downloading [react-ssg-example](https://github.com/react-ssg/react-ssg-example.git).

For add react-ssg to an existing project:
1. Install `react-ssg` and peer dependencies.
