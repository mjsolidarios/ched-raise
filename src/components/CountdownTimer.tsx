import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface TimeLeft {
    days: number
    hours: number
    minutes: number
    seconds: number
}

interface CountdownTimerProps {
    targetDate: string
}

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <motion.div
        className="flex flex-col items-center"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        <div className="relative group">
            {/* Animated glow effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/30 to-teal-400/30 blur-2xl rounded-xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Main container with enhanced glassmorphism */}
            <motion.div
                className="relative bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 backdrop-blur-xl rounded-2xl p-3 w-20 md:w-24 h-20 md:h-24 flex items-center justify-center shadow-2xl shadow-primary/10 overflow-hidden"
                animate={{
                    borderColor: ["rgba(255,255,255,0.2)", "rgba(8,52,159,0.4)", "rgba(255,255,255,0.2)"],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <span className="text-3xl md:text-4xl font-black text-white font-heading relative z-10">
                    {value.toString().padStart(2, '0')}
                </span>
            </motion.div>
        </div>
        <span className="text-xs md:text-sm text-slate-300 mt-3 uppercase tracking-widest font-semibold">{label}</span>
    </motion.div>
)

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
    const calculateTimeLeft = (): TimeLeft => {
        const difference = +new Date(targetDate) - +new Date()
        let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 }

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            }
        }

        return timeLeft
    }

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return () => clearTimeout(timer)
    })

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex gap-4 md:gap-6 mb-12"
        >
            <TimeUnit value={timeLeft.days} label="Days" />
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <TimeUnit value={timeLeft.minutes} label="Mins" />
            <TimeUnit value={timeLeft.seconds} label="Secs" />
        </motion.div>
    )
}
