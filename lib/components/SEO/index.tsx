import React from 'react';
import { NextSeo, NextSeoProps } from 'next-seo';
import Head from 'next/head';

interface IItemProp {
  image?: string;
}

interface IProps extends NextSeoProps {
  itemprop?: IItemProp;
}

export const SEO: React.FC<IProps> = ({ itemprop, ...rest }) => {
  const meta: React.ReactNode[] = [];
  if (itemprop) {
    meta.push(
      <meta
        itemProp="image"
        content={itemprop.image || `http:${process.env.CDN_URL}/logo-512x512.png`}
      />,
    );
  }
  return (
    <>
      <NextSeo
        {...rest}
      />
      <Head>
        {meta}
        <meta
          itemProp="name"
          content={rest.title}
        />
        <meta
          itemProp="description"
          content={rest.description}
        />
      </Head>
    </>
  );
};
