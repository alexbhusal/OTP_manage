import { RiLoader2Line } from "react-icons/ri";
import { MdVerified } from "react-icons/md";
import { MdPhoneLocked } from "react-icons/md";
import "./App.css";
import OtpInput from "otp-input-react";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "./firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";

const App = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }

  function onSignup() {
    setLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+" + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sended successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
        toast.success("Now you can login!!");
        setTimeout(() => {
        window.location.href = "http://localhost:8888/login"; 
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error("Please enter a valid OTP");
        setOtp("");
      });
  }

  return (
    <section className="bg-black flex items-center justify-center h-screen">
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {user ? (
          <h2 className="text-center text-white font-medium text-2xl">
            <MdVerified size={30} /> Go to login{" "}
            <a href="http://localhost:8888/login">click me</a>
          </h2>
        ) : (
          <div className="w-100 flex flex-col gap-4 rounded-lg p-4">
            <h1 className="text-center leading-normal text-white font-medium text-3xl mb-6">
              OTP Verification
            </h1>
            {showOTP ? (
              <>
                <div className="bg-white text-black w-fit mx-auto p-4 rounded-full">
                  <MdPhoneLocked size={30} className="animate-bounce" />
                </div>
                <label
                  htmlFor="otp"
                  className="font-bold text-xl text-emerald-500 text-center"
                >
                  Enter 6 digit code
                </label>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                  className="opt-container "
                ></OtpInput>
                <button
                  onClick={onOTPVerify}
                  className="bg-red-500 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  {loading && (
                    <RiLoader2Line size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Verify OTP</span>
                </button>
              </>
            ) : (
              <>
                <label htmlFor=""className="font-bold text-xl text-red-700 text-center">
                  Enter your  mobile number to verify your account
                </label>
                <PhoneInput country={"np"} value={ph} onChange={setPh} />
                <button
                  onClick={onSignup}
                  className="bg-pink-900 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  {loading && (
                    <RiLoader2Line size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Send OPT</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default App;
