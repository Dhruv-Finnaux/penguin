"use client"

import { Spinner, SpinnerProps } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { Transition } from "@headlessui/react"
import { useEffect, useState } from "react"

export function LoadingIndicatorView({
  className,
  spinnerProps
}: {
  className?: string
  spinnerProps?: SpinnerProps
}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)

    return () => {
      setShow(false)
    }
  }, [])

  return (
    <div className={cn("flex flex-1 flex-col items-center justify-center", className)}>
      <Transition
        show={show}
        enter="transition ease-out duration-500"
        enterFrom="transform opacity-0"
        enterTo="transform opacity-100"
        leave="transition ease-in duration-500"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0">
        <div className="flex items-center gap-x-3">
          <Spinner {...spinnerProps} />
        </div>
      </Transition>
    </div>
  )
}
