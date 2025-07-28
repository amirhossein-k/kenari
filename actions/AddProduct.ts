// actions\AddProduct.ts
'use server'

import { getSession } from "@/lib/auth";
import { Category, resADDPOSTType, TagType } from "@/types/types";
import { GenerateId } from "@/utils/generateID";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

interface ImageObject {
    key: string;
    url: string;
    id: string;
}


interface ADDproduct {
    title: string,
    price: string,
    content: string,
    checkbox: string, //pusblished
    detailImage: ImageObject[],
    imageDefult: string,
    selectedImageId: string | null,
    countproduct: number,
    count: number,
    category: Category[]
    tags: TagType[]
}
export async function ADDProdut(bodyReq: ADDproduct):Promise<resADDPOSTType> {

    try {
        console.log(bodyReq, 'body')

        const tokken = await getSession()
        console.log(tokken,'token ADDProdut')
        if (!tokken) {
            return {
                error: 'کاربر احراز هویت نشده است',
                status:401,
                success:false,
                message:''
            }
         
        }

        const newuser = await prisma.post.create({
            data: {
                id: GenerateId('Post'),
                authorId: tokken.id,
                title: bodyReq.title,
                price: Number(bodyReq.price),
                count: bodyReq.count,
                published: bodyReq.checkbox === "true",
 content: bodyReq.content,
                countproduct: bodyReq.countproduct,
                tags: {
                    create: bodyReq.tags.map(tag => ({
                        id: tag.id,
                        text: tag.text,
                        className: tag.className ?? null
                    }))
                }



            }
        })

        
    const filternotEmty = bodyReq.detailImage.filter(filt => filt.key !== '');
    for (let i = 0; i < filternotEmty.length; i++) {
      if (filternotEmty[i].id === bodyReq.selectedImageId) {
        await prisma.productImage.create({
          data: {
            id:GenerateId('Image'),
            defaultImage: true,
            childImage: filternotEmty[i].url,
            fileKey: filternotEmty[i].key,
            ownerId: newuser.id,
          },
        });
      } else {
        await prisma.productImage.create({
          data: {
             id:GenerateId('Image'),
            defaultImage: false,
            childImage: filternotEmty[i].url,
            fileKey: filternotEmty[i].key,
            ownerId: newuser.id,
          },
        });
      }
    }

        // category
    for(let i = 0; i<bodyReq.category.length;i++){
      await prisma.categoryList.create({
        data:{
            id:bodyReq.category[i].id,
          category:bodyReq.category[i].category,
          ownerId:newuser.id
        }
      })
    }

    return {
        success:true,
        message: "پست جدید ذخیره شد" ,
        status:201,
        error:''
    }
     

    } catch (error) {
        console.log(error)
         return {
        success:false,
        message: "خطا اینترنت چک کن" ,
        status:400,
        error:'خطا اینترنت چک کن'
    }
    }

}