import { Head } from 'next/document';
import * as React from 'react';

import { getImageInfo } from '@pages/common/utils/image';

export default () => {
  const addPicture = () => {};
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(await getImageInfo(e.target.files[0]));
  };
  return (
    <div>
      {/* <Head>
        <script src="//unpkg.com/exif-js@2.3.0/exif.js" />
        <script src="//unpkg.com/color-thief@2.2.3/js/color-thief.js" />
      </Head> */}
      <input
        accept="image/*"
        type="file"
        onChange={handleChange}
      />
      <div>
        <button
          onClick={addPicture}
        >
          <span>上传</span>
        </button>
      </div>
    </div>
  );
};
