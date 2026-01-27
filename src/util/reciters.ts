export interface Reciter {
  id: string;
  nameAr: string;
  nameEn: string;
  quality: number;
}

export const reciters: Reciter[] = [
  {
    id: "ar.alafasy",
    nameAr: "مشاري راشد العفاسي",
    nameEn: "Mishary Rashid Alafasy",
    quality: 128,
  },
  {
    id: "ar.abdulbasitmurattal",
    nameAr: "عبد الباسط عبد الصمد (مرتل)",
    nameEn: "Abdul Basit (Murattal)",
    quality: 192,
  },
  {
    id: "ar.abdurrahmaansudais",
    nameAr: "عبد الرحمن السديس",
    nameEn: "Abdul Rahman Al-Sudais",
    quality: 192,
  },
  {
    id: "ar.husary",
    nameAr: "محمود خليل الحصري",
    nameEn: "Mahmoud Khalil Al-Husary",
    quality: 128,
  },
  {
    id: "ar.minshawi",
    nameAr: "محمد صديق المنشاوي",
    nameEn: "Mohamed Siddiq El-Minshawi",
    quality: 128,
  },
  {
    id: "ar.ahmedajamy",
    nameAr: "أحمد بن علي العجمي",
    nameEn: "Ahmad Al-Ajmy",
    quality: 128,
  },
  {
    id: "ar.hanirifai",
    nameAr: "هاني الرفاعي",
    nameEn: "Hani Ar-Rifai",
    quality: 192,
  },
];

export const DEFAULT_RECITER_ID = "ar.alafasy";

export const getReciterById = (id: string): Reciter | undefined => {
  return reciters.find((r) => r.id === id);
};
