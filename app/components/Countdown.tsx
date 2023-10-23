"use client";

import clsx from "classnames";
import { useDuration } from "@momentranks/libs";

const MAX_UNIX_TIMESTAMP = 2147483646;
interface Props {
  targetTime: string;
  countdownText?: string;
  size?: "sm" | "md" | "lg" | "xs";
  tooltipPrefix?: string;
  className?: string;
}

export const Countdown = ({
  targetTime,
  countdownText = "time left",
  size = "lg",
  className = "",
}: Props) => {
  const duration = useDuration(targetTime);

  if (!duration) return null;
  const isMaxUnix = new Date(targetTime).getTime() / 1e3 === MAX_UNIX_TIMESTAMP;

  return (
    <div
      className={clsx({
        "flex flex-row items-center space-x-1":
          size === "xs" || size === "sm" || size === "md",
      })}
    >
      <div className={className}>
        {isMaxUnix ? (
          "Forever"
        ) : (
          <>
            {Boolean(duration.years) && <span>{duration.years}yr </span>}
            {Boolean(duration.months) && <span>{duration.months}mo </span>}
            {Boolean(duration.days) && <span>{duration.days}d </span>}
            {Boolean(duration.hours) && <span>{duration.hours}h </span>}
            <span>{duration.minutes}m </span>
            <span>{duration.seconds}s </span>
          </>
        )}
      </div>
      {countdownText && !isMaxUnix && (
        <span
          className={clsx("font-semibold opacity-80", {
            "text-base": size === "lg",
            "text-sm": size === "md",
            "text-xs": size === "sm" || size === "xs",
          })}
        >
          {countdownText}
        </span>
      )}
    </div>
  );
};

export default Countdown;
