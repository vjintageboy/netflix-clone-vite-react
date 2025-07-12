import { useState } from 'react';
import banner from "../assets/login/login_banner.jpg";

export default function Login() {
    const [isSignIn, setIsSignIn] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }
        
        if (!formData.password) {
            newErrors.password = 'Mật khẩu là bắt buộc';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        
        if (!isSignIn && !formData.name) {
            newErrors.name = 'Tên là bắt buộc';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            console.log(isSignIn ? 'Đăng nhập' : 'Đăng ký', formData);
            // Here you would typically redirect or handle successful login
        }, 1000);
    };

    const toggleMode = () => {
        setIsSignIn(!isSignIn);
        setFormData({ email: '', password: '', name: '' });
        setErrors({});
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${banner})` }}
            >
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* Netflix Logo */}
            <div className="absolute top-6 left-6 z-10">
                <img src="/netflix-3.svg" alt="Netflix" className="h-8" />
            </div>

            {/* Login Form */}
            <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
                <div className="w-full max-w-md">
                    <div className="bg-black/75 p-8 rounded-lg">
                        <h1 className="text-white text-3xl font-bold mb-6">
                            {isSignIn ? 'Đăng nhập' : 'Đăng ký'}
                        </h1>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isSignIn && (
                                <div>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Tên của bạn"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 bg-gray-700 text-white rounded-md border ${
                                            errors.name ? 'border-red-500' : 'border-gray-600'
                                        } focus:outline-none focus:border-white focus:bg-gray-600`}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                    )}
                                </div>
                            )}
                            
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email hoặc số điện thoại"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 bg-gray-700 text-white rounded-md border ${
                                        errors.email ? 'border-red-500' : 'border-gray-600'
                                    } focus:outline-none focus:border-white focus:bg-gray-600`}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>
                            
                            <div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Mật khẩu"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 bg-gray-700 text-white rounded-md border ${
                                        errors.password ? 'border-red-500' : 'border-gray-600'
                                    } focus:outline-none focus:border-white focus:bg-gray-600`}
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                )}
                            </div>
                            
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-red-600 text-white py-3 rounded-md font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Đang xử lý...' : (isSignIn ? 'Đăng nhập' : 'Đăng ký')}
                            </button>
                        </form>

                        {isSignIn && (
                            <div className="mt-4 text-center">
                                <a href="#" className="text-gray-300 hover:text-white text-sm">
                                    Quên mật khẩu?
                                </a>
                            </div>
                        )}

                        <div className="mt-6 text-gray-300 text-sm">
                            {isSignIn ? (
                                <>
                                    Bạn mới tham gia Netflix?{' '}
                                    <button 
                                        onClick={toggleMode}
                                        className="text-white hover:underline"
                                    >
                                        Đăng ký ngay
                                    </button>
                                </>
                            ) : (
                                <>
                                    Đã có tài khoản?{' '}
                                    <button 
                                        onClick={toggleMode}
                                        className="text-white hover:underline"
                                    >
                                        Đăng nhập ngay
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="mt-4 text-xs text-gray-400">
                            <p>
                                Trang này được bảo vệ bởi reCAPTCHA của Google để đảm bảo bạn không phải là bot.{' '}
                                <a href="#" className="text-blue-500 hover:underline">Tìm hiểu thêm</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}