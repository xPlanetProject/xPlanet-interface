import React from 'react'
import { Sun, Moon } from 'react-feather'
import styled from 'styled-components'

import { useDarkModeManager } from '@/state/user/hooks'

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};

  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
`

const StyledMoonIcon = styled(Moon)`
  height: 20px;
  width: 20px;

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledSunIcon = styled(Sun)`
  height: 20px;
  width: 20px;

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

export default function SwithTheme() {
  // const node = useRef<HTMLDivElement>()
  const [darkMode, toggleDarkMode] = useDarkModeManager()

  return (
    <StyledMenu>
      <StyledMenuButton onClick={toggleDarkMode}>
        {
          darkMode ? <StyledMoonIcon /> : <StyledSunIcon />
        }
      </StyledMenuButton>
    </StyledMenu>
  )
}
