"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { useState } from "react"

type VariableType = "number" | "string" | "boolean"

interface VariableDefinition {
  name: string
  type: VariableType
  key: string
}

interface ConditionConfig {
  variableName: string
  type: VariableType
  operator: string
  value: string | number | boolean
}

const VARIABLE_DEFINITIONS: VariableDefinition[] = [
  { name: "Borrower Individual Age", type: "number", key: "borrowerIndividualAge" },
  { name: "Borrower First Name", type: "string", key: "borrowerFirstName" },
  { name: "Is Primary Borrower", type: "boolean", key: "isPrimaryBorrower" },
]

const OPERATOR_MAPS = {
  number: [
    { label: "Equal to", value: "==" },
    { label: "Not equal to", value: "!=" },
    { label: "Less than", value: "<" },
    { label: "Less than or equal", value: "<=" },
    { label: "Greater than", value: ">" },
    { label: "Greater than or equal", value: ">=" },
  ],
  string: [
    { label: "Equal to", value: "==" },
    { label: "Not equal to", value: "!=" },
    { label: "Starts with", value: "startsWith" },
    { label: "Ends with", value: "endsWith" },
    { label: "Contains", value: "contains" },
  ],
  boolean: [
    { label: "Is", value: "==" },
    { label: "Is not", value: "!=" },
  ],
}

export default function ConditionBuilder() {
  const [config, setConfig] = useState<ConditionConfig>({
    variableName: "Borrower Individual Age",
    type: "number",
    operator: "==",
    value: 18,
  })
  const [generatedExpression, setGeneratedExpression] = useState<string>("")

  const handleVariableChange = (newVariableName: string) => {
    const selectedVariable = VARIABLE_DEFINITIONS.find((v) => v.name === newVariableName)
    if (selectedVariable) {
      setConfig({
        variableName: selectedVariable.name,
        type: selectedVariable.type,
        operator: OPERATOR_MAPS[selectedVariable.type][0].value,
        value:
          selectedVariable.type === "boolean" ? true : selectedVariable.type === "number" ? 0 : "",
      })
    }
  }

  const generateExpression = () => {
    const selectedVariable = VARIABLE_DEFINITIONS.find((v) => v.name === config.variableName)
    if (selectedVariable) {
      const expressionValue = typeof config.value === "string" ? `"${config.value}"` : config.value

      const expr = `${selectedVariable.key} ${config.operator} ${expressionValue}`
      setGeneratedExpression(expr)
    }
  }

  const renderValueInput = () => {
    switch (config.type) {
      case "boolean":
        return (
          <Select
            value={config.value as boolean}
            options={[
              { label: "True", value: true },
              { label: "False", value: false },
            ]}
            onChange={(val) => setConfig((prev) => ({ ...prev, value: val }))}
          />
        )
      case "string":
        return (
          <Input
            type="text"
            value={config.value as string}
            onChange={(e) => setConfig((prev) => ({ ...prev, value: e.target.value }))}
            placeholder="Enter value"
          />
        )
      case "number":
        return (
          <Input
            type="number"
            value={config.value as number}
            onChange={(e) => setConfig((prev) => ({ ...prev, value: Number(e.target.value) }))}
            placeholder="Enter number"
          />
        )
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4 p-4">
      <Card className="grid w-full max-w-xl grid-cols-3 gap-3 p-4">
        <Select
          value={config.variableName}
          options={VARIABLE_DEFINITIONS.map((v) => ({
            label: v.name,
            value: v.name,
          }))}
          onChange={handleVariableChange}
        />
        <Select
          value={config.operator}
          options={OPERATOR_MAPS[config.type]}
          onChange={(val) => setConfig((prev) => ({ ...prev, operator: val }))}
        />
        {renderValueInput()}
      </Card>
      <Button onClick={generateExpression}>Generate Expression</Button>
      {generatedExpression && (
        <Card>
          <code>{generatedExpression}</code>
        </Card>
      )}
    </div>
  )
}

/**
 * <Parser
 *   expr={""}
 *   onSpit={(expr) => {
 *     db.save(expr);
 *   }}
 * />
 */
