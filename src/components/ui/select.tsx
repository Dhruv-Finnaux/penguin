import React, { type Ref, forwardRef, useCallback, useEffect, useMemo, useState } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import clsx from "clsx"
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react"
import ReactSelect, {
  type ActionMeta,
  type CSSObjectWithLabel,
  type ClearIndicatorProps,
  type DropdownIndicatorProps,
  type MenuListProps,
  type OptionProps,
  createFilter,
  components as reactSelectComponents,
} from "react-select"
import { useVisual } from "@/contexts/visual.ctx"
import { cn } from "@/lib/utils"
import { Scroller } from "./scroller"

const selectAllOption = {
  value: "<SELECT_ALL>",
  label: "SELECT ALL",
}

type ReactSelectProps = React.ComponentPropsWithoutRef<typeof ReactSelect>
export type SelectProps = {
  error?: boolean
  readOnly?: boolean
  options?: any[]
  value?: any
  onChange?: (value: any, actionMeta?: any) => void
} & Omit<ReactSelectProps, "onChange">

export const Select = forwardRef<any, SelectProps>(
  (
    {
      options,
      isMulti = false,
      value,
      error,
      onChange,
      readOnly = false,
      getOptionLabel,
      getOptionValue,
      ...props
    },
    ref: Ref<any>,
  ) => {
    const { changeCanCloseAnyOpenDialog } = useVisual()

    options = useMemo(() => {
      if (!options) return []
      return options
    }, [options])
    const [internalOptions, setInternalOptions] = useState<any>([])

    const isSelectAllSelected = useMemo(() => {
      return (
        isMulti && Array.isArray(options) && Array.isArray(value) && value.length === options.length
      )
    }, [isMulti, options, value])

    const getOptionValueInternal = useCallback(
      (option: any) => {
        if (option?.value === selectAllOption.value) return selectAllOption.value
        if (typeof getOptionValue === "function") return getOptionValue(option)
        return option?.value ?? null
      },
      [getOptionValue],
    )

    const getOptionLabelInternal = useCallback(
      (option: any) => {
        if (option?.value === selectAllOption.value) return selectAllOption.label
        if (typeof getOptionLabel === "function") return getOptionLabel(option)
        return option?.label
      },
      [getOptionLabel],
    )

    const onInternalChange = useCallback(
      (newValue: any, actionMeta: ActionMeta<any>) => {
        if (readOnly) return

        const { action, option, removedValue } = actionMeta

        let selectedValue = newValue

        if (isMulti) {
          if (action === "select-option" && option.value === selectAllOption.value) {
            selectedValue = options
          } else if (
            (action === "deselect-option" && option.value === selectAllOption.value) ||
            (action === "remove-value" && removedValue.value === selectAllOption.value)
          ) {
            selectedValue = []
          } else if (actionMeta.action === "deselect-option" && isSelectAllSelected) {
            selectedValue = options?.filter(({ value }) => value !== getOptionValueInternal(option))
          } else {
            selectedValue = newValue || []
          }

          selectedValue = selectedValue?.map((item: any) => getOptionValueInternal(item))
        } else {
          selectedValue = getOptionValueInternal(selectedValue)
        }

        onChange?.(selectedValue, actionMeta)
      },

      [isMulti, isSelectAllSelected, options, readOnly, getOptionValueInternal, onChange],
    )

    const internalValue = useMemo(() => {
      let selectedValue = value
      if (Array.isArray(options) && (selectedValue !== null || selectedValue !== undefined)) {
        if (isMulti && Array.isArray(selectedValue)) {
          const arr = []
          for (const val of selectedValue) {
            for (const option of options) {
              if (getOptionValueInternal(option) === val) {
                arr.push(option)
                break
              }
            }
          }
          selectedValue = arr
        } else {
          for (const option of options) {
            if (getOptionValueInternal(option) === selectedValue) {
              selectedValue = option
              break
            }
          }
        }
      }
      return isMulti && isSelectAllSelected ? [selectAllOption] : selectedValue
    }, [isMulti, value, options, isSelectAllSelected, getOptionValueInternal])

    const isOptionSelected = useCallback(
      (option: any) => {
        if (internalValue === null || internalValue === undefined) return false

        if (!Array.isArray(internalValue))
          return getOptionValueInternal(option) === getOptionValueInternal(internalValue)

        return (
          internalValue?.some(({ value }) => value === getOptionValueInternal(option)) ||
          isSelectAllSelected
        )
      },
      [internalValue, isSelectAllSelected, getOptionValueInternal],
    )

    const setOptions = useCallback(
      (options: any) => {
        setInternalOptions(
          isMulti && Array.isArray(options) ? [selectAllOption, ...options] : options,
        )
      },
      [isMulti],
    )

    const sortSelectedOptionsOnTop = useCallback(() => {
      if (options === null || options === undefined) return []
      if (internalValue === null || internalValue === undefined) return options

      const selectedOptions: any[] = []
      const notSelectedOptions: any[] = []

      const set = new Set()

      if (Array.isArray(internalValue)) {
        for (const val of internalValue) set.add(getOptionValueInternal(val))
      } else {
        set.add(getOptionValueInternal(internalValue))
      }

      let count = 0
      for (let option of options) {
        option = { ...option, __index: count++ }
        if (set.has(getOptionValueInternal(option))) selectedOptions.push(option)
        else notSelectedOptions.push(option)
      }

      return [...selectedOptions, ...notSelectedOptions]
    }, [options, internalValue, getOptionValueInternal])

    useEffect(() => {
      setOptions(options)
    }, [setOptions, options])

    const filterOptions = useMemo(() => {
      const filterConfig = {
        ignoreCase: true,
        ignoreAccents: true,
        matchFrom: "any",
        stringify: (option: any) => `${getOptionLabelInternal(option?.data)}`,
        trim: true,
      } as const
      return createFilter(filterConfig)
    }, [getOptionLabelInternal])

    useEffect(() => {
      return () => changeCanCloseAnyOpenDialog?.(true)
    }, [changeCanCloseAnyOpenDialog])

    return (
      <ReactSelect
        {...props}
        isSearchable={readOnly ? false : (props.isSearchable ?? true)}
        menuIsOpen={readOnly ? false : props.menuIsOpen}
        isClearable={readOnly ? false : props.isClearable}
        isMulti={isMulti}
        filterOption={filterOptions}
        onMenuOpen={() => {
          changeCanCloseAnyOpenDialog?.(false)
          props.onMenuOpen?.()
          setOptions(sortSelectedOptionsOnTop())
        }}
        onMenuClose={() => {
          changeCanCloseAnyOpenDialog?.(true)
        }}
        tabSelectsValue={false}
        getOptionLabel={getOptionLabelInternal}
        getOptionValue={getOptionValueInternal}
        menuShouldScrollIntoView
        menuPosition="fixed"
        menuPortalTarget={typeof document === "undefined" ? undefined : document.body}
        ref={ref}
        onChange={onInternalChange}
        isOptionSelected={isOptionSelected}
        options={internalOptions}
        value={internalValue}
        closeMenuOnSelect={!isMulti}
        blurInputOnSelect={false}
        hideSelectedOptions={false}
        menuPlacement="auto"
        unstyled
        styles={{
          input: (base) => base,
          multiValueLabel: (base) => base,
          control: (base) => ({ ...base, transition: "none" }) as CSSObjectWithLabel,
          menuPortal: (base) => ({ ...base, zIndex: 9999, pointerEvents: "auto" }),
        }}
        classNames={{
          control: ({ isFocused, isDisabled }) => {
            return cn(
              controlStyles.base,
              isDisabled &&
                "!cursor-not-allowed pointer-events-auto opacity-65 hover:bg-background",
              isFocused && `border-ring outline-none ring-2 ring-ring/20`,
              isFocused && error && "!ring-destructive/20 ring-2 border-destructive",
              readOnly && controlStyles.readOnly,
            )
          },
          placeholder: () => placeholderStyles,
          input: () => selectInputStyles,
          valueContainer: () => valueContainerStyles,
          singleValue: () => singleValueStyles,
          multiValue: () => multiValueStyles,
          multiValueLabel: () => multiValueLabelStyles,
          multiValueRemove: () => multiValueRemoveStyles,
          indicatorsContainer: () => indicatorsContainerStyles,
          clearIndicator: () => clearIndicatorStyles,
          indicatorSeparator: () => indicatorSeparatorStyles,
          dropdownIndicator: () => dropdownIndicatorStyles,
          menu: () => menuStyles,
          groupHeading: () => groupHeadingStyles,
          noOptionsMessage: () => noOptionsMessageStyles,
        }}
        components={{
          DropdownIndicator: readOnly ? undefined : DropdownIndicator,
          ClearIndicator,
          ValueContainer,
          Option,
          MenuList,
          Menu,

          MultiValueRemove: (props) => (
            <reactSelectComponents.MultiValueRemove {...props}>
              <XIcon />
            </reactSelectComponents.MultiValueRemove>
          ),
        }}
      />
    )
  },
)

const controlStyles = {
  base: "flex w-full rounded-md !min-h-9 !max-h-9 border bg-background/50 px-3 py-1 text-sm hover:bg-accent/30",
  readOnly: "bg-accent/30 !cursor-not-allowed",
}
const placeholderStyles = "text-muted-foreground"
const selectInputStyles = ""
const valueContainerStyles = ""
const singleValueStyles = ""
const multiValueStyles = "bg-body-800 rounded items-center py-2 px-3"
const multiValueLabelStyles = "leading-6"
const multiValueRemoveStyles =
  "border border-body-600 hover:text-red-800 text-muted-foreground hover:border-destructive rounded-md hover:bg-transparent"
const indicatorsContainerStyles = ""
const clearIndicatorStyles = "text-muted-foreground hover:text-destructive"
const indicatorSeparatorStyles = "bg-body-700"
const dropdownIndicatorStyles = "text-muted-foreground"
const menuStyles = "p-1 my-1 shadow-md border bg-popover !scrollbar-hide rounded-md"
const groupHeadingStyles = "ml-3 mt-2 mb-1 text-muted-foreground text-sm"
const noOptionsMessageStyles = "text-muted-foreground p-2 rounded-sm"

const DropdownIndicator = (props: DropdownIndicatorProps) => {
  return (
    <reactSelectComponents.DropdownIndicator {...props}>
      <ChevronDownIcon className="size-4" />
    </reactSelectComponents.DropdownIndicator>
  )
}

const ClearIndicator = (props: ClearIndicatorProps) => {
  return (
    <reactSelectComponents.ClearIndicator {...props}>
      <XIcon className="size-4" />
    </reactSelectComponents.ClearIndicator>
  )
}
const ValueContainer = ({ children, ...props }: any) => {
  let values = children?.[0]
  const input = children?.[1]

  if (Array.isArray(values)) {
    if (values.length === 1 && values[0].props.data.value === selectAllOption.value) {
      values = "All Selected"
    } else values = `${values.length} selected`
  }

  return (
    <reactSelectComponents.ValueContainer {...props}>
      {values}
      <span className="h-full w-2"></span>
      {input}
    </reactSelectComponents.ValueContainer>
  )
}

const Option = (props: OptionProps) => {
  return (
    <reactSelectComponents.Option {...props}>
      <div
        onMouseMove={undefined}
        onMouseOver={undefined}
        className={cn(
          "group mb-1 flex items-center gap-2 rounded px-3 py-1.5 text-sm hover:bg-popover-foreground/10",
          props.isFocused && "bg-popover-foreground/5",
          props.isDisabled && "line-through",
        )}>
        {props.isMulti ? (
          <>
            <div
              className={clsx(
                "flex max-h-5 min-h-5 min-w-5 max-w-5 items-center justify-center rounded-md border-[1.6px] border-popover-foreground/40 text-primary-foreground duration-150",
                props.isSelected ? "!border-transparent bg-primary/80" : "bg-transparent",
              )}>
              <CheckIcon
                strokeWidth={2}
                className={clsx(
                  "size-4 duration-150",
                  props.isSelected ? "scale-100 opacity-100" : "scale-50 opacity-0",
                )}
              />
            </div>
            {props.children}
          </>
        ) : (
          <>
            {props.children}
            {props.isSelected && <CheckIcon className="ml-auto size-4 shrink-0" />}
          </>
        )}
      </div>
    </reactSelectComponents.Option>
  )
}

const Menu = (props: React.ComponentPropsWithoutRef<typeof reactSelectComponents.Menu>) => (
  <reactSelectComponents.Menu className="duration-150 animate-in fade-in-0" {...props}>
    {props.children}
  </reactSelectComponents.Menu>
)

const MenuList = ({ children, ...props }: MenuListProps) => {
  if (!Array.isArray(children) || children.length < 100) {
    return <reactSelectComponents.MenuList {...props}>{children}</reactSelectComponents.MenuList>
  }

  return <VirtualMenuList {...props}>{children}</VirtualMenuList>
}

interface VirtualMenuListProps extends MenuListProps {
  children: any[]
}
const VirtualMenuList = ({ children, ...props }: VirtualMenuListProps) => {
  const menuClassNames =
    "relative z-0 scrollbar-thin scrollbar-track-background scrollbar-thumb-foreground/20"
  const parentRef = React.useRef(null)

  const rowVirtualizer = useVirtualizer({
    count: Array.isArray(children) ? children.length : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  })

  const items = rowVirtualizer.getVirtualItems()

  return (
    <Scroller
      {...props.innerProps}
      ref={parentRef}
      orientation={"vertical"}
      size={50}
      withNavigation
      className={menuClassNames}
      offset={10}
      style={{
        height: props.maxHeight - 12,
        contain: "strict",
      }}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${items[0]?.start ?? 0}px)`,
          }}>
          {items.map((virtualItem) => {
            return (
              <div
                data-index={virtualItem.index}
                ref={rowVirtualizer.measureElement}
                key={virtualItem.key}>
                {children?.[virtualItem.index]}
              </div>
            )
          })}
        </div>
      </div>
    </Scroller>
  )
}
Select.displayName = "Select"
