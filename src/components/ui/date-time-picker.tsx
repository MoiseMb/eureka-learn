"use client";

import { useState, forwardRef } from "react";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { fr } from "date-fns/locale";

import "react-datepicker/dist/react-datepicker.css";

// Enregistrer la locale française
registerLocale("fr", fr);

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date | null) => void;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  placeholderText?: string;
  showTimeSelect?: boolean;
  disabled?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  className,
  minDate,
  maxDate,
  placeholderText = "Sélectionner une date",
  showTimeSelect = true,
  disabled = false
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const CustomInput = forwardRef<
    HTMLButtonElement,
    { value?: string; onClick?: () => void }
  >(({ value, onClick }, ref) => (
    <Button
      variant="outline"
      className={cn(
        "w-[280px] justify-start text-left font-normal",
        !value && "text-muted-foreground",
        className
      )}
      onClick={onClick}
      disabled={disabled}
      ref={ref}
    >
      <Calendar className="mr-2 h-4 w-4" />
      {value || placeholderText}
    </Button>
  ));
  CustomInput.displayName = "CustomInput";

  return (
    <div className="relative">
      <ReactDatePicker
        selected={value}
        onChange={onChange}
        showTimeSelect={showTimeSelect}
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="Pp"
        locale="fr"
        minDate={minDate}
        maxDate={maxDate}
        customInput={<CustomInput />}
        onCalendarOpen={() => setIsOpen(true)}
        onCalendarClose={() => setIsOpen(false)}
        disabled={disabled}
        calendarClassName={cn("!bg-popover !border-border", "react-datepicker")}
        className={cn("!w-full", className)}
        popperClassName="z-50"
        timeCaption="Heure"
        previousMonthButtonLabel="Mois précédent"
        nextMonthButtonLabel="Mois suivant"
        popperModifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 8]
            },
            fn: ({ x, y }) => ({ x, y })
          },
          {
            name: "preventOverflow",
            options: {
              padding: 8
            },
            fn: ({ x, y }) => ({ x, y })
          }
        ]}
        popperPlacement="bottom-start"
      />
    </div>
  );
}
