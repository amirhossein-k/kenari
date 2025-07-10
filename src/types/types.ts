 export interface Product{
    id:number
    title: string;
  description: string;
  price: number;
  thumbnail: string;
  tags: string[];
}

// item1 ==> type of  ordermain
interface Item1{
    id:number
    order:number,
    price:number
}

// item2 ==> type of plus in to order


export interface orderedProduct extends Omit<Product,'thumbnail'|"tags">{
    userId: number,
    item1: Item1[],
    item2: Item1[]

}

