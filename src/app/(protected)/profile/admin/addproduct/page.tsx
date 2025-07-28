// src\app\(protected)\dashboard\addproduct\page.tsx
'use client';
import styles from '@/styles/styles/checkBox/Checkbox.module.css'
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Upload from '@/components/upload/Upload';
import Image from 'next/image';
import { handleChangeCheckbox } from '@/utils/handleChangeCheckbox';
import CustomEditor from '@/components/textEditor/CustomEditor';
import { Select, SelectItem } from "@heroui/react";
import Tagss from '@/components/Tags/Tagss';
import { ADDProdut } from '../../../../../../actions/AddProduct';
import { GenerateId } from '@/utils/generateID';
import toast from 'react-hot-toast';
import { resADDPOSTType } from '@/types/types';


interface ImageObject {
  key: string;
  url: string;
  id: string;
}

const useNavigationGuard = (shouldWarn: boolean) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!shouldWarn) return;

    // 1. هندلر برای بستن صفحه/رفرش
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    // 2. هندلر برای دکمه بازگشت مرورگر
    const handlePopState = () => {
      if (!window.confirm('آیا مطمئنید میخواهید صفحه را ترک کنید؟')) {
        window.history.pushState({}, '', pathname);
        router.refresh();
      }
    };

    // 3. هندلر برای تغییر مسیرهای داخلی
    const handleRouteChange = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (anchor && !confirm('آیا مطمئنید میخواهید از صفحه خارج شوید؟')) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };

    // اضافه کردن هندلرها
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleRouteChange, true);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleRouteChange, true);
    };
  }, [shouldWarn, pathname, router]);
};

const categories = [
  { key: "lavazemKhane", label: "لوازم خانه" },
  { key: "mobile", label: "موبایل" },
  { key: "dekori", label: "لوازم دکوری" },
  { key: "qhab", label: "قاب ها" },
];

interface TagType {
  id: string;
  text: string;
  className?: string;
}

export default function AddProduct() {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [html, setHtml] = useState<string>("متن خود را اینجا وارد کنید...");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [count, setCount] = useState<number>(0);
  const [countproduct, setCountproduct] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [imageDefult, setImageDefult] = useState('');
  const [detailImage, setDetailImage] = useState<ImageObject[]>([{ key: '', url: "", id: "" }])
  const [checkbox, setCheckbox] = useState('عدم انتشار')
  const router = useRouter();
  const [tags, setTags] = useState<TagType[]>([]);
  
  const [hasUnsavedChanges] = useState(true);
  useNavigationGuard(hasUnsavedChanges);





  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
console.log(tags,'tags')
console.log(name,'title')
console.log(price,'price')
console.log(html,'html')
console.log(html,'content')
console.log(checkbox,'//pusblished')
console.log(imageDefult,'img')
console.log(`
  iamg ==>> 
  detailImage:${detailImage} |
  imageDefult:${imageDefult} | 
  selectedImageId: ${selectedImageId}
  `)
  console.log(countproduct,'countproduct')
  console.log(count,'count')
  console.log(countproduct,'countproduct')

  const categoryArray = Array.from(selectedCategories).map(key=>{
    return{
      id:GenerateId('category'),
      category:key
    }
  })
  console.log(categoryArray,'category')

  
  
const payload =  {
  title:name,
  price,
  content: html,
  checkbox, //pusblished
  detailImage, imageDefult,selectedImageId, //image
countproduct,count,
  category: categoryArray,
  tags
}

const data:resADDPOSTType = await ADDProdut(payload)
    console.log(data,'client res')


  console.log(data,'data add client ')
if (data?.success) {
  toast.success(data.message)
router.push('/menu/table')
}else{
  toast.error(data.error)
}

  };

  const handleDefultImage = (img: ImageObject) => {

    const match = img.url.match(/uploads%2F(.*?)(?=&|$)/);

    const r = match ? decodeURIComponent(match[1]) : '';
    const p = `uploads/${r}`

    console.log(r, 'r')
    setImageDefult(p)
    setSelectedImageId(img.id); // ذخیره id تصویر انتخاب‌شده

    console.log(img, 'scr')
  }

  return (

    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-black">
      <h1 className="text-2xl font-bold mb-6 text-center">افزودن محصول</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Upload detailImage={detailImage} setDetailImage={setDetailImage} edit={false} />
        <div>
          <label className="block mb-2">نام محصول:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"

          />
        </div>

        <div>
          <label className="block mb-2">قیمت:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded"

          />
        </div>
     
        
        <div>
        <Tagss onTagsChange={setTags}/>
        </div>

        <div className={`${styles.checkbox_wrapper_8} `}>
          <input
            className={`${styles.tgl} ${styles.tgl_skewed}`}
            id="cb3-8" type="checkbox"
            //  value={checkbox} 
            checked={checkbox === "انتشار"}
            onChange={(e) => handleChangeCheckbox(e, setCheckbox)}
          />
          <label className={`${styles.tgl_btn} `} data-tg-off="عدم انتشار" data-tg-on="انتشار" htmlFor="cb3-8"></label>
          <p>مقدار انشتار: {checkbox}</p>
        </div>
        <div className="count">
          <label className={`mx-2`} htmlFor="available">وضعیت موجودی :</label>
          <input className='border-gray-400 border rounded-lg px-2 py-2 ' id='available' type="number" value={count} onChange={e => setCount(Number(e.target.value))} />
        </div>
        <div className="countproduct">
          <label className={`mx-2`} htmlFor="countproduct">تعداد محصول  :</label>
          <input className='border-gray-400 border rounded-lg px-2 py-2 ' id='countproduct' type="number" value={countproduct} onChange={e => setCountproduct(Number(e.target.value))} />
        </div>
        <div className="mb-4">
          <label className="block mb-2">دسته‌بندی:</label>
          <Select
            label="دسته‌بندی"
            placeholder="چند  دسته‌بندی انتخاب کنید"
            selectionMode="multiple"
            selectedKeys={selectedCategories}

            onSelectionChange={(keys) => {
              // keys خودش Set<Key> هست؛ ما آن را Set<string> فرض می‌کنیم
              setSelectedCategories(keys as Set<string>);
            }}
          >
            {categories.map((cat) => (
              <SelectItem key={cat.key}>{cat.label}</SelectItem>
            ))}
          </Select>
        </div>

        <div>
          <h1 className="text-xl font-bold mb-4">ویرایشگر متن SunEditor</h1>
          <CustomEditor value={html} onChange={setHtml} />

          {/* پیش‌نمایش HTML با استایل سفارشی */}
          <div className="mt-4 p-4 border bg-gray-100">
            <h2 className="font-semibold mb-2">پیش‌نمایش:</h2>
            <div
              className="preview-content space-y-2 text-gray-800"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
          
        </div>
 

     
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          افزودن محصول
        </button>
      </form>
      {detailImage.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          {detailImage.find((item: ImageObject) => item.url !== '') && detailImage.filter(filt => filt.url !== '').map((img) => (
            <div key={img.id}>

              <Image
                src={img.url}
                alt="آپلود شده"
                className={`w-full h-24 object-cover rounded-lg border 
          ${selectedImageId === img.id ? 'border-4 border-blue-500' : 'border-gray-300'}`}
                width={100}
                height={100}
                onClick={() => handleDefultImage(img)}
              />

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
