// components/utils/ConfirmationModal.tsx
'use client';


export default function ConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white text-black p-6 rounded-lg">
        <p className="mb-4 text-xl">آیا مطمئنید می‌خواهید خارج شوید؟</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded text-xl"
          >
            بله
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-200 px-4 py-2 rounded text-black text-xl"
          >
            لغو
          </button>
        </div>
      </div>
    </div>
  );
}