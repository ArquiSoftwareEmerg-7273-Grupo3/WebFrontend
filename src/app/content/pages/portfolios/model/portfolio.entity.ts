import {GalleryItem} from './gallery-item.entity';

export class Portfolio {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public imageSrc: string,
    public showMenu?: boolean,
    public galleryItems?: GalleryItem[],
  ) {
  }
}
