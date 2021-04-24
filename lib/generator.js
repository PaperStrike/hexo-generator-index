'use strict';

const pagination = require('hexo-pagination');
const { url_for } = require('hexo-util');

const anchorHrefReg = /(?<=<[^>]* href=")#[^"]+(?="[^>]*>)/g;

module.exports = function(locals) {
  const config = this.config;
  const posts = locals.posts.sort(config.index_generator.order_by);

  posts.data.sort((a, b) => (b.sticky || 0) - (a.sticky || 0));

  const prefixAnchor = (html, prefix) => html.replace(anchorHrefReg, href => url_for.call(this, prefix + href));
  posts.data.forEach(post => {
    ['content', 'excerpt', 'more'].forEach(part => {
      if (post[part]) post[part] = prefixAnchor(post[part], post.path);
    });
  });

  const paginationDir = config.pagination_dir || 'page';
  const path = config.index_generator.path || '';

  return pagination(path, posts, {
    perPage: config.index_generator.per_page,
    layout: ['index', 'archive'],
    format: paginationDir + '/%d/',
    data: {
      __index: true
    }
  });
};
