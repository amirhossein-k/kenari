// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '@/lib/s3';
// import { s3Client } from '@/lib/s3-parspack';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    // اعتبارسنجی فایل
    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: 'لطفا یک فایل تصویر انتخاب کنید' },
        { status: 400 }
      );
    }



    // تبدیل File به Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // پارامترهای آپلود
    const params = {
      Bucket: process.env.LIARA_BUCKET_NAME ??'c961427',
      Key: `uploads/${Date.now()}-${file.name}`,
      Body: buffer,
      ContentType: file.type,
    };

    // آپلود به پارس‌پک
    const  up = await s3Client.send(new PutObjectCommand(params));
console.log(up,'up')
    // let typefile = ''
    // const searchChar = params.ContentType.search('/')
    
    // typefile = params.ContentType.slice(searchChar +1)

    
   

    // تولید لینک عمومی
    const publicUrl =`${process.env.LIARA_ENDPOINT!}/${process.env.LIARA_BUCKET_NAME!}/${params.Key}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      Key:`uploads/${Date.now()}-${file.name}`
    });

  } catch (error) {
    console.error('خطا در آپلود:', error);
    return NextResponse.json(
      { error: 'خطا در آپلود فایل' },
      { status: 500 }
    );
  }
}