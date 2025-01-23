import React from "react";
import { Link } from "react-router-dom";
import {
  Book,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ExternalLink,
} from "lucide-react";
interface FooterProps {
  className?: string;
}
const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  return (
    <footer className={`bg-white border-t mt-auto ${className}`}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Book className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-800">iDecide</span>
            </div>
            <p className="text-gray-600 text-right">
              منصتك الشاملة لاتخاذ القرارات التعليمية الذكية واكتشاف مستقبلك
              الأكاديمي والمهني
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-right">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              روابط سريعة
            </h3>
            <ul className="space-y-2">
              {[
                { text: "الصفحة الرئيسية", link: "/" },
                { text: "من نحن", link: "/about" },
                { text: "استكشف الجامعات", link: "/universities" },
                { text: "اعرف نفسك", link: "/chatbot" },
                { text: "تواصل معنا", link: "/contact" },
              ].map((item) => (
                <li key={item.text}>
                  <Link
                    to={item.link}
                    className="text-gray-600 hover:text-blue-600 transition-colors flex items-center justify-end"
                  >
                    <span>{item.text}</span>
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="text-right">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              خدماتنا
            </h3>
            <ul className="space-y-2">
              {[
                "الإرشاد الأكاديمي",
                "استكشاف التخصصات",
                "المسارات المهنية",
                "التقييم الشخصي",
                "الاستشارات المهنية",
              ].map((service) => (
                <li key={service}>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-right">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              معلومات التواصل
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-end text-gray-600">
                <span className="text-right">القاهرة، مصر</span>
                <MapPin className="w-5 h-5 ml-2 text-blue-600" />
              </div>
              <div className="flex items-center justify-end text-gray-600">
                <span dir="ltr">+20 123 456 7890</span>
                <Phone className="w-5 h-5 ml-2 text-blue-600" />
              </div>
              <div className="flex items-center justify-end text-gray-600">
                <span>info@idecide.com</span>
                <Mail className="w-5 h-5 ml-2 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-600 text-sm">
              © {new Date().getFullYear()} iDecide. جميع الحقوق محفوظة
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
              >
                سياسة الخصوصية
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
              >
                الشروط والأحكام
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
