import Navbar from "./NavBar";
import { Link } from "react-router-dom"; // Fixed incorrect import
import { ArrowRight, Book, GraduationCap, Search } from "lucide-react";
import Footer from "./Footer";

const HomePage: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col min-h-screen w-full overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center p-8 w-full">
        <div className="flex w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
          {/* Left Content (Text & Call to Action) */}
          <div className="flex-none w-full md:w-[55%] p-12 flex flex-col justify-center items-start">
            <div className="text-center w-full">
              <h1 className="text-5xl font-bold mb-6 text-gray-800 leading-tight">
                <span className="block mb-2">
                  اكتشف مستقبلك الأكاديمي والمهني مع
                </span>
                <span className="text-blue-600 block">iDecide</span>
              </h1>
            </div>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed text-center">
              بمساعدة الذكاء الاصطناعي, ستتمكن من اختيار الجامعة, التخصص,
              والمسار الوظيفي الأنسب لك بكل سهولة وفعالية.
            </p>
            <div className="flex space-x-4 justify-center w-full">
              <Link
                to="/signup"
                className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition duration-300 flex items-center space-x-2"
              >
                ابدأ الآن <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/explore"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-md transition duration-300 flex items-center space-x-2"
              >
                <Search className="w-5 h-5" /> استكشف المزيد
              </Link>
            </div>
          </div>
          {/* Image Section */}
          <div className="w-full md:w-[45%] bg-blue-50 flex items-center justify-center p-8 overflow-hidden">
            <img
              src="/graduation.jpg"
              alt="Graduation Illustration"
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
            ؟iDecide ما الذي يميز
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
              <GraduationCap className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                توجيه أكاديمي مخصص
              </h3>
              <p className="text-gray-600 text-center">
                احصل على توصيات مخصصة للجامعات والتخصصات بناءً على اهتماماتك
                وقدراتك.
              </p>
            </div>
            {/* Feature Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
              <Search className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                اكتشاف شامل للفرص
              </h3>
              <p className="text-gray-600 text-center">
                استكشف مجموعة واسعة من التخصصات والمسارات الوظيفية التي قد تكون
                مناسبة لك.
              </p>
            </div>
            {/* Feature Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
              <Book className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                دعم مستمر في رحلتك
              </h3>
              <p className="text-gray-600 text-center">
                نحن هنا لمساعدتك في كل خطوة على طريق تحقيق أهدافك الأكاديمية
                والمهنية.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;
