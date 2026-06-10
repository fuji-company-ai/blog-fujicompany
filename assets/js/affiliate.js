/**
 * フジカンパニーブログ - アフィリエイトリンクヘルパー
 * Amazon Associates tag を自動付与する
 */

(function() {
  'use strict';

  var ASSOCIATE_TAG = window.AMAZON_ASSOCIATE_TAG || 'fujicompany-22';
  var AMAZON_DOMAINS = [
    'amazon.co.jp',
    'amzn.to',
    'amzn.asia'
  ];

  function isAmazonUrl(url) {
    return AMAZON_DOMAINS.some(function(domain) {
      return url.indexOf(domain) !== -1;
    });
  }

  function addAffiliateTag(url) {
    if (!isAmazonUrl(url)) return url;
    try {
      var u = new URL(url);
      u.searchParams.set('tag', ASSOCIATE_TAG);
      return u.toString();
    } catch (e) {
      // If URL parsing fails, append manually
      var separator = url.indexOf('?') !== -1 ? '&' : '?';
      return url + separator + 'tag=' + ASSOCIATE_TAG;
    }
  }

  function processLinks() {
    var links = document.querySelectorAll('a[href]');
    links.forEach(function(link) {
      if (isAmazonUrl(link.href)) {
        link.href = addAffiliateTag(link.href);
        link.setAttribute('rel', 'nofollow noopener sponsored');
        link.setAttribute('target', '_blank');
        if (!link.classList.contains('amazon-link')) {
          link.classList.add('amazon-link');
        }
      }
    });
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processLinks);
  } else {
    processLinks();
  }

})();
