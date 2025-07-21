"use client";


// import Image from "next/image";
import React from "react";
// import { CiTrash } from "react-icons/ci";
// import { FaMinus, FaRegPlusSquare } from "react-icons/fa";
// import { MdClose } from "react-icons/md";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { Accordion, AccordionItem } from "@heroui/react";
import { BiSolidDownArrow } from "react-icons/bi";

import { Select, SelectItem } from "@heroui/react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

 const anam = [
  {key: "plan1", label: "5 هزار تومن"},
  {key: "plan2", label: "10  هزار تومن"},
  {key: "plan3", label: "15 هزار تومن"},
  
];

const animals = [
  { key: "desk1", label: "میز شماره 1" },
  { key: "desk2", label: "میز شماره 2" },
  { key: "desk3", label: "میز شماره 3" },
];

const detailOrder = [
  { title: "جمع محصولات", price: 500, id: 444 },
  { title: "هزینه‌ی بسته‌بندی ", price: 500, id: 445 },
  { title: "هزینه‌ی ارسال ", price: 500, id: 446 },
  { title: " تخفیف", price: 500, id: 447 },
  { title: "مالیات ", price: 500, id: 448 },
  { title: "انعام ", price: 500, id: 450 },
  { title: "هزینه سرویس ", price: 500, id: 449 },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AnchorIcon = (props: any) => {
  return (
    <BiSolidDownArrow {...props} />

    // <div  {...props}>hi</div>
  );
};

const Cartpage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();


  // const router = useRouter();

  const [selected, setSelected] = React.useState("box1");
const [valuegarson, setValueGarson] = React.useState<Set<string>>(new Set());
const [selectedDesk, setSelectedDesk] = React.useState<Set<string>>(new Set());


 





  const handleFinish = () => {
    onOpen();
  };

  const handleTabChange = (key: React.Key) => {
    setSelected(String(key));
  };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleSelectChange = (keys: any) => {
  if (keys === "all") {
    setValueGarson(new Set(anam.map((item) => item.key)));
  } else {
    setValueGarson(keys as Set<string>);
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDeskSelectChange = (keys: any) => {
  if (keys === "all") {
    setSelectedDesk(new Set(animals.map((item) => item.key)));
  } else {
    setSelectedDesk(keys as Set<string>);
  }
};

  return (
    <div className="mt-2 p-2 flex flex-col gap-2 w-full bg-red-300" dir="rtl">
      <Tabs
        aria-label="Options"
        selectedKey={selected}
        onSelectionChange={handleTabChange}
      >
        <Tab key="box1" title="تحویل حضوری">
          <Card>
            <CardBody>ffff</CardBody>
          </Card>
        </Tab>
        <Tab key="box2" title="سرو در محل">
          <Card>
            <CardBody>
              سرو
              <Select
                className="max-w-xs"
                items={animals}
                label="شماره میز"
                placeholder="میز خود را انتخاب کنید"
                selectedKeys={selectedDesk}
  onSelectionChange={handleDeskSelectChange}
                
              >
                {(animal) => (
                  <SelectItem className="flex ">{animal.label}</SelectItem>
                )}
              </Select>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>

      <div className="">
        <Accordion>
          <AccordionItem
            key="anchor"
            aria-label="جزئیات پرداخت"
            indicator={<AnchorIcon />}
            title="جزئیات پرداخت"
          >
            <ul className="block   bg-blue-500 gap-2 p-1 rounded-lg">
              {detailOrder.map((item) => {
                return (
                  <li
                    key={item.id}
                    className="flex  justify-between p-2 bg-green-300 gap-2"
                  >
                    <span>{item.title}</span>
                    <span>{item.price}</span>
                  </li>
                );
              })}
            </ul>
          </AccordionItem>
        </Accordion>

        <div className="">
          <input
            type="text"
            name=""
            id=""
            placeholder="توضحیحات"
            className="w-full rounded-md py-3 px-2"
          />
        </div>
      </div>

      <div className="bottom flex justify-between p-2 gap-1 mx-3">
        <button
          className="bg-blue-200 w-[20%] rounded-md py-4 text-medium"
          onClick={handleFinish}
        >
          ثبت سفارش
        </button>
        <div className="w-[50%] text-center py-3 flex flex-col text-medium">
          <span>قیمت کل</span>
          450 تومان
        </div>
      </div>
      <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {" "}
                مایل به پرداخت انعام هستید؟
              </ModalHeader>
              <ModalBody>
                <input type="text" placeholder="مبلغ دلخواه را وارد کنید" />
                 <Select
        className="max-w-xs"
        label="مقدار انعام"
        placeholder=""
        selectedKeys={valuegarson}
        variant="bordered"
        onSelectionChange={handleSelectChange}
      >
        {anam.map((animal) => (
          <SelectItem key={animal.key}>{animal.label}</SelectItem>
        ))}
      </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
             پراخت صورت حساب
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Cartpage;
