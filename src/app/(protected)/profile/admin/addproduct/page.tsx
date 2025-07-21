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

export default function AddProduct() {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [html, setHtml] = useState<string>("متن خود را اینجا وارد کنید...");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [count, setCount] = useState<number>(0);
  const [countproduct, setCountproduct] = useState<number>(0);
  const [priceOffer, setPriceOffer] = useState<number>(0);
  const [error, setError] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dateOffer, setDateOffer] = useState<any>();
  const [imageDefult, setImageDefult] = useState('');
  const [detailImage, setDetailImage] = useState<ImageObject[]>([{ key: '', url: "", id: "" }])
  const [checkbox, setCheckbox] = useState('عدم انتشار')
  const router = useRouter();
  const [tags, setTags] = useState<string[]>([]);
  const [rows, setRows] = useState<number>(0);
  const [columns, setColumns] = useState<number>(0);
  const [tableData, setTableData] = useState<string[][]>([]);
  const [hasUnsavedChanges] = useState(true);
  useNavigationGuard(hasUnsavedChanges);


  // به‌روزرسانی tableData بر اساس تعداد ردیف‌ها و ستون‌ها
  useEffect(() => {
    if (rows > 0 && columns > 0) {
      const newTableData = Array.from({ length: rows }, () => Array(columns).fill(''));
      setTableData(newTableData);
    } else {
      setTableData([]);
    }
  }, [rows, columns]);

  // تبدیل tableData به HTML
  const generateTableHTML = () => {
    // بررسی خالی بودن یا تعریف‌نشده بودن tableData
    if (!tableData || tableData.length === 0 || tableData.every(row => row.every(cell => cell === ''))) {
      return ''; // رشته خالی در صورت نبود داده
    }
  
    // تولید HTML جدول
   // استفاده از کلاس‌های Tailwind برای جدول
  let tableHTMLe = `
    <table class="table-auto w-full border-collapse border border-gray-300 text-sm">
      <tbody>
  `;
  tableData.forEach(row => {
    tableHTMLe += '<tr class="odd:bg-gray-50">';
    row.forEach(cell => {
      tableHTMLe += `<td class="border border-gray-300 px-4 py-2 text-gray-800">${cell}</td>`;
    });
    tableHTMLe += '</tr>';
  });
  tableHTMLe += `
      </tbody>
    </table>
  `;
    return tableHTMLe;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(price, 'html')
    if (!name || !price) {
      setError('لطفا همه فیلدها را پر کنید');
      return;
    }
    const categoryArray = Array.from(selectedCategories);
    const tableHTML = generateTableHTML();

    // 1. ساخت HTML جدول از داده‌ها

  // 2. اگر جدول وجود دارد، فقط همین قسمت را نگه دار
 
  const fullContenttt = tableHTML
    ? `${html}<br>${tableHTML}`
    : html;


    console.log(fullContenttt, 'tableContent');
    // try {
    console.log(">>> Payload to send:", {
  tableContent: fullContenttt,
  
});
    const payload = JSON.stringify({ name, price, html, checkbox,
      tableContent: fullContenttt,      detailImage, imageDefult,
       selectedImageId, count, countproduct, priceOffer, category: categoryArray,tags  })
    console.log(payload, 'ersal')
    const res = await fetch('/api/products/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    });

    if (res.ok) {
      // به احتمال زیاد پاسخ حاوی JSON است، اما اگر ممکن است خالی باشد:
      const text = await res.text();
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const data = text ? JSON.parse(text) : {};
        router.push('/products/list');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("خطا در پردازش پاسخ سرور");
      }
    } else {
      const data = await res.json();
      setError(data.error || 'خطایی رخ داده است');
    }



  };

  const handleDefultImage = (img: ImageObject) => {
    // const src = e.currentTarget.src
    // const find = src.('uploads%2F')
    // const r = src.slice(find+1)
    // console.log(find,'eee')
    const match = img.url.match(/uploads%2F(.*?)(?=&|$)/);

    const r = match ? decodeURIComponent(match[1]) : '';
    const p = `uploads/${r}`

    console.log(r, 'r')
    setImageDefult(p)
    setSelectedImageId(img.id); // ذخیره id تصویر انتخاب‌شده

    console.log(img, 'scr')
  }
  // useEffect(()=>{},[checkbox])
  console.log(detailImage, 'image')
  console.log(checkbox, 'chevk')
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
          <label className="block mb-2">تخفیف:</label>
          <input
            type="number"
            value={priceOffer}
            onChange={(e) => setPriceOffer(Number(e.target.value))}
            className="w-full p-2 border rounded"

          />
        </div>
         <div>
          <label className="block mb-2">مدت زمان تخفیف :</label>
          <span className='text-sm '>تاریخ به میلادی وارد شود روز/ماه/سال/ساعت</span>
          <input
            type="text"
            value={dateOffer}
            onChange={(e) => setDateOffer(e.target.value)}
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
 {/* فیلدهای ورودی برای تعداد ردیف و ستون */}
 <div>
          <label className="block mb-2">تعداد ردیف‌ها:</label>
          <input
            type="number"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">تعداد ستون‌ها:</label>
          <input
            type="number"
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* فیلدهای ورودی برای سلول‌های جدول */}
        {rows > 0 && columns > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">ورود داده‌های جدول</h2>
            {tableData.map((row, rowIndex) => (
              <div key={rowIndex} className="flex space-x-2 mb-2">
                {row.map((cell, colIndex) => (
                  <input
                    key={`${rowIndex}-${colIndex}`}
                    type="text"
                    value={cell}
                    onChange={(e) => {
                      const newTableData = [...tableData];
                      newTableData[rowIndex][colIndex] = e.target.value;
                      setTableData(newTableData);
                    }}
                    className="w-full p-2 border rounded"
                    placeholder={`ردیف ${rowIndex + 1}, ستون ${colIndex + 1}`}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

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
