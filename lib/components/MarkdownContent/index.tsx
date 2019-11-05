import React from 'react';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: false,
  linkify: false,
}).enable(['text'], true);

export const MarkdownContent = () => {
  console.log(md.render('# 123123'));
  return (
    <div>123123</div>
  );
};
