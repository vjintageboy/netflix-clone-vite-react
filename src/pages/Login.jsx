import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import banner from "../assets/login/login_banner.jpg";
import { auth } from '../config/firebase';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail,
    fetchSignInMethodsForEmail
} from "firebase/auth";

export default function Login() {
    const navigate = useNavigate();
    const [isSignIn, setIsSignIn] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showEmailExistsMessage, setShowEmailExistsMessage] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [resetPasswordEmail, setResetPasswordEmail] = useState('');
    const [resetPasswordMessage, setResetPasswordMessage] = useState('');

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
        // Clear email exists message when user types
        if (showEmailExistsMessage && name === 'email') {
            setShowEmailExistsMessage(false);
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
        setShowEmailExistsMessage(false);

        try {
            if (isSignIn) {
                // Đăng nhập
                await signInWithEmailAndPassword(auth, formData.email, formData.password);
                navigate("/profiles");
            } else {
                // Đăng ký
                const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                await updateProfile(userCredential.user, {
                    displayName: formData.name
                });
                navigate("/profiles");
            }
        } catch (error) {
            console.error("Lỗi xác thực:", error);
            console.error("Error code:", error.code);
            console.error("Error message:", error.message);
            
            // Xử lý các lỗi Firebase cụ thể
            if (error.code === 'auth/email-already-in-use') {
                setShowEmailExistsMessage(true);
                setErrors(prev => ({ 
                    ...prev, 
                    firebase: 'Email này đã được đăng ký. Bạn có muốn đăng nhập hoặc khôi phục mật khẩu không?' 
                }));
            } else if (error.code === 'auth/user-not-found') {
                setErrors(prev => ({ 
                    ...prev, 
                    firebase: 'Không tìm thấy tài khoản với email này. Bạn có muốn đăng ký không?' 
                }));
            } else if (error.code === 'auth/wrong-password') {
                setErrors(prev => ({ 
                    ...prev, 
                    firebase: 'Mật khẩu không đúng. Vui lòng thử lại.' 
                }));
            } else if (error.code === 'auth/invalid-email') {
                setErrors(prev => ({ 
                    ...prev, 
                    firebase: 'Email không hợp lệ. Vui lòng kiểm tra lại.' 
                }));
            } else if (error.code === 'auth/weak-password') {
                setErrors(prev => ({ 
                    ...prev, 
                    firebase: 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.' 
                }));
            } else if (error.code === 'auth/invalid-credential') {
                setErrors(prev => ({ 
                    ...prev, 
                    firebase: 'Thông tin đăng nhập không chính xác. Vui lòng kiểm tra lại email và mật khẩu.' 
                }));
            } else if (error.code === 'auth/user-disabled') {
                setErrors(prev => ({ 
                    ...prev, 
                    firebase: 'Tài khoản này đã bị vô hiệu hóa. Vui lòng liên hệ hỗ trợ.' 
                }));
            } else if (error.code === 'auth/too-many-requests') {
                setErrors(prev => ({ 
                    ...prev, 
                    firebase: 'Quá nhiều lần thử không thành công. Vui lòng thử lại sau.' 
                }));
            } else if (error.code === 'auth/network-request-failed') {
                setErrors(prev => ({ 
                    ...prev, 
                    firebase: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.' 
                }));
            } else {
                setErrors(prev => ({ 
                    ...prev, 
                    firebase: `Đã xảy ra lỗi: ${error.message}. Vui lòng thử lại.` 
                }));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSwitchToSignIn = () => {
        setIsSignIn(true);
        setShowEmailExistsMessage(false);
        setErrors({});
    };

    const handleSwitchToSignUp = () => {
        setIsSignIn(false);
        setShowEmailExistsMessage(false);
        setErrors({});
        // Clear name field since we're switching to sign up
        setFormData(prev => ({ ...prev, name: '' }));
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!resetPasswordEmail) {
            setErrors(prev => ({ ...prev, resetEmail: 'Vui lòng nhập email' }));
            return;
        }
        
        if (!/\S+@\S+\.\S+/.test(resetPasswordEmail)) {
            setErrors(prev => ({ ...prev, resetEmail: 'Email không hợp lệ' }));
            return;
        }

        setIsLoading(true);
        setErrors(prev => ({ ...prev, resetEmail: '', firebase: '' })); // Clear firebase error too
        
        try {
            // Kiểm tra email có tồn tại hay không
            console.log("Kiểm tra email:", resetPasswordEmail);
            const methods = await fetchSignInMethodsForEmail(auth, resetPasswordEmail);
            console.log("Sign-in methods:", methods);
            
            if (methods.length === 0) {
                // Email không tồn tại
                setErrors(prev => ({ ...prev, resetEmail: 'Email này chưa được đăng ký. Vui lòng kiểm tra lại hoặc đăng ký tài khoản mới.' }));
                return;
            }
            
            // Email tồn tại, gửi reset email
            await sendPasswordResetEmail(auth, resetPasswordEmail);
            setResetPasswordMessage('Đã gửi email khôi phục. Vui lòng kiểm tra hộp thư của bạn.');
            setResetPasswordEmail('');
            
        } catch (error) {
            console.error("Lỗi reset password:", error);
            console.error("Error code:", error.code);
            
            if (error.code === 'auth/invalid-email') {
                setErrors(prev => ({ ...prev, resetEmail: 'Email không hợp lệ' }));
            } else if (error.code === 'auth/too-many-requests') {
                setErrors(prev => ({ ...prev, resetEmail: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.' }));
            } else {
                // Nếu có lỗi khác, vẫn thử gửi email (fallback)
                try {
                    await sendPasswordResetEmail(auth, resetPasswordEmail);
                    setResetPasswordMessage('Đã gửi email khôi phục (nếu email tồn tại). Vui lòng kiểm tra hộp thư của bạn.');
                    setResetPasswordEmail('');
                } catch (sendError) {
                    setErrors(prev => ({ ...prev, resetEmail: `Có lỗi xảy ra: ${error.message}` }));
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleShowResetPassword = () => {
        setShowResetPassword(true);
        setResetPasswordEmail(formData.email || '');
        setResetPasswordMessage('');
        setErrors({}); // Clear all errors including firebase error
    };

    const handleBackToLogin = () => {
        setShowResetPassword(false);
        setResetPasswordEmail('');
        setResetPasswordMessage('');
        setErrors({}); // Clear all errors
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
                            {showResetPassword ? 'Khôi phục mật khẩu' : (isSignIn ? 'Đăng nhập' : 'Đăng ký')}
                        </h1>
                        
                        {showResetPassword ? (
                            /* Reset Password Form */
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Nhập email của bạn"
                                        value={resetPasswordEmail}
                                        onChange={(e) => setResetPasswordEmail(e.target.value)}
                                        className={`w-full px-4 py-3 bg-gray-700 text-white rounded-md border ${
                                            errors.resetEmail ? 'border-red-500' : 'border-gray-600'
                                        } focus:outline-none focus:border-white focus:bg-gray-600`}
                                    />
                                    {errors.resetEmail && (
                                        <p className="text-red-500 text-sm mt-1">{errors.resetEmail}</p>
                                    )}
                                </div>
                                
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-red-600 text-white py-3 rounded-md font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Đang gửi...' : 'Gửi email khôi phục'}
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={handleBackToLogin}
                                    className="w-full bg-gray-600 text-white py-3 rounded-md font-medium hover:bg-gray-700 transition-colors"
                                >
                                    Quay lại đăng nhập
                                </button>
                            </form>
                        ) : (
                            /* Login/Register Form */
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
                        )}

                        {/* Reset Password Success Message */}
                        {resetPasswordMessage && (
                            <div className="mt-4 p-3 bg-green-900/50 border border-green-600 rounded-md">
                                <p className="text-green-300 text-sm">{resetPasswordMessage}</p>
                            </div>
                        )}

                        {/* Thông báo email đã tồn tại với các hành động */}
                        {showEmailExistsMessage && (
                            <div className="mt-4 p-3 bg-yellow-900/50 border border-yellow-600 rounded-md">
                                <p className="text-yellow-300 text-sm mb-2">
                                    Email này đã được đăng ký trước đó.
                                </p>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={handleShowResetPassword}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 transition-colors"
                                    >
                                        Đăng nhập bằng email này
                                    </button>
                                    <button
                                        onClick={handleShowResetPassword}
                                        className="text-blue-400 hover:text-blue-300 text-sm text-center"
                                    >
                                        Quên mật khẩu?
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Firebase error message */}
                        {errors.firebase && (
                            <div className="mt-4 p-3 bg-red-900/50 border border-red-600 rounded-md">
                                <p className="text-red-300 text-sm">{errors.firebase}</p>
                            </div>
                        )}

                        {isSignIn && !showResetPassword && (
                            <div className="mt-4 text-center">
                                <button 
                                    onClick={handleShowResetPassword}
                                    className="text-gray-300 hover:text-white text-sm"
                                >
                                    Quên mật khẩu?
                                </button>
                            </div>
                        )}

                        {!showResetPassword && (
                            <div className="mt-6 text-gray-300 text-sm">
                                {isSignIn ? (
                                    <>
                                        Bạn mới tham gia Netflix?{' '}
                                        <button 
                                            onClick={handleSwitchToSignUp}
                                            className="text-white hover:underline"
                                        >
                                            Đăng ký ngay
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Đã có tài khoản?{' '}
                                        <button 
                                            onClick={handleSwitchToSignIn}
                                            className="text-white hover:underline"
                                        >
                                            Đăng nhập ngay
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                        {!showResetPassword && (
                            <div className="mt-4 text-xs text-gray-400">
                                <p>
                                    Trang này được bảo vệ bởi reCAPTCHA của Google để đảm bảo bạn không phải là bot.{' '}
                                    <a href="#" className="text-blue-500 hover:underline">Tìm hiểu thêm</a>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}