import { changeToDu } from './gps';

// tslint:disable-next-line:variable-name
function parse(num: number) {
  // tslint:disable-next-line:radix
  return parseInt((num * 10).toString()) / 10;
}

export async function getImageInfo(image: any): Promise<any[]> {
  return new Promise((resolve): any => {
    if (!image) {
      return [];
    }
    (window as any).EXIF.getData(image, async function () {
      const allMetaData = (window as any).EXIF.getAllTags(this);
      let info: any = {};
      const exifData: any = {};
      const imgSrc = window.URL.createObjectURL(image);
      const imgHtml = document.createElement('img');
      imgHtml.src = imgSrc;
      const colorThief = new (window as any).ColorThief();
      info = await (async() => {
        return new Promise((res) => {
          imgHtml.onload = () => {
            res({
              color: colorThief.getColor(imgHtml),
              height: imgHtml.naturalHeight,
              width: imgHtml.naturalWidth,
            });
          };
        });
      })();
      if (allMetaData.ApertureValue) {
        exifData.aperture = parse(allMetaData.ApertureValue);
      }
      if (allMetaData.FNumber) {
        exifData.aperture = parse(allMetaData.FNumber);
      }
      if (allMetaData.ExposureTime) {
        exifData.exposureTime = `${allMetaData.ExposureTime.numerator}/${
          allMetaData.ExposureTime.denominator
        }`;
      }
      if (allMetaData.FocalLength) {
        exifData.focalLength = parse(allMetaData.FocalLength);
      }
      if (allMetaData.ISOSpeedRatings) {
        exifData.iso = allMetaData.ISOSpeedRatings;
      }
      if (allMetaData.Make) {
        exifData.make = allMetaData.Make;
      }
      if (allMetaData.Model) {
        exifData.model = allMetaData.Model;
      }
      if (allMetaData.GPSLatitude && allMetaData.GPSLatitude.length === 3) {
        exifData.gps = [
          changeToDu(
            allMetaData.GPSLatitude[0],
            allMetaData.GPSLatitude[1],
            allMetaData.GPSLatitude[2],
          ),
          changeToDu(
            allMetaData.GPSLongitude[0],
            allMetaData.GPSLongitude[1],
            allMetaData.GPSLongitude[2],
          ),
        ];
      }
      info.exif = exifData;
      resolve([info, imgSrc]);
    });
  });
}
