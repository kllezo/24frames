"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./DatePickerPopover.module.css";

interface DatePickerPopoverProps {
  value: string;
  startDate?: string;
  endDate?: string;
  isTBD?: boolean;
  onChange: (formattedSummary: string, startDate?: string, endDate?: string, isTBD?: boolean) => void;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function formatDateDisplay(d: Date): string {
  const day = d.getDate();
  const month = MONTH_NAMES[d.getMonth()].slice(0, 3);
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

function formatRangeDisplay(start: Date, end: Date): string {
  const startDay = start.getDate();
  const endDay = end.getDate();
  const startMonth = MONTH_NAMES[start.getMonth()].slice(0, 3);
  const endMonth = MONTH_NAMES[end.getMonth()].slice(0, 3);
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  if (startYear === endYear && startMonth === endMonth) {
    if (startDay === endDay) {
      return `${startDay} ${startMonth} ${startYear}`;
    }
    return `${startDay}–${endDay} ${startMonth} ${startYear}`;
  }

  if (startYear === endYear) {
    return `${startDay} ${startMonth} – ${endDay} ${endMonth} ${startYear}`;
  }

  return `${startDay} ${startMonth} ${startYear} – ${endDay} ${endMonth} ${endYear}`;
}

export default function DatePickerPopover({
  value,
  startDate: initStart,
  endDate: initEnd,
  isTBD = false,
  onChange,
}: DatePickerPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Initialize selected dates
  const [selectedStart, setSelectedStart] = useState<Date | null>(
    initStart ? new Date(initStart) : null
  );
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(
    initEnd ? new Date(initEnd) : null
  );
  const [isUndecided, setIsUndecided] = useState<boolean>(isTBD || value === "Dates not finalized yet");

  // Current view month (defaults to start date or today)
  const [viewDate, setViewDate] = useState<Date>(() => {
    if (selectedStart && !isNaN(selectedStart.getTime())) {
      return new Date(selectedStart.getFullYear(), selectedStart.getMonth(), 1);
    }
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  // Track if clicking next sets the end date
  const [isSelectingRangeEnd, setIsSelectingRangeEnd] = useState(false);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle month navigation
  const prevMonth = useCallback(() => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const nextMonth = useCallback(() => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  // Handle date selection click
  const handleDateClick = (dayDate: Date) => {
    setIsUndecided(false);

    if (!selectedStart || isSelectingRangeEnd) {
      // First click: select start date
      setSelectedStart(dayDate);
      setSelectedEnd(null);
      setIsSelectingRangeEnd(false);

      const summary = formatDateDisplay(dayDate);
      onChange(summary, dayDate.toISOString(), undefined, false);
    } else {
      // Second click: select end date
      if (dayDate.getTime() < selectedStart.getTime()) {
        // If clicked date is before start date, make it the new start date
        setSelectedStart(dayDate);
        setSelectedEnd(null);
        setIsSelectingRangeEnd(false);

        const summary = formatDateDisplay(dayDate);
        onChange(summary, dayDate.toISOString(), undefined, false);
      } else if (dayDate.getTime() === selectedStart.getTime()) {
        // Same day -> single day event
        setSelectedEnd(null);
        setIsSelectingRangeEnd(false);

        const summary = formatDateDisplay(dayDate);
        onChange(summary, dayDate.toISOString(), undefined, false);
      } else {
        // Valid end date -> range
        setSelectedEnd(dayDate);
        setIsSelectingRangeEnd(true);

        const summary = formatRangeDisplay(selectedStart, dayDate);
        onChange(summary, selectedStart.toISOString(), dayDate.toISOString(), false);
      }
    }
  };

  const handleTbdToggle = () => {
    const nextVal = !isUndecided;
    setIsUndecided(nextVal);
    if (nextVal) {
      setSelectedStart(null);
      setSelectedEnd(null);
      onChange("Dates not finalized yet", undefined, undefined, true);
    } else {
      onChange("", undefined, undefined, false);
    }
  };

  const handleClear = () => {
    setSelectedStart(null);
    setSelectedEnd(null);
    setIsUndecided(false);
    onChange("", undefined, undefined, false);
  };

  // Build grid days
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const isToday = (d: number) =>
    today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;

  const isStart = (d: number) => {
    if (!selectedStart) return false;
    return (
      selectedStart.getDate() === d &&
      selectedStart.getMonth() === month &&
      selectedStart.getFullYear() === year
    );
  };

  const isEnd = (d: number) => {
    if (!selectedEnd) return false;
    return (
      selectedEnd.getDate() === d &&
      selectedEnd.getMonth() === month &&
      selectedEnd.getFullYear() === year
    );
  };

  const isInRange = (d: number) => {
    if (!selectedStart || !selectedEnd) return false;
    const current = new Date(year, month, d).getTime();
    return current > selectedStart.getTime() && current < selectedEnd.getTime();
  };

  return (
    <div className={styles.calendarContainer} ref={popoverRef}>
      {/* Trigger Display Field */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.triggerButton} ${isOpen ? styles.triggerButtonOpen : ""}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span className={styles.calendarIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </span>

        <span className={value ? styles.triggerValue : styles.triggerPlaceholder}>
          {value || "Select celebration date or range..."}
        </span>

        <span className={styles.chevronIcon} aria-hidden="true">▾</span>
      </button>

      {/* Popover Calendar Grid */}
      {isOpen && (
        <div className={styles.popoverDropdown} role="dialog" aria-label="Select date range">
          {/* Calendar Header with Month Controls */}
          <div className={styles.popoverHeader}>
            <button
              type="button"
              onClick={prevMonth}
              className={styles.monthNavBtn}
              aria-label="Previous Month"
            >
              ‹
            </button>
            <span className={styles.monthTitle}>
              {MONTH_NAMES[month]} {year}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className={styles.monthNavBtn}
              aria-label="Next Month"
            >
              ›
            </button>
          </div>

          {/* Weekday Names */}
          <div className={styles.weekdayRow}>
            {WEEKDAYS.map((wd) => (
              <span key={wd} className={styles.weekdayLabel}>
                {wd}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className={styles.daysGrid}>
            {/* Blank offset tiles for previous month */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <span key={`blank-${i}`} className={styles.blankDay} />
            ))}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const thisDate = new Date(year, month, day);
              const selectedStartDay = isStart(day);
              const selectedEndDay = isEnd(day);
              const inRange = isInRange(day);
              const currentToday = isToday(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDateClick(thisDate)}
                  className={`${styles.dayButton} ${
                    selectedStartDay ? styles.dayStart : ""
                  } ${selectedEndDay ? styles.dayEnd : ""} ${
                    inRange ? styles.dayInRange : ""
                  } ${currentToday ? styles.dayToday : ""}`}
                  aria-label={`${day} ${MONTH_NAMES[month]} ${year}`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer Controls */}
          <div className={styles.popoverFooter}>
            <label className={styles.tbdLabel}>
              <input
                type="checkbox"
                checked={isUndecided}
                onChange={handleTbdToggle}
                className={styles.tbdCheckbox}
              />
              <span>Dates not finalized yet</span>
            </label>

            <div className={styles.actionButtonsRow}>
              {(selectedStart || isUndecided) && (
                <button
                  type="button"
                  onClick={handleClear}
                  className={styles.clearBtn}
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={styles.doneBtn}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
