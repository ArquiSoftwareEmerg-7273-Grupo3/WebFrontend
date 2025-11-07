export class Portfolio {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public imageUrl: string,
    public showMenu?: boolean,
    public galleryItems?: GalleryItem[],
  ) {
  }
}
export interface GalleryItem {
  id: number;
  title: string;
  imageUrl: string;
}
