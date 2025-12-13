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

    const TimeUnit = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center">
            <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-lg group-hover:bg-primary/30 transition-colors" />
                <div className="relative bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-3 w-16 md:w-20 h-16 md:h-20 flex items-center justify-center">
                    <span className="text-2xl md:text-3xl font-bold text-white font-heading">
                        {value.toString().padStart(2, '0')}
                    </span>
                </div>
            </div>
            <span className="text-xs md:text-sm text-slate-400 mt-2 uppercase tracking-wider font-medium">{label}</span>
        </div>
    )

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
