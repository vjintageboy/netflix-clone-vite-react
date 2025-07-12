import ytb from "../../assets/footer/youtube_icon.png";
import fb from "../../assets/footer/facebook_icon.png";
import ig from "../../assets/footer/instagram_icon.png";
import tw from "../../assets/footer/twitter_icon.png";

export default function Footer() {
  const socialLinks = [
    { icon: fb, alt: "Facebook", url: "https://facebook.com/netflix" },
    { icon: ig, alt: "Instagram", url: "https://instagram.com/netflix" },
    { icon: tw, alt: "Twitter", url: "https://twitter.com/netflix" },
    { icon: ytb, alt: "YouTube", url: "https://youtube.com/netflix" }
  ];

  const footerLinks = [
    {
      title: "Điều khoản sử dụng",
      items: [
        "Miêu tả âm thanh",
        "Quan hệ với nhà đầu tư",
        "Thông báo pháp lý",
        "Trung tâm trợ giúp"
      ]
    },
    {
      title: "Dịch vụ",
      items: [
        "Thẻ quà tặng",
        "Điều khoản sử dụng",
        "Thông tin doanh nghiệp",
        "Quan hệ truyền thông"
      ]
    },
    {
      title: "Tài khoản",
      items: [
        "Tài khoản",
        "Việc làm",
        "Quyền riêng tư",
        "Liên hệ với chúng tôi"
      ]
    },
    {
      title: "Khác",
      items: [
        "Tùy chọn cookie",
        "Thông tin doanh nghiệp",
        "Tốc độ kiểm tra",
        "Chỉ có trên Netflix"
      ]
    }
  ];

  return (
    <footer className="bg-black text-gray-400 py-12 px-4 md:px-16 w-[80vw] max-w-7xl mx-auto">
      <div className="max-w-7xl mx-auto">
        {/* Social Media Icons */}
        <div className="flex space-x-6 mb-8">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-300"
            >
              <img
                src={social.icon}
                alt={social.alt}
                className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity duration-300"
              />
            </a>
          ))}
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-white">
          {footerLinks.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-3">
              {section.items.map((item, itemIndex) => (
                <a
                  key={itemIndex}
                  href="#"
                  className="block text-sm !text-gray-400 hover:!underline transition-colors duration-300"
                >
                  {item}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Service Code Button */}
        <div className="mb-8">
          <button className="border border-gray-600 text-gray-400 px-4 py-2 text-sm hover:border-gray-400 hover:text-white transition-colors duration-300">
            Mã dịch vụ
          </button>
        </div>

        {/* Copyright */}
        <div className="text-sm text-gray-500 space-y-2">
          <p>© 1997-2025 Netflix, Inc.</p>
          <p>Netflix Việt Nam</p>
        </div>
      </div>
    </footer>
  );
}
