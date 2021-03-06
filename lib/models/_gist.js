/** jshint node:true **/

var as    = require('activitystrea.ms');
var ld    = require('linkeddata-vocabs');
var vocab = require('../ghvocab');
var cached = require('../models').cached;

function convert(info) {
  if (!info) {
    return null;
  }
  var builder = as.object(vocab.Gist).
    id(info.url).
    url(info.html_url).
    set(vocab.id, info.id).
    displayName(vocab.description).
    set(vocab.public, info.public, {type:ld.xsd.boolean});

  if (info.owner) {
    builder.attributedTo(
      this.cached_user(info.owner)
    );
  }

  // user ?

  if (info.files) {
    var keys = Object.keys(info.files);
    for (var n = 0, l = keys.length; n < l; n++) {
      var file = info.files[keys[n]];
      builder.attachment(
        as.link().
          displayName(keys[n]).
          href(file.raw_url).
          mediaType(file.type).
          set(vocab.size, file.size).
          set(vocab.language, file.language)
      );
    }
  }

  builder.replies(
    as.collection().
      totalItems(info.comments).
      id(info.comments_url)
  );

  if (info.forks_url) {
    builder.url(
      as.link().
         href(info.forks_url).
         ref('forks')
    );
  }

  if (info.commits_url) {
    builder.url(
      as.link().
         href(info.commits_url).
         ref('commits')
    );
  }

  if (info.git_pull_url) {
    builder.url(
      as.link().
         href(info.git_pull_url).
         ref('git_pull')
    );
  }

  if (info.git_push_url) {
    builder.url(
      as.link().
         href(info.git_push_url).
         ref('git_push')
    );
  }

  this.timestamps(builder, info);

  return builder.get();
}

module.exports = convert;
