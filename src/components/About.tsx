import React from "react";
import Navbar from "./NavBar";
import { Book, GraduationCap, Brain, Target } from "lucide-react";

const About: React.FC = () => {
  const features = [
    {
      icon: <Brain className="w-12 h-12 text-blue-600" />,
      title: "الذكاء الاصطناعي",
      description:
        "نستخدم تقنيات الذكاء الاصطناعي المتقدمة لتقديم توصيات مخصصة للطلاب",
    },
    {
      icon: <Target className="w-12 h-12 text-blue-600" />,
      title: "قرارات مدروسة",
      description:
        "نساعد الطلاب على اتخاذ قرارات تعليمية مستنيرة بناءً على قدراتهم واهتماماتهم",
    },
    {
      icon: <GraduationCap className="w-12 h-12 text-blue-600" />,
      title: "تنوع التعليم",
      description:
        "نوفر معلومات شاملة عن مختلف الجامعات والتخصصات والمسارات المهنية",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-800/90" />
            <div className="relative z-10">
              <Book className="w-16 h-16 mx-auto mb-6" />
              <h1 className="text-4xl font-bold mb-4">من نحن</h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                iDecide هو منصتك الشاملة لاتخاذ القرارات التعليمية الذكية
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8 md:p-16">
            {/* Mission Statement */}
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">مهمتنا</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                نسعى في iDecide إلى تمكين الطلاب من اتخاذ القرارات المهمة بشأن
                تعليمهم العالي بثقة وفعالية. نقدم منصة متكاملة تجمع بين
                التكنولوجيا المتقدمة والمعلومات الشاملة لمساعدة الطلاب في اختيار
                مسارهم الأكاديمي والمهني.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 bg-blue-50 rounded-xl p-8">
              {[
                { number: "1000+", label: "طالب مسجل" },
                { number: "50+", label: "جامعة شريكة" },
                { number: "200+", label: "تخصص دراسي" },
                { number: "24/7", label: "دعم مستمر" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-16 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              هل أنت مستعد لبدء رحلتك التعليمية؟
            </h3>
            <p className="text-gray-600 mb-8">
              انضم إلينا اليوم واكتشف مستقبلك الأكاديمي
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1">
              ابدأ الآن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
