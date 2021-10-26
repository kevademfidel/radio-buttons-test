import * as React from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Box from '@mui/material/Box'

type Menu = {
  id: string
  value: string
}
type MenusGroup = Menu[]
type RadioButtonsGroupProps = {
  radioButtonsObject: {
    menus: MenusGroup[]
    rules: { [key: string]: number[] }
  }
}

const RadioButtonsGroup: React.FC<RadioButtonsGroupProps> = ({
  radioButtonsObject: {
    menus,
    rules,
  }
}) => {
  const [ activeRadioButton, setActiveRadioButton ] = React.useState<(string)[]>([])
  const [ currentRules, setCurrentRules ] = React.useState<number[][]>([])
  const isRadioButtonIncomplete = !activeRadioButton[menus.length-1]

  const handleChange = (index: number) => (event: React.BaseSyntheticEvent) => {
    const tempActiveRadioButton = [...activeRadioButton]
    tempActiveRadioButton[index] = event.target.value
    
    setActiveRadioButton(tempActiveRadioButton)

    calculateRules(index, tempActiveRadioButton)
  }

  const calculateRules = (index: number, tempActiveRadioButton: (string)[]) => {
    const isNotLastIndex = index !== menus.length-1
    if(isNotLastIndex) {
      const tempCurrentRules = [...currentRules]
      const currentRadioButtonId = tempActiveRadioButton[index]

      if(currentRadioButtonId !== undefined) {
        tempCurrentRules[index] = rules[currentRadioButtonId] || []
        setCurrentRules(tempCurrentRules)
      }
    }
  }

  const isNotCompatible = (currentRadioButtonId: string) => {
    const firstGroupIsNotSelected = activeRadioButton[0] === undefined
    if(firstGroupIsNotSelected) {
      return true
    } 
    const flattenRules = currentRules.flat()

    return flattenRules.includes(Number(currentRadioButtonId))
  }

  return (
    <form>
      <Box>
        {menus.map((menuGroup, index) => (
          <FormControl 
            key={`radio-group-${index}`}
            component="fieldset"
          >
            <FormLabel component="legend">Group {index+1}</FormLabel>

            <RadioGroup
              onChange={handleChange(index)}
              value={activeRadioButton[index]}
            >
              {menuGroup.map(({id, value}) => (
                <FormControlLabel
                  key={`${id}-${value}`}
                  value={id}
                  control={<Radio />}
                  label={value}
                  disabled={index===0 ? false : isNotCompatible(id)}
                />
              ))}
            </RadioGroup>
          </FormControl>
        ))}
      </Box>
      <input type="submit" value="Submit" disabled={isRadioButtonIncomplete}/>
    </form>
  )
}

export default RadioButtonsGroup