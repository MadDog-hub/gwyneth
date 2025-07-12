import { useCountdown } from "@/hooks/useCountdown";

interface CountdownTimerProps {
  targetDate: string;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  return (
    <div className="flex justify-center space-x-4 md:space-x-8">
      <div className="text-center">
        <div className="font-cinzel text-4xl md:text-6xl font-bold pulse-gold text-[#fbda2d]">
          {days.toString().padStart(3, '0')}
        </div>
        <div className="font-opensans text-slate-gray uppercase tracking-wider text-sm">
          Days
        </div>
      </div>
      <div className="text-center">
        <div className="font-cinzel text-4xl md:text-6xl font-bold pulse-gold text-[#fbdc3a]">
          {hours.toString().padStart(2, '0')}
        </div>
        <div className="font-opensans text-slate-gray uppercase tracking-wider text-sm">
          Hours
        </div>
      </div>
      <div className="text-center">
        <div className="font-cinzel text-4xl md:text-6xl font-bold pulse-gold text-[#fadc3f]">
          {minutes.toString().padStart(2, '0')}
        </div>
        <div className="font-opensans text-slate-gray uppercase tracking-wider text-sm">
          Minutes
        </div>
      </div>
      <div className="text-center">
        <div className="font-cinzel text-4xl md:text-6xl font-bold pulse-gold text-[#fadd47]">
          44
        </div>
        <div className="font-opensans text-slate-gray uppercase tracking-wider text-sm">
          Seconds
        </div>
      </div>
    </div>
  );
}
