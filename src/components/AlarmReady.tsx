import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
    onDone?: () => void;
};

export default function AlarmReady({ onDone }: Props) {
    const fireworkContainerRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    /** Spawn fireworks without rerendering **/
    useEffect(() => {
        const container = fireworkContainerRef.current;
        if (!container) return;

        const spawn = () => {
            const fw = document.createElement("div");
            fw.className = "firework absolute";
            fw.style.left = `${Math.random() * 100}%`;
            fw.style.top = `${Math.random() * 100}%`;
            fw.style.animationDelay = `${Math.random() * 0.5}s`;

            container.appendChild(fw);

            setTimeout(() => {
                fw.remove();
            }, 1600);
        };

        const interval = setInterval(spawn, 350 + Math.random() * 350);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center">
            <div className="w-full sm:w-[400px] h-screen relative overflow-hidden bg-slate-900 flex items-center justify-center">

                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-700/40 via-pink-600/30 to-red-500/40 animate-bgMove" />

                {/* Fireworks container (DOM-managed, no re-render) */}
                <div
                    ref={fireworkContainerRef}
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                ></div>

                {/* Smooth ambient particles */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(25)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${6 + Math.random() * 6}s`,
                            }}
                        />
                    ))}
                </div>

                {/* CARD */}
                <div className="relative z-10 mx-5 w-full max-w-md p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl text-center animate-popIn">
                    <div className="text-7xl mb-4 animate-bounceSlow">🍱</div>

                    <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">
                        Pesanan Siap!
                    </h1>

                    <p className="text-white/80 text-base mb-6">
                        Pesanan Anda sudah selesai dan siap diambil.
                    </p>

                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-8 py-3 rounded-full bg-white text-red-600 font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                        OK
                    </button>

                    <div className="text-white/60 text-sm mt-4">
                        Terima kasih telah menunggu ✨
                    </div>
                </div>

                {/* STYLES */}
                <style>{`
                    /* Pop-in card */
                    @keyframes popIn {
                        0% { transform: scale(0.6); opacity: 0; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    .animate-popIn { animation: popIn 0.6s cubic-bezier(.16,.84,.44,1) forwards; }

                    /* Bounce emoji */
                    @keyframes bounceSlow {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-12px); }
                    }
                    .animate-bounceSlow { animation: bounceSlow 2s infinite; }

                    /* Ambient floating dots */
                    @keyframes float {
                        0% { transform: translateY(0); opacity: 0.3; }
                        50% { opacity: 1; }
                        100% { transform: translateY(-60px); opacity: 0.3; }
                    }
                    .animate-float { animation: float linear infinite; }

                    /* Background hue shift */
                    @keyframes bgMove {
                        0% { filter: hue-rotate(0deg); }
                        100% { filter: hue-rotate(360deg); }
                    }
                    .animate-bgMove { animation: bgMove 12s linear infinite; }

                    /* FIREWORKS */
                    .firework {
                        width: 4px;
                        height: 4px;
                        background: transparent;
                        border-radius: 50%;
                        position: absolute;
                        animation: explode 1.4s ease-out forwards;
                    }

                    .firework::before,
                    .firework::after {
                        content: "";
                        position: absolute;
                        inset: 0;
                        background: radial-gradient(circle, white, transparent 70%);
                        border-radius: 50%;
                    }

                    @keyframes explode {
                        0% {
                            transform: scale(0.2);
                            opacity: 0;
                        }
                        40% {
                            opacity: 1;
                            box-shadow:
                                0 -20px 0 2px rgba(255, 255, 255, 0.9),
                                20px 0 0 2px rgba(255, 200, 200, 0.9),
                                -20px 0 0 2px rgba(200, 255, 255, 0.9),
                                0 20px 0 2px rgba(255, 255, 200, 0.9),
                                14px 14px 0 2px rgba(255, 150, 255, 0.9),
                                -14px 14px 0 2px rgba(150, 255, 255, 0.9),
                                14px -14px 0 2px rgba(255, 200, 150, 0.9),
                                -14px -14px 0 2px rgba(200, 150, 255, 0.9);
                        }
                        100% {
                            transform: scale(1.3);
                            opacity: 0;
                            box-shadow:
                                0 -40px 0 0 rgba(255, 255, 255, 0),
                                40px 0 0 0 rgba(255, 200, 200, 0),
                                -40px 0 0 0 rgba(200, 255, 255, 0),
                                0 40px 0 0 rgba(255, 255, 200, 0),
                                28px 28px 0 0 rgba(255, 150, 255, 0),
                                -28px 28px 0 0 rgba(150, 255, 255, 0),
                                28px -28px 0 0 rgba(255, 200, 150, 0),
                                -28px -28px 0 0 rgba(200, 150, 255, 0);
                        }
                    }
                `}</style>
            </div>
        </div>
    );
}