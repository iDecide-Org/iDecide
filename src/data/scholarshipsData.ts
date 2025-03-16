interface Scholarship {
  id: number;
  title: string;
  organization: string;
  description: string;
  amount: string;
  deadline: string;
  location: string;
  type: string;
  image: string;
  eligibility: string[];
  requirements: string[];
  applicationLink: string;
  views: string;
}

const scholarships: Scholarship[] = [
  {
    id: 1,
    title: "منحة التفوق الأكاديمي",
    organization: "مؤسسة مصر الخير",
    description:
      "منحة دراسية كاملة للطلاب المتفوقين أكاديميًا في المرحلة الثانوية للدراسة في أفضل الجامعات المصرية",
    amount: "تغطية كاملة للمصروفات الدراسية",
    deadline: "2024-08-15",
    location: "مصر",
    type: "منحة كاملة",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2071&auto=format&fit=crop",
    eligibility: [
      "الحصول على 95% أو أعلى في الثانوية العامة",
      "إجادة اللغة الإنجليزية",
      "اجتياز المقابلة الشخصية",
    ],
    requirements: [
      "نسخة من شهادة الثانوية العامة",
      "خطاب توصية من المدرسة",
      "السيرة الذاتية",
      "خطاب تحفيزي",
    ],
    applicationLink: "https://www.misr-elkhair.org/scholarships",
    views: "3.2K",
  },
  {
    id: 2,
    title: "منحة المهندسين الشباب",
    organization: "شركة أوراسكوم للإنشاءات",
    description:
      "منحة جزئية للطلاب المتميزين في مجال الهندسة لمواصلة دراستهم الجامعية",
    amount: "50,000 جنيه سنوياً",
    deadline: "2024-09-01",
    location: "القاهرة",
    type: "منحة جزئية",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa2x83fbP0hdiHJCZPXmjZ7DPg7cJaFCxEoQ&s",
    eligibility: [
      "طلاب كليات الهندسة",
      "معدل تراكمي لا يقل عن 3.5",
      "المشاركة في أنشطة طلابية",
    ],
    requirements: [
      "السجل الأكاديمي",
      "شهادة حسن سير وسلوك",
      "خطاب توصية من أستاذ جامعي",
    ],
    applicationLink: "https://www.orascom.com/scholarships",
    views: "2.8K",
  },
  {
    id: 3,
    title: "منحة المواهب الطبية",
    organization: "مستشفى دار الفؤاد",
    description:
      "منحة للطلاب المتميزين في مجال الطب البشري لدعم مسيرتهم التعليمية",
    amount: "75,000 جنيه سنوياً",
    deadline: "2024-07-30",
    location: "القاهرة، الإسكندرية",
    type: "منحة جزئية",
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2070&auto=format&fit=crop",
    eligibility: [
      "طلاب كليات الطب البشري",
      "معدل تراكمي لا يقل عن 3.7",
      "اجتياز اختبار القدرات",
    ],
    requirements: ["السجل الأكاديمي", "خطابي توصية", "اجتياز المقابلة الشخصية"],
    applicationLink: "https://www.darelfouad.org/scholarships",
    views: "4.5K",
  },
  {
    id: 4,
    title: "منحة التفوق العلمي",
    organization: "البنك الأهلي المصري",
    description: "منحة دراسية للطلاب المتفوقين في مجالات العلوم والتكنولوجيا",
    amount: "60,000 جنيه سنوياً",
    deadline: "2024-08-25",
    location: "جميع محافظات مصر",
    type: "منحة كاملة",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop",
    eligibility: [
      "الحصول على 90% أو أعلى في الثانوية العامة",
      "التخصص في مجالات العلوم أو التكنولوجيا",
      "إجادة اللغة الإنجليزية",
    ],
    requirements: [
      "نسخة من شهادة الثانوية العامة",
      "شهادات الإنجازات العلمية",
      "اجتياز الاختبار التحريري",
    ],
    applicationLink: "https://www.nbe.com.eg/scholarships",
    views: "5.1K",
  },
  {
    id: 5,
    title: "منحة الإعلام والصحافة",
    organization: "مؤسسة الأهرام",
    description: "منحة لدعم الطلاب المتفوقين في مجال الإعلام والصحافة",
    amount: "45,000 جنيه سنوياً",
    deadline: "2024-09-15",
    location: "القاهرة",
    type: "منحة جزئية",
    image:
      "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?q=80&w=2070&auto=format&fit=crop",
    eligibility: [
      "طلاب كليات الإعلام",
      "إجادة مهارات الكتابة",
      "المشاركة في أنشطة إعلامية",
    ],
    requirements: [
      "نماذج من الأعمال الصحفية",
      "خطاب توصية",
      "اجتياز اختبار الكتابة",
    ],
    applicationLink: "https://www.ahram.org.eg/scholarships",
    views: "2.3K",
  },
  {
    id: 6,
    title: "منحة التميز في علوم الحاسب",
    organization: "شركة مايكروسوفت مصر",
    description: "منحة تعليمية للطلاب المتميزين في مجالات علوم الحاسب والبرمجة",
    amount: "80,000 جنيه سنوياً",
    deadline: "2024-07-20",
    location: "القاهرة، الإسكندرية، أسيوط",
    type: "منحة كاملة",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
    eligibility: [
      "طلاب كليات الحاسبات والمعلومات",
      "خبرة سابقة في البرمجة",
      "معدل تراكمي لا يقل عن 3.6",
    ],
    requirements: [
      "نماذج من المشاريع البرمجية",
      "شهادات في مجال البرمجة",
      "اجتياز اختبار برمجي",
    ],
    applicationLink: "https://www.microsoft.com/egypt/scholarships",
    views: "6.7K",
  },
];

export default scholarships;
