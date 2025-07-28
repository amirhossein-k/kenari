
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
  title:string
}
// item2 ==> type of plus in to order
export interface Item2{
    id:number
    counter:number,
    price:number,
    title:string
}


export interface orderedProduct extends Omit<Product,'thumbnail'|"tags">{
    userId: number,
    item1: Item1,
    item2: Item2[],
    countOrder:number

}



export interface userType{
    id:string,
  name  :string
  admin: boolean
  phoneNumber :string
  verify:boolean
  code: string
}


export interface  TagType {
    id: string;
  text: string;
  className?: string | null; // ← اضافه شود null
}

// admin
export interface USERTYPEAdmin {
    id        :string
    
   phoneNumber : string
   code: string
    name     :string|null
    posts?   :  POSTTYPE[]
    createdAt :Date
    verify: boolean;
    admin:   boolean

  }
 export interface PHOTO {
    id:string
    defaultImage:boolean
    childImage:string
    fileKey:string |null
    ownerId:string | null
    
  
  }

// رابط جدید برای خروجی با تاریخ‌های فرمت‌شده
export interface FormattedPostType extends Omit<POSTTYPE, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}


   export interface POSTTYPE {
    id     :  string
    content? :string | null
    title:string
    published :boolean
    price:number
    count :number
    countproduct : number
    author? :USERTYPEAdmin
    authorId :string
    createdAt :Date
    updatedAt:Date
    productImage: PHOTO[]
    categoryList: Category[]
 
    tags: TagType[]
  }


     export interface POSTTYPERedux {
    id     :  string
    content? :string | null
    title:string
    published :boolean
    price:number
    count :number
    countproduct : number
    author? :USERTYPEAdmin
    authorId :string
    createdAt :string
    updatedAt:string
    productImage: PHOTO[]
    categoryList: Category[]
 
    tags: TagType[]
  }


  export interface Category{
    id: string
    category :string
    
  }

 export interface ADRESS {
    location: string;
    state: string;
    zipcode: string;
    id: string
    userId:string
  }

  export interface resADDPOSTType{
  error:string,
                status:number,
                success:boolean,
                message:string
                
  }

export  type GetProductByIdResult =
  | { success: true; status: number; message: string; data: POSTTYPE }
  | { success: false; status: number; error: string; message: string; data: null };


  export type GetAllProductsResult =
  | { success: true; status: number; message: string; data: POSTTYPE[] }
  | { success: false; status: number; error: string; message: string; data: null };


