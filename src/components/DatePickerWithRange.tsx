"use client"


import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import { type DateRange } from "react-day-picker"
import type { RefCallBack } from "react-hook-form"
import dayjs from "dayjs";

type DatePickerWithRangeProps = {
    ref: RefCallBack,
    value: { from: string, to: string },
    onchange: (val: DateRange | undefined) => void
}

export function DatePickerWithRange({ onchange, ref, value }: DatePickerWithRangeProps) {

    const [date, setDate] = useState<DateRange | undefined>({
        from: value.from ? dayjs(value.from, 'DD/MM/YYYY').toDate() : new Date(new Date().getFullYear(), 0, 20),
        to: value.to ? dayjs(value.to, 'DD/MM/YYYY').toDate() : new Date(new Date().getFullYear(), 0, 20),
    })

    const handleSelect = (selectedDate: DateRange | undefined) => {
        setDate(selectedDate);
        onchange(selectedDate)
    }

    return (
        <Field className="mx-auto w-60" ref={ref}>
            <FieldLabel htmlFor="date-picker-range">Date Picker Range</FieldLabel>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" id="date-picker-range"
                        className="justify-start px-2.5 font-normal"><CalendarIcon data-icon="inline-start" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}</Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleSelect}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </Field>
    )
}
